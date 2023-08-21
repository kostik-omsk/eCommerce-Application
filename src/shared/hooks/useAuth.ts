import { useContext } from 'react';
import { AuthContext } from '@app/auth';

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth };
