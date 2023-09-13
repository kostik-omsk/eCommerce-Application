import type { Cart } from '@commercetools/platform-sdk';
import { ApiClient } from '@shared/api/core';

export type CartResponse = { success: true; data: Cart } | { success: false; message: string };

export class CartService {
  public cart: Cart | undefined;

  public AllCarts: Cart | undefined;

  public async initCart(): Promise<Cart | undefined> {
    // Если нет корзины, создаём корзину.
    try {
      const response = await ApiClient.getInstance().requestBuilder.me().activeCart().get().execute();
      this.cart = response.body;
      return this.cart;
    } catch (error: unknown) {
      await ApiClient.getInstance()
        .requestBuilder.me()
        .carts()
        .post({
          body: {
            currency: 'EUR',
          },
        })
        .execute()
        .then((response) => {
          this.cart = response.body;
          return this.cart;
        });
      return this.cart;
    }
  }

  public async deleteCart(): Promise<void> {
    await this.initCart();
    if (this.cart)
      await ApiClient.getInstance()
        .requestBuilder.me()
        .carts()
        .withId({
          ID: this.cart.id,
        })
        .delete({
          queryArgs: {
            version: this.cart.version,
          },
        })
        .execute();
  }
}
