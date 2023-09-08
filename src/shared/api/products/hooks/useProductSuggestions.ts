import { useMemo, useReducer } from 'react';
import { useApiRequest, ApiClient } from '@shared/api/core/';
import type { Suggestion } from '@commercetools/platform-sdk';
import {
  type ProductSuggestionsQueryArgs,
  ProductSuggestionsActionTypes,
  productSuggestionsQueryArgsReducer,
  SEARCH_KEYWORDS_ARG,
} from '@shared/api/products/reducers';

const mapSuggestions = (suggestions: Suggestion[] | null) => {
  return suggestions ? suggestions.map((suggestion) => ({ value: suggestion.text.trim() })) : [];
};

const productSuggestionsQueryArgsInitialValue = {
  limit: 20,
};

const useProductSuggestions = (initialValue: ProductSuggestionsQueryArgs = productSuggestionsQueryArgsInitialValue) => {
  const [queryArgs, dispatch] = useReducer(productSuggestionsQueryArgsReducer, initialValue);

  const request = useMemo(
    () =>
      queryArgs[SEARCH_KEYWORDS_ARG]
        ? ApiClient.getInstance()
            .requestBuilder.productProjections()
            .suggest()
            .get({
              queryArgs: {
                ...queryArgs,
              },
            })
        : null,
    [queryArgs]
  );

  const { data, error, loading } = useApiRequest(request);

  return {
    state: {
      suggestions: mapSuggestions(queryArgs[SEARCH_KEYWORDS_ARG] ? data && data[SEARCH_KEYWORDS_ARG] : null),
      error,
      loading,
    },
    dispatch,
  };
};

export { useProductSuggestions, ProductSuggestionsActionTypes };
