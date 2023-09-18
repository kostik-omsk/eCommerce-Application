import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks';
import { SignInInputForm } from '@widgets/SignInForm';
import { LoginOutlined } from '@ant-design/icons';
import style from './SignIn.module.css';

const SignIn = () => {
  const { user } = useAuth();

  return user ? (
    <Navigate to={'/'} replace={true} />
  ) : (
    <div className={style.signIn}>
      <LoginOutlined style={{ fontSize: '32px' }} />
      <h2>Sign In</h2>
      <SignInInputForm />
    </div>
  );
};

export { SignIn };
