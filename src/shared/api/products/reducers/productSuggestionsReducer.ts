import type { QueryParam } from '@commercetools/sdk-client-v2';

const SEARCH_KEYWORDS_ARG = `searchKeywords.en`;

interface ProductSuggestionsQueryArgs {
  fuzzy?: boolean;
  sort?: string | string[];
  limit?: number;
  offset?: number;
  withTotal?: boolean;
  staged?: boolean;
  [SEARCH_KEYWORDS_ARG]?: string;
  [key: string]: QueryParam;
}

const enum ProductSuggestionsActionTypes {
  SET_SUGGESTIONS = 'SET_SUGGESTIONS',
  CLEAR_SUGGESTIONS = 'CLEAR_SUGGESTIONS',
}

type SetProductSuggestionsAction = {
  type: ProductSuggestionsActionTypes.SET_SUGGESTIONS;
  payload: string;
};

type ProductClearSuggestionsAction = {
  type: ProductSuggestionsActionTypes.CLEAR_SUGGESTIONS;
  payload?: undefined;
};

type ProductSuggestionsActions = SetProductSuggestionsAction | ProductClearSuggestionsAction;

const productSuggestionsQueryArgsReducer = (
  state: ProductSuggestionsQueryArgs,
  { type, payload }: ProductSuggestionsActions
) => {
  switch (type) {
    case ProductSuggestionsActionTypes.SET_SUGGESTIONS: {
      return {
        ...state,
        fuzzy: true,
        [SEARCH_KEYWORDS_ARG]: payload,
      };
    }
    case ProductSuggestionsActionTypes.CLEAR_SUGGESTIONS: {
      delete state.fuzzy;
      delete state[SEARCH_KEYWORDS_ARG];

      return state;
    }
    default: {
      return state;
    }
  }
};

export {
  productSuggestionsQueryArgsReducer,
  ProductSuggestionsActionTypes,
  type ProductSuggestionsQueryArgs,
  SEARCH_KEYWORDS_ARG,
};
