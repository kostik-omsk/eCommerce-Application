import { createContext, type ReactNode, useState } from 'react';
import type { Cart } from '@commercetools/platform-sdk';
import { CartService } from './CartService';

const cartService = new CartService();
await cartService.initCart();

interface CartProviderValue {
  cart: Cart | undefined;
  initCart: () => Promise<void>;
  deleteCart: () => Promise<void>;
  has: (id: string) => boolean;
  count: () => number;
}

const CartContext = createContext<CartProviderValue>({
  cart: cartService.cart,
  initCart: () => Promise.resolve(),
  deleteCart: () => Promise.resolve(),
  has: () => false,
  count: () => 0,
});

const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | undefined>(cartService.cart);

  const initCart = async (): Promise<void> => {
    const testCart = await cartService.initCart();
    setCart(testCart);
  };

  const deleteCart = async (): Promise<void> => {
    await cartService.deleteCart();
    initCart();
  };

  const has = (id: string) => {
    if (cart) {
      const item = cart.lineItems.find((lineItem) => lineItem.productId === id);

      return !!item;
    }

    return false;
  };

  const count = () => {
    if (cart) {
      return cart.lineItems.length;
    }

    return 0;
  };

  const value: CartProviderValue = {
    cart: cart,
    initCart,
    deleteCart,
    has,
    count,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext, CartProvider };
