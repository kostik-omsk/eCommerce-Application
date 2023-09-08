import { useParams } from 'react-router-dom';
import { useProductProjections } from '@shared/api/products';
import { useCategories } from '@shared/api/categories';
import { ProductList } from '@widgets/ProductList';
import { Categories } from '@features/Categories';
import { ProductsFilter } from '@features/ProductsFilter';
import { Breadcrumbs } from '@features/Breadcrumbs';
import styles from './Catalog.module.css';

const Catalog = () => {
  const { id } = useParams();

  const {
    state: { products, loading, filter },
    dispatch,
  } = useProductProjections(id);

  const { categoriesTree } = useCategories();

  return (
    <>
      <div className={styles.headerCatalog}>
        <Categories id={id} tree={categoriesTree} loading={loading} />
        <ProductsFilter id={id} filter={filter} dispatch={dispatch} />
      </div>
      <Breadcrumbs id={id} tree={categoriesTree} loading={loading} />
      <ProductList products={products} loading={loading} />
    </>
  );
};

export { Catalog };
