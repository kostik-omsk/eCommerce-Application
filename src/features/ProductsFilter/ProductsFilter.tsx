import { useState } from 'react';
import { Badge, Button, Checkbox, Drawer, InputNumber, Select, Slider } from 'antd';
import { ProductProjectionsActionTypes } from '@shared/api/products';
import Title from 'antd/es/typography/Title';
import { FilterOutlined } from '@ant-design/icons';
import { CheckboxValueType } from 'antd/es/checkbox/Group';
import type { ProductProjectionsQueryArgsActions } from '@shared/api/products';
import { ProductsSearch } from '@features/ProductsSearch';
import { colors, years, sort } from './data/options.json';
import styles from './ProductsFilter.module.css';

interface FilterFields {
  color: string[] | CheckboxValueType[];
  releaseDate: string[] | CheckboxValueType[];
  priceRange: number[] | [number, number];
  discountedProducts: boolean;
}

interface ProductsFilterProps {
  dispatch: React.Dispatch<ProductProjectionsQueryArgsActions>;
  id: string | undefined;
  filter: FilterFields | null;
}

const areFiltersEqual = (current: FilterFields, applied: FilterFields) => {
  const areColorsEqual =
    current.color.length === applied.color.length && current.color.every((entry) => applied.color.includes(`${entry}`));

  const areReleaseDatesEqual =
    current.releaseDate.length === applied.releaseDate.length &&
    current.releaseDate.every((entry) => applied.releaseDate.includes(`${entry}`));

  const arePriceRangesEqual = current.priceRange.toString() === applied.priceRange.toString();

  const areDiscountedProductsEqual = current.discountedProducts === applied.discountedProducts;

  return areColorsEqual && areReleaseDatesEqual && arePriceRangesEqual && areDiscountedProductsEqual;
};

const initialValue: FilterFields = {
  color: [],
  releaseDate: [],
  priceRange: [0, 9999],
  discountedProducts: false,
};

const CheckboxGroup = Checkbox.Group;

const ProductsFilter = ({ dispatch, id, filter }: ProductsFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filterState, setFilterState] = useState<FilterFields>(initialValue);
  const [selectedSort, setSelectedSort] = useState('default');
  const [countFilters, setCountFilters] = useState(0);
  const [countFilterOne, setCountFilterOne] = useState(0);
  const [countFilterTwo, setCountFilterTwo] = useState(9999);

  const disabled =
    !filterState.color.length &&
    !filterState.releaseDate.length &&
    !filterState.discountedProducts &&
    filterState.priceRange.toString() === '0,9999';

  const handleSort = (value: string) => {
    if (value === 'default') {
      setSelectedSort(value);
      return dispatch({ type: ProductProjectionsActionTypes.CLEAR_SORT });
    }

    const [sortType, order] = value.split(' ');
    dispatch({ type: ProductProjectionsActionTypes.SET_SORT, payload: [sortType, order] });

    setSelectedSort(value);
  };

  const showDrawer = () => {
    setIsOpen(true);
  };

  const handlePriceChange = (value: [number, number]) => {
    if (!Number.isNaN(value[0]) && !Number.isNaN(value[1])) {
      setCountFilterOne(Math.min(...value));
      setCountFilterTwo(Math.max(...value));

      setFilterState((prev) => ({
        ...prev,
        priceRange: value,
      }));
    }
  };

  const sliderRangeInputOne = (event: EventTarget & HTMLInputElement) => {
    let number = +event.value;
    if (!Number.isNaN(number)) {
      if (number > 9999) {
        number = 9999;
      } else if (number < 0) {
        number = 0;
      }
      if (number > countFilterTwo) {
        setCountFilterOne(countFilterTwo);
        setCountFilterTwo(number);
        handlePriceChange([countFilterTwo, number]);
      } else {
        setCountFilterOne(number);
        handlePriceChange([number, countFilterTwo]);
      }
    }
  };

  const fixRange = () => {};

  const sliderRangeInputTwo = (event: EventTarget & HTMLInputElement) => {
    let number = +event.value;
    if (!Number.isNaN(number)) {
      if (number > 9999) {
        number = 9999;
      } else if (number < 0) {
        number = 0;
      }
      if (number < countFilterOne) {
        setCountFilterTwo(countFilterOne);
        setCountFilterOne(number);
        handlePriceChange([number, countFilterOne]);
      } else {
        setCountFilterTwo(number);
        handlePriceChange([countFilterOne, number]);
      }
    }
  };

  const onColorList = (list: CheckboxValueType[]) => {
    setFilterState((prev) => ({
      ...prev,
      color: list,
    }));
  };

  const onReleaseList = (list: CheckboxValueType[]) => {
    setFilterState((prev) => ({
      ...prev,
      releaseDate: list,
    }));
  };

  const countFilter = (reset?: boolean) => {
    if (reset) {
      setCountFilterOne(0);
      setCountFilterTwo(9999);
      return setCountFilters(0);
    }
    const { color, discountedProducts, priceRange, releaseDate } = filterState;

    const colorCount = color.length;
    const dateCount = releaseDate.length;

    let count = colorCount + dateCount;

    if (priceRange[0] !== 0 || priceRange[1] !== 9999) {
      count += 1;
      setCountFilters(count);
    } else if (discountedProducts) {
      count += 1;
      setCountFilters(count);
    } else {
      setCountFilters(count);
    }
  };

  const clearFilters = () => {
    setFilterState(initialValue);
    countFilter(true);
    setIsOpen(false);
    setCountFilterTwo(9999);
    setCountFilterOne(0);
    if (filter) {
      dispatch({ type: ProductProjectionsActionTypes.CLEAR_FILTER });
    }
  };

  const reset = () => {
    setFilterState(initialValue);
    countFilter(true);
    setIsOpen(false);
  };

  const applyFilters = () => {
    const current: FilterFields = {
      ...filterState,
      priceRange: filterState.priceRange.map((number) => number * 100),
    };

    const setFilter = () =>
      dispatch({
        type: ProductProjectionsActionTypes.SET_FILTER,
        payload: current,
      });

    if (filter) {
      const isEquals = areFiltersEqual(current, filter);

      if (!isEquals) {
        setFilter();
      }
    } else {
      setFilter();
    }

    countFilter();
    setIsOpen(false);
  };

  const onClose = () => {
    if (!filter) {
      return reset();
    }

    if ((disabled && filter) || filter) {
      const current = {
        ...filterState,
        priceRange: filterState.priceRange.map((number) => number * 100),
      };

      const isEquals = areFiltersEqual(current, filter);

      if (!isEquals) {
        setFilterState({
          ...filter,
          priceRange: [filter.priceRange[0] / 100, filter.priceRange[1] / 100],
        });
      }
      setCountFilterOne(filter.priceRange[0] / 100);
      setCountFilterTwo(filter.priceRange[1] / 100);
      return setIsOpen(false);
    }

    if (disabled) {
      return clearFilters();
    }
  };

  const onDiscountedProducts = () => {
    setFilterState((prev) => ({
      ...prev,
      discountedProducts: !prev.discountedProducts,
    }));
  };

  return (
    <>
      <ProductsSearch dispatch={dispatch} clearFilters={reset} id={id} />
      <div className={styles.productFilter}>
        <div>
          <span>Sorting: </span>
          <Select
            className={styles.selectSort}
            defaultValue={'Default'}
            onChange={(value) => handleSort(value)}
            value={selectedSort}
            options={sort}
          />
        </div>
        <Badge offset={[-10, 0]} count={countFilters}>
          <Button icon={<FilterOutlined />} onClick={showDrawer}>
            Filter
          </Button>
        </Badge>
        <Drawer title="Filter" placement="right" onClose={onClose} afterOpenChange={fixRange} open={isOpen}>
          <div className={styles.filterSection}>
            <Title level={4}>Price</Title>
            <div>
              <div className="range-input">
                From:{' '}
                <InputNumber
                  min={0}
                  max={9999}
                  controls={false}
                  value={countFilterOne}
                  onBlur={(event) => sliderRangeInputOne(event.target)}
                />
                To:{' '}
                <InputNumber
                  min={0}
                  max={9999}
                  controls={false}
                  value={countFilterTwo}
                  onBlur={(event) => sliderRangeInputTwo(event.target)}
                />
              </div>
            </div>
            <Slider
              range
              marks={{ 0: '€0', 9999: '€9999' }}
              value={filterState.priceRange as [number, number]}
              min={0}
              max={9999}
              onChange={handlePriceChange}
            />
          </div>
          <div className={styles.filterSection}>
            <Title level={4}>Color</Title>
            <CheckboxGroup
              className={styles.checkboxGroupList}
              style={{ flexDirection: 'column' }}
              options={colors}
              value={filterState.color}
              onChange={onColorList}
            />
          </div>
          <div className={styles.filterSection}>
            <Title level={4}>Release Date</Title>
            <CheckboxGroup
              className={styles.checkboxGroupList}
              style={{ flexDirection: 'column' }}
              options={years}
              value={filterState.releaseDate}
              onChange={onReleaseList}
            />
          </div>
          <div className={styles.filterSection}>
            <Title level={4}>Discounted</Title>
            <Checkbox onChange={onDiscountedProducts} checked={filterState.discountedProducts}>
              Show discounted products.
            </Checkbox>
          </div>

          <div className={`${styles.controll} ${styles.filterSection}`}>
            <Button onClick={applyFilters} disabled={disabled}>
              Apply
            </Button>
            <Button onClick={clearFilters} disabled={disabled}>
              Clear
            </Button>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export { ProductsFilter, type FilterFields };
