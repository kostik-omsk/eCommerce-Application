import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@app/auth';
import { router } from './router/';
import './styles/color-variables.css';
import './styles/margin-padding-variables.css';
import './styles/App.css';
import { CartProvider } from 'pages/Cart/CartProvider';

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
