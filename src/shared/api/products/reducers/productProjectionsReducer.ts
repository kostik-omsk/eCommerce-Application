import type { QueryParam } from '@commercetools/sdk-client-v2';
import type { Key } from 'rc-tree/lib/interface';
import type { FilterFields } from '@features/ProductsFilter';

type ProductProjectionsQueryArgs = {
  fuzzy?: boolean;
  fuzzyLevel?: number;
  markMatchingVariants?: boolean;
  filter?: string | string[];
  'filter.facets'?: string | string[];
  'filter.query'?: string | string[];
  facet?: string | string[];
  sort?: string | string[];
  limit: number;
  offset: number;
  withTotal?: boolean;
  staged?: boolean;
  priceCurrency?: string;
  priceCountry?: string;
  priceCustomerGroup?: string;
  priceChannel?: string;
  localeProjection?: string | string[];
  storeProjection?: string;
  expand?: string | string[];
  'text.en'?: string;
  [key: string]: QueryParam;
};

const enum ProductProjectionsActionTypes {
  SET_SEARCH = 'SET_SEARCH',
  CLEAR_SEARCH = 'CLEAR_SEARCH',
  SET_CATEGORY = 'SET_CATEGORY',
  SET_DEFAULT_CATEGORY = 'SET_DEFAULT_CATEGORY',
  SET_SORT = 'SET_SORT',
  CLEAR_SORT = 'CLEAR_SORT',
  SET_FILTER = 'SET_FILTER',
  CLEAR_FILTER = 'CLEAR_FILTER',
  SET_PAGE = 'SET_PAGE',
}

type SetSearchAction = {
  type: ProductProjectionsActionTypes.SET_SEARCH;
  payload: string;
};

type ClearSearchAction = {
  type: ProductProjectionsActionTypes.CLEAR_SEARCH;
  payload?: undefined;
};

type SetCategoryAction = {
  type: ProductProjectionsActionTypes.SET_CATEGORY;
  payload: Key;
};

type ClearCategoryAction = {
  type: ProductProjectionsActionTypes.SET_DEFAULT_CATEGORY;
  payload?: undefined;
};

type SetSortAction = {
  type: ProductProjectionsActionTypes.SET_SORT;
  payload: [string, string];
};

type ClearSortAction = {
  type: ProductProjectionsActionTypes.CLEAR_SORT;
  payload?: undefined;
};

type SetFilterAction = {
  type: ProductProjectionsActionTypes.SET_FILTER;
  payload: FilterFields;
};

type ClearFilterAction = {
  type: ProductProjectionsActionTypes.CLEAR_FILTER;
  payload?: undefined;
};

type SetPageAction = {
  type: ProductProjectionsActionTypes.SET_PAGE;
  payload: number;
};

type ProductProjectionsQueryArgsActions =
  | SetSearchAction
  | ClearSearchAction
  | SetCategoryAction
  | ClearCategoryAction
  | SetSortAction
  | ClearSortAction
  | SetFilterAction
  | ClearFilterAction
  | SetPageAction;

const productProjectionsQueryArgsReducer = (
  state: ProductProjectionsQueryArgs,
  { type, payload }: ProductProjectionsQueryArgsActions
) => {
  switch (type) {
    case ProductProjectionsActionTypes.SET_SEARCH: {
      delete state['filter.query'];
      delete state.filter;
      delete state.fuzzy;
      delete state['text.en'];

      return {
        ...state,
        fuzzy: true,
        'text.en': payload,
        offset: 0,
      };
    }
    case ProductProjectionsActionTypes.CLEAR_SEARCH: {
      delete state.fuzzy;
      delete state['text.en'];

      return {
        ...state,
        offset: 0,
      };
    }
    case ProductProjectionsActionTypes.SET_CATEGORY: {
      delete state.fuzzy;
      delete state['text.en'];

      return {
        ...state,
        offset: 0,
        'filter.query': `categories.id:subtree("${payload}")`,
      };
    }
    case ProductProjectionsActionTypes.SET_DEFAULT_CATEGORY: {
      if (state['text.en']) {
        return state;
      }

      delete state['filter.query'];

      return {
        ...state,
        offset: 0,
      };
    }
    case ProductProjectionsActionTypes.SET_SORT: {
      const [sortType, order] = payload;

      if (order === 'asc' || order === 'desc') {
        if (sortType === 'price') {
          return {
            ...state,
            sort: `price ${order}`,
          };
        }

        if (sortType === 'name') {
          return {
            ...state,
            sort: `name.en ${order}`,
          };
        }
      }

      return {
        ...state,
        offset: 0,
      };
    }
    case ProductProjectionsActionTypes.CLEAR_SORT: {
      delete state.sort;

      return {
        ...state,
        offset: 0,
      };
    }
    case ProductProjectionsActionTypes.SET_FILTER: {
      const { color, discountedProducts, priceRange, releaseDate } = payload;
      const filter = [];

      delete state.filter;

      if (color.length) {
        filter.push(`variants.attributes.colorsList.key:${color.map((value) => `"${value}"`).join(', ')}`);
      }

      if (discountedProducts) {
        filter.push('variants.scopedPriceDiscounted:true');
      }

      if (priceRange.length) {
        filter.push(`variants.scopedPrice.value.centAmount:range (${priceRange[0]} to ${priceRange[1]})`);
      }

      if (releaseDate.length) {
        filter.push(`variants.attributes.releaseDate:${releaseDate.map((value) => `"${value}"`).join(', ')}`);
      }

      return {
        ...state,
        offset: 0,
        filter: filter,
      };
    }
    case ProductProjectionsActionTypes.CLEAR_FILTER: {
      delete state.filter;

      return {
        ...state,
        offset: 0,
      };
    }
    case ProductProjectionsActionTypes.SET_PAGE: {
      return {
        ...state,
        offset: state.limit * payload - state.limit,
      };
    }
    default: {
      return state;
    }
  }
};

export {
  productProjectionsQueryArgsReducer,
  ProductProjectionsActionTypes,
  type ProductProjectionsQueryArgs,
  type ProductProjectionsQueryArgsActions,
};
