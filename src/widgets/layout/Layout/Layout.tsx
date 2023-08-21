import { Outlet } from 'react-router-dom';
import { Header } from '../ui/Header/Header.tsx';
import { Footer } from '../ui/Footer/Footer.tsx';
import styles from './Layout.module.css';

export const Layout = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
