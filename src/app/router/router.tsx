import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { Layout } from '@widgets/layout';
import { Main, SignUp, Cart, Catalog, SignIn, NotFound, About, Profile, ProductDetail } from '@pages';

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Main />,
      },
      {
        path: '/signin',
        element: <SignIn />,
        caseSensitive: true,
      },
      {
        path: '/signup',
        element: <SignUp />,
        caseSensitive: true,
      },
      {
        path: '/catalog',
        element: <Catalog />,
        caseSensitive: true,
      },
      {
        path: '/catalog/:id',
        element: <Catalog />,
        caseSensitive: true,
      },
      {
        path: '/product/:productId', // Добавляем маршрут для детальной страницы продукта
        element: <ProductDetail />,
        caseSensitive: true,
      },
      {
        path: '/about',
        element: <About />,
        caseSensitive: true,
      },
      {
        path: '/cart',
        element: <Cart />,
        caseSensitive: true,
      },
      {
        path: '/profile',
        element: <Profile />,
        caseSensitive: true,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes, { basename: '/' });
