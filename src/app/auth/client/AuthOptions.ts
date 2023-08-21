import type {
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';

const {
  VITE_CTP_CLIENT_ID: clientId,
  VITE_CTP_CLIENT_SECRET: clientSecret,
  VITE_CTP_SCOPES: scopes,
  VITE_CTP_AUTH_URL: authUrl,
  VITE_CTP_API_URL: apiUrl,
  VITE_CTP_PROJECT_KEY: projectKey,
} = import.meta.env;

export class AuthOptions {
  private responseHandler = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await fetch(input, init);

    const json = await response.clone().json();

    if (json.access_token) localStorage.setItem('auth', window.btoa(json.access_token));

    return response;
  };

  public getClientCredentialOptions(): AuthMiddlewareOptions {
    return {
      host: authUrl,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
      },
      scopes: scopes.split(' '),
      fetch,
    };
  }

  public getHttpOptions(): HttpMiddlewareOptions {
    return {
      host: apiUrl,
      fetch,
    };
  }

  public getPasswordOptions(user: UserAuthOptions): PasswordAuthMiddlewareOptions {
    return {
      host: authUrl,
      projectKey,
      credentials: {
        clientId,
        clientSecret,
        user,
      },
      scopes: scopes.split(' ').filter((scope) => scope !== `manage_customers:${projectKey}`),
      fetch: this.responseHandler,
    };
  }
}
