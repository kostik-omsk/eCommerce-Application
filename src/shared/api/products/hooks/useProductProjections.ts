import { useEffect, useMemo, useReducer, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ProductProjection } from '@commercetools/platform-sdk';
import { useApiRequest, ApiClient } from '@shared/api/core/';
import {
  type ProductProjectionsQueryArgs,
  productProjectionsQueryArgsReducer,
  ProductProjectionsActionTypes,
} from '@shared/api/products/reducers';
import type { FilterFields } from '@features/ProductsFilter/';

const mapResults = (results: ProductProjection[]) => {
  return results.map((result) => {
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
  });
};

const mapFilter = (filter: string[]): FilterFields => {
  const result: FilterFields = {
    priceRange: [0, 9999],
    color: [],
    releaseDate: [],
    discountedProducts: false,
  };

  const price = filter.find((item) => item.includes('cent'));
  const date = filter.find((item) => item.toLocaleLowerCase().includes('date'));
  const color = filter.find((item) => item.toLocaleLowerCase().includes('color'));
  const discount = filter.find((item) => item.toLocaleLowerCase().includes('discount'));

  if (price) {
    const values = price
      .split(':')[1]
      .replace(/[range]|[(|)]|/gi, '')
      .trim()
      .split(' to ')
      .map(Number);

    result.priceRange = values;
  }

  if (date) {
    const values = date.split(':')[1].replace(/["|,]/gi, '').split(' ');

    result.releaseDate = values;
  }

  if (color) {
    const values = color.split(':')[1].replace(/["|,]/gi, '').split(' ');

    result.color = values;
  }

  if (discount) {
    const value = discount.split(':')[1] === 'true';

    result.discountedProducts = value;
  }

  return result;
};

const productProjectionsQueryArgsInitialValue: ProductProjectionsQueryArgs = {
  priceCurrency: import.meta.env.VITE_CTP_DEFAULT_CURRENCY,
  limit: 20,
  offset: 0,
};

const useProductProjections = (id: string | undefined) => {
  const [queryArgs, dispatch] = useReducer(productProjectionsQueryArgsReducer, productProjectionsQueryArgsInitialValue);
  const prevIdRef = useRef<typeof id>();
  const navigate = useNavigate();

  // on first catalog/:id load
  const isCategoryExistsRequest = useMemo(
    () =>
      id && queryArgs === productProjectionsQueryArgsInitialValue
        ? ApiClient.getInstance().requestBuilder.categories().withId({ ID: id }).get()
        : null,
    [id, queryArgs]
  );

  const { data, error } = useApiRequest(isCategoryExistsRequest);

  const request = useMemo(
    () =>
      queryArgs === productProjectionsQueryArgsInitialValue
        ? null
        : ApiClient.getInstance().requestBuilder.productProjections().search().get({
            queryArgs,
          }),
    [queryArgs]
  );

  const state = useApiRequest(request);

  useEffect(() => {
    if (!id) {
      // catalog
      return dispatch({ type: ProductProjectionsActionTypes.SET_DEFAULT_CATEGORY });
    } else {
      // broken id
      if (!data && error) {
        return navigate('/');
      }
      // new id
      if (id !== prevIdRef.current) {
        prevIdRef.current = id;
        return dispatch({ type: ProductProjectionsActionTypes.SET_CATEGORY, payload: id });
      }
    }
    // eslint-disable-next-line
  }, [id, data, error]);

  return {
    state: {
      products: state.data?.results ? mapResults(state.data.results) : null,
      error: state.error,
      loading: state.loading,
      filter: queryArgs.filter && Array.isArray(queryArgs.filter) ? mapFilter(queryArgs.filter) : null,
      count: state.data && state.data.total !== undefined ? state.data.total : null,
      currentPage: queryArgs.offset / queryArgs.limit + 1,
    },
    dispatch,
  };
};

export { useProductProjections, ProductProjectionsActionTypes };
