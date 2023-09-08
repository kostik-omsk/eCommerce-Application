import type { Customer, CustomerDraft } from '@commercetools/platform-sdk';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { ApiClient } from '@shared/api/core';

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
    try {
      this.client.switchToPasswordClient(credentials);

      const response = await this.client.requestBuilder
        .me()
        .login()
        .post({
          body: {
            ...credentials,
            email: credentials.username,
          },
        })
        .execute();

      this.user = response.body.customer;

      return {
        success: true,
        data: response.body.customer,
      };
    } catch (error: unknown) {
      this.client.switchToDefaultClient();

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
      await this.client.revokeToken(token);
      localStorage.removeItem('auth');
    }

    this.client.switchToDefaultClient();
    this.user = null;
  }
}
