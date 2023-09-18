import react from '@assets/react.svg';
import typescript from '@assets/typescript.svg';
import vitejs from '@assets/vitejs.svg';
import ecommerce from '@assets/Ecommerce.svg';
import ant from '@assets/ant.svg';
import style from './IntroMain.module.css';

export const IntroMain = () => {
  return (
    <div className={style.intro}>
      <div className={style.info}>
        <h1 className={style.title}>RSS-Shop</h1>
        <p className={style.slogan}>Buy Everything</p>
        <p className={style.description}>This is an educational project completed as part of the RS School course.</p>
        <div className={style.stack}>
          <img src={react} alt="React" className={style.icon} />
          <img src={vitejs} alt="Vitejs" className={style.icon} />
          <img src={typescript} alt="TypeScript" className={style.icon} />
          <img src={ant} alt="Ant" className={style.icon} />
          <img src={ecommerce} alt="Ecommerce" className={style.icon} />
        </div>
      </div>
    </div>
  );
};
