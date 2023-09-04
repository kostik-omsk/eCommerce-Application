import { useParams } from 'react-router-dom';
import { useProductProjections } from '@shared/api/products';
import { useCategories } from '@shared/api/categories';
import { ProductList } from '@widgets/ProductList';
import { Categories } from '@widgets/Categories';
import { ProductsFilter } from '@features/ProductsFilter';
import { Breadcrumbs } from '@features/Breadcrumbs';
import style from './Catalog.module.css';

const Catalog = () => {
  const { id } = useParams();

  const {
    state: { products, loading },
    dispatch,
  } = useProductProjections(id);

  const { categoriesTree } = useCategories();

  return (
    <>
      <div className={style.headerCatalog}>
        <Categories loading={loading} id={id} tree={categoriesTree} />
        <ProductsFilter dispatch={dispatch} id={id} />
      </div>
      <Breadcrumbs id={id} tree={categoriesTree} dispatch={dispatch} />
      <ProductList products={products} loading={loading} />
    </>
  );
};

export { Catalog };
