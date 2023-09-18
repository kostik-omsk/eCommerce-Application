import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Spin, FloatButton } from 'antd';
import { Header } from '../ui/Header/Header.tsx';
import { Footer } from '../ui/Footer/Footer.tsx';
import styles from './Layout.module.css';

const Layout = () => {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <Suspense fallback={<Spin size="large" className={styles.spin} />}>
          <Outlet />
        </Suspense>
        <FloatButton.BackTop visibilityHeight={300} />
      </main>
      <Footer />
    </>
  );
};

export { Layout };
