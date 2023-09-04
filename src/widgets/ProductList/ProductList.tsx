import { Spin } from 'antd';
import { ProductCard, type ProductCardMap } from './ui/ProductCard';
import styles from './ProductList.module.css';

interface ProductListProps {
  products: ProductCardMap[];
  loading: boolean;
}

export const ProductList = ({ products, loading }: ProductListProps) => {
  return (
    <>
      {!products.length && !loading && <h2 className={styles.noProductsTitle}>No Products Found</h2>}

      <div className={styles.productsListContainer}>
        {loading && (
          <div className={styles.productsListSpinBlock}>
            <Spin className={styles.spin} size="large" />
          </div>
        )}
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
};
