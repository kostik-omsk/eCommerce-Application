import React, { useState, useEffect, useRef } from 'react';
import { Button, Carousel } from 'antd';
import { message } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import { useCart } from 'pages/Cart/useCart';
import { useParams, Navigate } from 'react-router-dom';
import Modal from 'react-modal';
import { EuroCircleOutlined } from '@ant-design/icons';
import { useProduct } from '@shared/api/products';
import { ApiClient } from '@shared/api/core';
import './carousel.css';

interface IDimentions {
  w: number;
  h: number;
}
interface IImages {
  url: string;
  dimensions: IDimentions;
}
interface IAttributes {
  name: string;
  value: string;
}
interface IAttributesArr {
  attributes: IAttributes[];
}

export const ProductDetail = () => {
  const { cart, initCart, getCurrentCart } = useCart();
  const { productId } = useParams<{ productId: string }>();
  const itemData = useProduct(productId);
  const [isBigPicModalOpened, bigPicModalIsOpen] = useState(false);
  const [carousel1Index, setCarousel1Index] = useState(0);
  const carouselRefModal = useRef<CarouselRef>(null);
  const carouselRefSmall = useRef<CarouselRef>(null);
  const apiClient = ApiClient.getInstance();
  const has = (prodId: string | undefined) => {
    if (cart && prodId) {
      return cart.lineItems.some((prod) => prod.productId === prodId);
    }
    return false;
  };
  const isProductInCart = has(productId);

  useEffect(() => {}, [carousel1Index]);

  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  function successMessage(result: 'success' | 'error', errorMessage: string): void {
    messageApi.open({
      type: result,
      content: errorMessage,
      duration: 2,
    });
  }

  const openPicModal = (slideNumber: number) => {
    setCarousel1Index(slideNumber);
    bigPicModalIsOpen(true);
  };
  const closePicModal = () => {
    if (carouselRefSmall.current) {
      carouselRefSmall.current.goTo(carousel1Index, true);
    }
    if (carouselRefModal.current) {
      carouselRefModal.current.goTo(carousel1Index, true);
    }
    bigPicModalIsOpen(false);
  };
  const masterData = itemData.product ? itemData.product.masterData.current : null;

  function openNextSlide() {
    if (carouselRefSmall.current) {
      carouselRefSmall.current.next();
    }
  }
  function openNextSlideModal() {
    if (carouselRefModal.current) {
      carouselRefModal.current.next();
    }
  }
  function openPrevSlide() {
    if (carouselRefSmall.current) {
      carouselRefSmall.current.prev();
    }
  }
  function openPrevSlideModal() {
    if (carouselRefModal.current) {
      carouselRefModal.current.prev();
    }
  }
  function sliderChangedPage(currentSlide: number) {
    setCarousel1Index(currentSlide);
  }

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
    const imageStyle: React.CSSProperties = {
      margin: 0,
      height: 'auto',
      maxHeight: '500px',
      width: '100%',
      objectFit: 'contain',
      marginBottom: '20px',
    };
    const bigSlider: React.CSSProperties = {
      margin: 0,
      height: 'auto',
      maxHeight: '100%',
      width: '100%',
      objectFit: 'contain',
      marginBottom: '20px',
    };

    const carouselSlides: JSX.Element[] = [];
    const modalSlides: JSX.Element[] = [];

    let prodTitle: string,
      prodDescription: string | null,
      prodPrice: number | null,
      prodUrlImg: IImages[],
      prodDiscount: number | null,
      color: string,
      releaseDate: string;
    // specialAttr: string;

    if (masterData) {
      prodTitle = masterData.name.en;
      prodDescription = masterData.metaDescription ? masterData.metaDescription.en : null;
      color = (masterData.masterVariant as IAttributesArr).attributes[5].value;
      releaseDate = (masterData.masterVariant as IAttributesArr).attributes[4].value;
      // specialAttr = (masterData.masterVariant as IAttributesArr).attributes[2].value;
      // Цена в центах идёт, но на странице указываем в долларах
      prodPrice = masterData.masterVariant.prices ? masterData.masterVariant.prices[0].value.centAmount / 100 : null;
      prodDiscount = masterData.masterVariant.price
        ? masterData.masterVariant.price.discounted
          ? masterData.masterVariant.price.discounted.value.centAmount / 100
          : null
        : null;
      prodUrlImg = (masterData.masterVariant.images as IImages[]).filter((n) => n.url !== ''); // Потом подправить
      for (let i = 0; i < prodUrlImg.length; i += 1) {
        carouselSlides.push(
          <div key={`slide${i}`}>
            <img
              style={imageStyle}
              onClick={() => {
                openPicModal(i);
              }}
              id="imageStyle"
              className="slider-image imageStyle"
              src={prodUrlImg[i].url}
              alt="product logo"
            />
          </div>
        );
        modalSlides.push(
          <div key={`slide${i}`}>
            <img
              style={imageStyle}
              className="slider-image slider-image-modal"
              src={prodUrlImg[i].url}
              alt="product logo"
            />
          </div>
        );
      }

      const modalWindow = (
        <Modal isOpen={isBigPicModalOpened} ariaHideApp={false} onRequestClose={closePicModal}>
          <Button className="closeBigCarousel" onClick={closePicModal}>
            X
          </Button>
          <Carousel
            ref={carouselRefModal}
            className="slider-big"
            dotPosition={'bottom'}
            waitForAnimate={true}
            style={bigSlider}
            initialSlide={carousel1Index}
            afterChange={sliderChangedPage}
          >
            {modalSlides}
          </Carousel>
          {masterData.masterVariant.images ? (
            masterData.masterVariant.images.filter((n) => n.url !== '').length > 1 ? (
              <div className="slider-buttons">
                <Button type="primary" className="prevSlide" onClick={openPrevSlideModal}></Button>
                <Button type="primary" className="nextSlide" onClick={openNextSlideModal}></Button>
              </div>
            ) : null
          ) : null}
        </Modal>
      );

      return (
        <>
          <div className="product-container">
            <div className="prodWrapper">
              {prodTitle ? <div className="prodName">{prodTitle}</div> : null}
              {prodDescription ? <div className="prodDesc">{prodDescription}</div> : null}
              {color ? <div className="prodDesc">We only have this item in {color} color today</div> : null}
              {releaseDate ? <div className="prodDesc">Product was released in {releaseDate}</div> : null}
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
            <Carousel
              ref={carouselRefSmall}
              className="slider"
              dotPosition={'bottom'}
              waitForAnimate={true}
              afterChange={sliderChangedPage}
            >
              {carouselSlides}
            </Carousel>
            {masterData.masterVariant.images ? (
              masterData.masterVariant.images.filter((n) => n.url !== '').length > 1 ? (
                <div className="slider-buttons">
                  <Button type="primary" className="prevSlide" onClick={openPrevSlide}></Button>
                  <Button type="primary" className="nextSlide" onClick={openNextSlide}></Button>
                </div>
              ) : null
            ) : null}
            {modalWindow}
            {contextHolder}
          </div>
        </>
      );
    }
  }

  return <>{itemData.error ? <Navigate to={'/catalog'} replace={true} /> : <div>{addCarousel()}</div>}</>;
};
