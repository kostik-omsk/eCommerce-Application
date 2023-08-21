import { Navigate } from 'react-router-dom';
import { useAuth } from '@shared/hooks';
import { SingUpForm } from '@widgets/SingUpForm';
import styles from './SignUp.module.css';

export const SignUp = () => {
  const { user } = useAuth();

  return (
    <>
      {user ? (
        <Navigate to={'/'} replace={true} />
      ) : (
        <>
          <div className={styles.sugnUpForm}>
            <h2>Registration</h2>

            <SingUpForm />
          </div>
        </>
      )}
    </>
  );
};
