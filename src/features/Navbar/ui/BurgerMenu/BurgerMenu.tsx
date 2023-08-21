import styles from './BurgerMenu.module.css';

interface BurgerMenuProps {
  isMenuClicked: boolean;
  onBurgerClick: () => void;
}

export const BurgerMenu = ({ isMenuClicked, onBurgerClick }: BurgerMenuProps) => {
  const burgerClass = isMenuClicked ? `${styles.burger} ${styles.active}` : `${styles.burger} ${styles.notActive}`;

  return (
    <div onClick={onBurgerClick} className={burgerClass}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};
