import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@app/auth';
import { router } from './router/';
import './styles/color-variables.css';
import './styles/margin-padding-variables.css';
import './styles/App.css';

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;
