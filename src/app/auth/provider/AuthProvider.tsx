import { createContext, type ReactNode, useState } from 'react';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import type { Customer, CustomerDraft } from '@commercetools/platform-sdk';
import { AuthService, type AuthResponse } from '@app/auth/service';

const authService = new AuthService();
await authService.init();

interface AuthProviderValue {
  user: Customer | null;
  signIn: (credentials: UserAuthOptions) => Promise<AuthResponse>;
  signUp: (credentials: CustomerDraft) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  setUser: (user: Customer | null) => void;
}

const AuthContext = createContext<AuthProviderValue>({
  user: authService.user,
  signIn: () => Promise.resolve({ success: false, message: '' }),
  signUp: () => Promise.resolve({ success: false, message: '' }),
  signOut: () => Promise.resolve(),
  setUser: () => Promise.resolve(),
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [customer, setCustomer] = useState<Customer | null>(authService.user);

  const signIn = async (credentials: UserAuthOptions): Promise<AuthResponse> => {
    const result: AuthResponse = await authService.signIn(credentials);

    if (result.success) {
      setCustomer(result.data);
      localStorage.removeItem('anon_id');
      localStorage.removeItem('anon_refresh_token');
    }
    return result;
  };

  const signUp = async (credentials: CustomerDraft): Promise<AuthResponse> => {
    const result: AuthResponse = await authService.signUp(credentials);

    if (result.success) setCustomer(result.data);

    return result;
  };

  const signOut = async (): Promise<void> => {
    await authService.signOut();
    setCustomer(null);
  };

  const setUser = (user: Customer | null): void => {
    setCustomer(user);
  };

  const value: AuthProviderValue = {
    user: customer,
    signIn,
    signUp,
    signOut,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
