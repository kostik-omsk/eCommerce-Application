import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoComplete, Input } from 'antd';
import {
  ProductProjectionsActionTypes,
  type ProductProjectionsQueryArgsActions,
  ProductSuggestionsActionTypes,
  useProductSuggestions,
} from '@shared/api/products';
import style from './ProductsSearch.module.css';

interface ProductsSearchProps {
  dispatch: React.Dispatch<ProductProjectionsQueryArgsActions>;
  id: string | undefined;
  clearFilters: () => void;
}

export const ProductsSearch = ({ dispatch, clearFilters, id }: ProductsSearchProps) => {
  const {
    state: { suggestions },
    dispatch: setSuggestions,
  } = useProductSuggestions();
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleSuggestions = (text: string) => {
    setSearchText(text);

    if (text) {
      setSuggestions({ type: ProductSuggestionsActionTypes.SET_SUGGESTIONS, payload: text });
    } else {
      setSuggestions({ type: ProductSuggestionsActionTypes.CLEAR_SUGGESTIONS });
      dispatch({ type: ProductProjectionsActionTypes.CLEAR_SEARCH });
    }
  };

  const handleSearch = (text: string) => {
    if (!text) return;

    if (text) {
      dispatch({ type: ProductProjectionsActionTypes.SET_SEARCH, payload: text });
      navigate('/catalog');
      clearFilters();
    }
  };

  const handleSelect = (text: string) => {
    setSearchText(text);
    dispatch({ type: ProductProjectionsActionTypes.SET_SEARCH, payload: text });
    navigate('/catalog');
    clearFilters();
  };

  useEffect(() => {
    if (id) {
      setSearchText('');
      setSuggestions({ type: ProductSuggestionsActionTypes.CLEAR_SUGGESTIONS });
    }
    // eslint-disable-next-line
  }, [id]);

  return (
    <AutoComplete
      value={searchText}
      onSearch={(text) => handleSuggestions(text)}
      onSelect={(text) => handleSelect(text)}
      options={suggestions}
      placeholder="Search in store..."
      className={style.productsSearch}
    >
      <Input.Search onSearch={(text) => handleSearch(text)} />
    </AutoComplete>
  );
};
