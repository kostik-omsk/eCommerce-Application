import { NavLink } from 'react-router-dom';
import { HomeOutlined, ReadOutlined, ShoppingOutlined } from '@ant-design/icons';
import styles from './NavList.module.css';

export const NavList = ({ onCloseMenu }: { onCloseMenu: () => void }) => {
  const handleLinkClick = () => {
    onCloseMenu();
  };

  return (
    <nav>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <NavLink className={styles.navlink} to="/" onClick={handleLinkClick}>
            <HomeOutlined /> Home
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink className={styles.navlink} to="catalog" onClick={handleLinkClick}>
            <ShoppingOutlined /> Catalog
          </NavLink>
        </li>
        <li className={styles.navItem}>
          <NavLink className={styles.navlink} to="about" onClick={handleLinkClick}>
            <ReadOutlined /> About
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
