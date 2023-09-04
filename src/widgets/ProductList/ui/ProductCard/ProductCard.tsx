import { EuroCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import style from './ProductCard.module.css';

interface ProductCardMap {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  discount: number | null;
  urlImg: string;
}

const ProductCard = ({ product }: { product: ProductCardMap }) => {
  const { id, title, description, urlImg, price, discount } = product;

  return (
    <Link to={`/product/${id}`} className={style.productCard}>
      <div className={style.productImg}>
        <img src={urlImg} alt={title} />
      </div>
      <div className={style.productInfo}>
        <h4>{title}</h4>
        {description && <p className={style.productDescription}>{description}</p>}

        {price && (
          <div className={style.productPrice}>
            {discount ? (
              <>
                <small>
                  <span>
                    <EuroCircleOutlined />
                  </span>{' '}
                  {price}
                </small>
                <span>
                  <EuroCircleOutlined />
                </span>{' '}
                <strong>{discount}</strong>
              </>
            ) : (
              <span>
                <span>
                  <EuroCircleOutlined />
                </span>{' '}
                {price}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export { type ProductCardMap, ProductCard };
