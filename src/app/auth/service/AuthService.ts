import type { Customer, CustomerDraft } from '@commercetools/platform-sdk';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { ApiClient } from '@shared/api/core';
import { CartService } from 'pages/Cart/CartService';
const cartService = new CartService();

export type AuthResponse = { success: true; data: Customer } | { success: false; message: string };

export class AuthService {
  private client: ApiClient;

  public user: Customer | null = null;

  constructor() {
    this.client = ApiClient.getInstance();
  }

  public async init(): Promise<void> {
    this.user = await this.client.init();
  }

  public async signIn(credentials: UserAuthOptions): Promise<AuthResponse> {
    await cartService.initCart();
    const cartData = cartService.cart;
    try {
      this.client.switchToPasswordClient(credentials);

      const response = await this.client.requestBuilder
        .login()
        .post({
          body: {
            ...credentials,
            email: credentials.username,
            anonymousId: cartData?.anonymousId,
            anonymousCartId: cartData?.id,
            anonymousCartSignInMode: 'MergeWithExistingCustomerCart',
            updateProductData: true,
          },
        })
        .execute();

      this.user = response.body.customer;

      return {
        success: true,
        data: response.body.customer,
      };
    } catch (error: unknown) {
      this.client.switchToRefreshFlow();

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to Sign In',
      };
    }
  }

  public async signUp(credentials: CustomerDraft): Promise<AuthResponse> {
    try {
      await this.client.requestBuilder
        .customers()
        .post({
          body: credentials,
        })
        .execute();

      return await this.signIn({
        username: credentials.email,
        password: credentials.password || '',
      });
    } catch (error: unknown) {
      this.client.switchToDefaultClient();

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to Sign Up',
      };
    }
  }

  public async signOut(): Promise<void> {
    const token = localStorage.getItem('auth');

    if (token) {
      await this.client.revokeToken();
      localStorage.removeItem('auth');
      await this.client.switchToAnonFlow();
      this.user = await this.client.init();
    }
  }
}
