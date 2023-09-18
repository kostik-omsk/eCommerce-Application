import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';
import { Layout } from '@widgets/layout';

//eslint-disable-next-line
const Catalog = lazy(() => import('@pages/Catalog'));

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: '/',
        Component: lazy(() => import('@pages/Main')),
      },
      {
        path: '/signin',
        caseSensitive: true,
        Component: lazy(() => import('@pages/SignIn')),
      },
      {
        path: '/signup',
        caseSensitive: true,
        Component: lazy(() => import('@pages/SignUp')),
      },
      {
        path: '/catalog',
        Component: Catalog,
        caseSensitive: true,
      },
      {
        path: '/catalog/:id',
        Component: Catalog,
        caseSensitive: true,
      },
      {
        path: '/product/:productId',
        Component: lazy(() => import('@pages/ProductDetail')),
        caseSensitive: true,
      },
      {
        path: '/about',
        Component: lazy(() => import('@pages/About')),
        caseSensitive: true,
      },
      {
        path: '/cart',
        Component: lazy(() => import('@pages/Cart')),
        caseSensitive: true,
      },
      {
        path: '/profile',
        Component: lazy(() => import('@pages/Profile')),
        caseSensitive: true,
      },
      {
        path: '*',
        Component: lazy(() => import('@pages/NotFound')),
      },
    ],
  },
];

const router = createBrowserRouter(routes, { basename: '/' });

export { router };
