import { Link } from 'react-router-dom';
import logo from '@assets/logo.png';
import styles from './Logo.module.css';

export const Logo = () => {
  return (
    <Link to="/" className={styles.logo}>
      <img className={styles.logoImg} src={logo} alt="Logo" />
    </Link>
  );
};
