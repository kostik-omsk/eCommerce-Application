import { ClientBuilder, type Client } from '@commercetools/sdk-client-v2';
import { createApiBuilderFromCtpClient, type Customer } from '@commercetools/platform-sdk';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { AuthOptions } from './AuthOptions';

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

export class ApiClient {
  private static instance: ApiClient;

  private readonly authOptions: AuthOptions;

  private readonly defaultClient: Client;

  private currentClient: Client;

  private constructor() {
    this.authOptions = new AuthOptions();

    this.defaultClient = new ClientBuilder()

      .withProjectKey(projectKey)
      .withClientCredentialsFlow(this.authOptions.getClientCredentialOptions())
      .withHttpMiddleware(this.authOptions.getHttpOptions())
      .build();

    this.currentClient = this.defaultClient;
  }

  public static getInstance() {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }

    return ApiClient.instance;
  }

  public get requestBuilder() {
    return createApiBuilderFromCtpClient(this.currentClient).withProjectKey({ projectKey });
  }

  public async init(): Promise<Customer | null> {
    const token = localStorage.getItem('auth');

    if (token) {
      try {
        this.switchToAccessTokenClient(token);

        const signInResult = await this.requestBuilder.me().get().execute();

        return signInResult.body;
      } catch {
        this.switchToDefaultClient();

        localStorage.removeItem('auth');
      }
    }

    return null;
  }

  public async revokeToken(token: string): Promise<void> {
    const {
      VITE_CTP_AUTH_URL: authUrl,
      VITE_CTP_CLIENT_SECRET: clientSecret,
      VITE_CTP_CLIENT_ID: clientId,
    } = import.meta.env;

    try {
      await fetch(`${authUrl}/oauth/token/revoke`, {
        method: 'POST',
        body: `token=${token}&token_type_hint=access_token`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${window.btoa(`${clientId}:${clientSecret}`)}`,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) console.error(error.message);
    }
  }

  public switchToAccessTokenClient(token: string): void {
    this.currentClient = new ClientBuilder()
      .withProjectKey(projectKey)
      .withExistingTokenFlow(`Bearer ${token}`, { force: true })
      .withHttpMiddleware(this.authOptions.getHttpOptions())
      .build();
  }

  public switchToPasswordClient(user: UserAuthOptions): void {
    this.currentClient = new ClientBuilder()
      .withProjectKey(projectKey)
      .withPasswordFlow(this.authOptions.getPasswordOptions(user))
      .withHttpMiddleware(this.authOptions.getHttpOptions())
      .build();
  }

  public switchToDefaultClient(): void {
    this.currentClient = this.defaultClient;
  }
}
