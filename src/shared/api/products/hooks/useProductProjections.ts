import { useMemo, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductProjection } from '@commercetools/platform-sdk';
import { ApiClient } from '@app/auth/client';
import { useApiRequest } from '@shared/api/core';
import {
  type ProductProjectionsQueryArgs,
  productProjectionsQueryArgsReducer,
  ProductProjectionsActionTypes,
} from '@shared/api/products/reducers';

const mapResults = (results: ProductProjection[] | null) => {
  return results
    ? results.map((result) => {
        const id = result.id;
        const title = result.name.en;
        const description = result.metaDescription?.en || null;
        const price = result.masterVariant.price;
        const discount = price?.discounted;
        const urlImg = result.masterVariant.images ? result.masterVariant.images[0].url : '';
        let displayedPrice = null;
        let displayedDiscount = null;
        if (price) {
          displayedPrice = price.value.centAmount / Math.pow(10, price.value.fractionDigits);
        }
        if (price && discount) {
          displayedDiscount = discount.value.centAmount / Math.pow(10, price.value.fractionDigits);
        }
        return {
          id: id,
          title: title,
          description: description,
          price: displayedPrice,
          discount: displayedDiscount,
          urlImg: urlImg,
        };
      })
    : [];
};

const productProjectionsQueryArgsInitialValue: ProductProjectionsQueryArgs = {
  limit: 20,
  priceCurrency: import.meta.env.VITE_CTP_DEFAULT_CURRENCY,
};

const useProductProjections = (id: string | undefined) => {
  const [queryArgs, dispatch] = useReducer(productProjectionsQueryArgsReducer, productProjectionsQueryArgsInitialValue);
  const isCategoryExistsRequest = useMemo(
    () => (id ? ApiClient.getInstance().requestBuilder.categories().withId({ ID: id }).get() : null),
    [id]
  );
  const { data, error } = useApiRequest(isCategoryExistsRequest);

  const navigate = useNavigate();

  const request = useMemo(() => {
    if (id && !data && error) {
      navigate('/');

      return null;
    }

    if (id && data && !error) {
      delete queryArgs.fuzzy;
      delete queryArgs['text.en'];

      return ApiClient.getInstance()
        .requestBuilder.productProjections()
        .search()
        .get({
          queryArgs: {
            ...queryArgs,
            'filter.query': `categories.id:subtree("${id}")`,
          },
        });
    }

    if (!id) {
      return ApiClient.getInstance().requestBuilder.productProjections().search().get({
        queryArgs,
      });
    }

    return null;
    // eslint-disable-next-line
  }, [data, error, queryArgs]);

  const state = useApiRequest(request);

  return {
    state: {
      products: mapResults(state.data?.results || null),
      error: state.error,
      loading: state.loading,
    },
    dispatch,
  };
};

export { useProductProjections, ProductProjectionsActionTypes };
