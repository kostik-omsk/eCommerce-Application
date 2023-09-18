import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Skeleton, Button } from 'antd';
import { EuroCircleOutlined } from '@ant-design/icons';
import { ApiClient } from '@shared/api/core';
import { useCart } from '@pages/Cart/useCart';
import styles from './ProductCard.module.css';

interface ProductCardMap {
  id: string;
  title: string;
  description: string | null;
  price: number | null;
  discount: number | null;
  urlImg: string;
}
const ProductCard = ({ product }: { product: ProductCardMap }) => {
  const { cart, initCart, getCurrentCart, has } = useCart();
  const { id, title, description, urlImg, price, discount } = product;
  const [loading, setImgLoading] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [cartLoading, cartLoadingState] = useState(false);
  const apiClient = ApiClient.getInstance();

  const isDisabled = has(id);

  const addProductCart = async (event: React.MouseEvent<HTMLButtonElement>) => {
    cartLoadingState(true);
    event.preventDefault();
    const renewedCart = (await getCurrentCart()).data ? (await getCurrentCart()).data : cart;
    if (renewedCart) {
      apiClient.requestBuilder
        .me()
        .carts()
        .withId({
          ID: renewedCart.id,
        })
        .post({
          body: {
            version: renewedCart.version,
            actions: [
              {
                action: 'addLineItem',
                productId: id,
              },
            ],
          },
        })
        .execute()
        .then(() => {
          initCart();
          // 300мс стоят для того, чтобы успел появиться индкатор загрузки, который при слишком быстром ответе от сервера, быстро пропадает
          setTimeout(function () {
            cartLoadingState(false);
          }, 300);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <Link to={`/product/${id}`} className={styles.productCard}>
      <div ref={ref} className={styles.productImg}>
        {inView ? (
          <>
            {loading && <Skeleton.Image active className={styles.skeleton} />}
            <img
              className={loading ? styles.hidden : styles.visible}
              src={urlImg}
              alt={title}
              onLoad={() => setImgLoading(false)}
            />
          </>
        ) : (
          <Skeleton.Image className={styles.skeleton} />
        )}
      </div>
      <div className={styles.productInfo}>
        <h4>{title}</h4>
        {description && <p className={styles.productDescription}>{description}</p>}
        <div className={styles.productPrice}>
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
        <Button
          type="primary"
          className="catalogAddToCartBtn"
          onClick={addProductCart}
          disabled={isDisabled}
          loading={cartLoading}
        >
          add to cart
        </Button>
      </div>
    </Link>
  );
};

export { type ProductCardMap, ProductCard };
