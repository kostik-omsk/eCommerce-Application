import { useEffect, useState } from 'react';
import { BurgerMenu, Logo, NavList, UserMenu } from './ui';

import styles from './Navbar.module.css';

export const Navbar = () => {
  const [isMenuClicked, setIsMenuClicked] = useState(false);
  const [isOverflowHidden, setIsOverflowHidden] = useState(false);

  const handleMenuClick = () => {
    setIsMenuClicked(!isMenuClicked);
    setIsOverflowHidden(!isOverflowHidden);
  };

  const handleMenuClose = () => {
    setIsMenuClicked(false);
    setIsOverflowHidden(false);
  };

  const navMenuClass = isMenuClicked ? `${styles.navMenu} ${styles.open}` : styles.navMenu;

  useEffect(() => {
    if (isOverflowHidden) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [isOverflowHidden]);

  return (
    <div className={styles.navbar}>
      <Logo />
      <div className={navMenuClass}>
        <NavList onCloseMenu={handleMenuClose} />
        <UserMenu onCloseMenu={handleMenuClose} />
      </div>
      {isMenuClicked && <div className={styles.backgroundMenu} onClick={handleMenuClose}></div>}
      <BurgerMenu isMenuClicked={isMenuClicked} onBurgerClick={handleMenuClick} />
    </div>
  );
};
