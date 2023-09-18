import { Carousel } from 'antd';
import style from './CarouselMain.module.css';

export const CarouselMain = () => {
  return (
    <Carousel className={style.carousel}>
      <div className={style.carouselSlide}>
        <div className={style.coupon}>
          <div className={style.left}>
            <div>Enjoy Your Gift</div>
          </div>
          <div className={style.center}>
            <div className={style.wrapper}>
              <h2>5 EUR</h2>
              <h3>PROMOCODE</h3>
              <small>5 EUR discount if a price of a single item is more than 5 EUR</small>
            </div>
          </div>
          <div className={style.right}>
            <div className={style.code}>5EUROFF</div>
          </div>
        </div>
      </div>
      <div className={style.carouselSlide}>
        <div className={style.coupon}>
          <div className={style.left}>
            <div>Enjoy Your Gift</div>
          </div>
          <div className={style.center}>
            <div className={style.wrapper}>
              <h2>25%</h2>
              <h3>PROMOCODE</h3>
              <small>25% discount to all products in the cart</small>
            </div>
          </div>
          <div className={style.right}>
            <div className={style.code}>25%OFF</div>
          </div>
        </div>
      </div>
    </Carousel>
  );
};
