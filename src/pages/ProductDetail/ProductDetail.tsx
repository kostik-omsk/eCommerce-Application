import { Button, Image } from 'antd';
import { message } from 'antd';
import { useCart } from 'pages/Cart/useCart';
import { useParams, Navigate } from 'react-router-dom';
import { EuroCircleOutlined } from '@ant-design/icons';
import { useProduct } from '@shared/api/products';
import { ApiClient } from '@shared/api/core';
import './carousel.css';

interface IAttributes {
  name: string;
  value: string | { key: string };
}
interface IAttributesArr {
  attributes: IAttributes[];
}

export const ProductDetail = () => {
  const { cart, initCart, getCurrentCart } = useCart();
  const { productId } = useParams<{ productId: string }>();
  const itemData = useProduct(productId);

  const apiClient = ApiClient.getInstance();
  const has = (prodId: string | undefined) => {
    if (cart && prodId) {
      return cart.lineItems.some((prod) => prod.productId === prodId);
    }
    return false;
  };
  const isProductInCart = has(productId);

  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  function successMessage(result: 'success' | 'error', errorMessage: string): void {
    messageApi.open({
      type: result,
      content: errorMessage,
      duration: 2,
    });
  }

  const masterData = itemData.product ? itemData.product.masterData.current : null;

  async function addToCart() {
    const renewedCart = (await getCurrentCart()).data ? (await getCurrentCart()).data : cart;
    if (renewedCart) {
      await apiClient.requestBuilder
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
                productId,
              },
            ],
          },
        })
        .execute()
        .then(() => {
          initCart();
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  async function removeProductFromCart() {
    const renewedCart = (await getCurrentCart()).data ? (await getCurrentCart()).data : cart;
    if (renewedCart) {
      const product = renewedCart.lineItems.find((prod) => prod.productId === productId);
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
                action: 'changeLineItemQuantity',
                lineItemId: product?.id,
                quantity: Number(0),
              },
              {
                action: 'recalculate',
                updateProductData: true,
              },
            ],
          },
        })
        .execute()
        .then(() => {
          initCart();
          successMessage('success', 'Product removed from the cart');
        })
        .catch((error) => {
          console.error(error);
          successMessage('error', 'Unable to delete the product');
        });
    }
  }

  function addCarousel() {
    let prodTitle: string,
      prodDescription: string | null,
      prodPrice: number | null,
      prodUrlImg: string,
      prodDiscount: number | null,
      color: string,
      size: string;
    // specialAttr: string;

    if (masterData) {
      prodTitle = masterData.name.en;
      prodDescription = masterData.metaDescription ? masterData.metaDescription.en : null;

      const attributesArr = masterData.masterVariant as IAttributesArr;

      // Обработка атрибута color
      const colorAttribute = attributesArr.attributes[8].value;
      color = typeof colorAttribute === 'string' ? colorAttribute : colorAttribute.key;

      // Обработка атрибута size
      const sizeAttribute = attributesArr.attributes[7].value;
      size = typeof sizeAttribute === 'string' ? sizeAttribute : '';

      // Цена в центах идёт, но на странице указываем в долларах
      prodPrice = masterData.masterVariant.prices ? masterData.masterVariant.prices[0].value.centAmount / 100 : null;
      prodDiscount = masterData.masterVariant.price
        ? masterData.masterVariant.price.discounted
          ? masterData.masterVariant.price.discounted.value.centAmount / 100
          : null
        : null;
      const imagesUrl = masterData.masterVariant.images;

      prodUrlImg = imagesUrl ? imagesUrl[0].url : '';

      return (
        <>
          <div className="product-container">
            <div className="prodWrapper">
              {prodTitle ? <div className="prodName">{prodTitle}</div> : null}
              {prodDescription ? <div className="prodDesc">{prodDescription}</div> : null}
              {color ? <div className="prodDesc">Color: {color}</div> : null}
              {size ? <div className="prodDesc">Size: {size}</div> : null}
              {/* {specialAttr ? <div className="prodDesc">{specialAttr}</div> : null} */}
              {prodDiscount ? (
                <div className="prodPrice">
                  Only for <span className="strike">{prodPrice}</span> {prodDiscount} <EuroCircleOutlined />
                </div>
              ) : prodPrice ? (
                <div className="prodPrice">
                  Only for {prodPrice} <EuroCircleOutlined />
                </div>
              ) : null}

              {isProductInCart ? (
                <Button type="primary" danger className="someButtons" onClick={removeProductFromCart}>
                  Remove from cart
                </Button>
              ) : (
                <Button type="primary" className="someButtons" onClick={addToCart}>
                  Add to cart
                </Button>
              )}
            </div>
            <Image style={{ width: '300px', maxWidth: '400px' }} src={prodUrlImg}></Image>
            {contextHolder}
          </div>
        </>
      );
    }
  }

  return <>{itemData.error ? <Navigate to={'/catalog'} replace={true} /> : <>{addCarousel()}</>}</>;
};
