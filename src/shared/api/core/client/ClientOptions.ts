import type {
  AuthMiddlewareOptions,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  AnonymousAuthMiddlewareOptions,
} from '@commercetools/sdk-client-v2';
import type {
  RefreshAuthMiddlewareOptions,
  UserAuthOptions,
} from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';

const {
  VITE_CTP_CLIENT_ID: clientId,
  VITE_CTP_CLIENT_SECRET: clientSecret,
  VITE_CTP_SCOPES: scopes,
  VITE_CTP_AUTH_URL: authUrl,
  VITE_CTP_API_URL: apiUrl,
  VITE_CTP_PROJECT_KEY: projectKey,
} = import.meta.env;

class ClientOptions {
  private responseHandler = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const response = await fetch(input, init);

    const json = await response.clone().json();

    if (json.access_token) localStorage.setItem('auth', json.access_token);

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

  public getAnonCredentialOptions(): AnonymousAuthMiddlewareOptions {
    const token = localStorage.getItem('auth');

    function generateUniqId(): string {
      let result = '';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < 16) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }

    if (!token) {
      localStorage.setItem('anon_id', generateUniqId());
    }

    const anonId = localStorage.getItem('anon_id');

    const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await fetch(input, init);
      const json = await response.clone().json();
      if (json.access_token) localStorage.setItem('auth', json.access_token);
      if (json.refresh_token) localStorage.setItem('anon_refresh_token', json.refresh_token);
      return response;
    };
    const credentials = { clientId, clientSecret, anonId };
    const scopesX = scopes.split(',');
    const options: AnonymousAuthMiddlewareOptions = {
      host: authUrl,
      projectKey,
      credentials,
      scopes: scopesX,
      fetch: fetcher,
    };
    return options;
  }

  public getRefreshCredentialOptions(): RefreshAuthMiddlewareOptions {
    const anonRefreshToken = localStorage.getItem('anon_refresh_token') as string;

    const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
      const response = await fetch(input, init);
      const json = await response.clone().json();
      if (json.access_token) localStorage.setItem('auth', json.access_token);
      if (json.refresh_token) localStorage.setItem('anon_refresh_token', json.refresh_token);
      return response;
    };

    const credentials = { clientId, clientSecret };
    const options: RefreshAuthMiddlewareOptions = {
      host: authUrl,
      projectKey,
      credentials,
      refreshToken: anonRefreshToken,
      fetch: fetcher,
    };
    return options;
  }
}

export { ClientOptions };
