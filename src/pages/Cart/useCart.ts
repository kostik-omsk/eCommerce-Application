import { useContext } from 'react';
import { CartContext } from './CartProvider.tsx';

const useCart = () => {
  return useContext(CartContext);
};

export { useCart };
