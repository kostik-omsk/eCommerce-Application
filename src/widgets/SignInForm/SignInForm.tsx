import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { useCart } from 'pages/Cart/useCart';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { useAuth } from '@shared/hooks';
import { validateEmail, validatePassword } from '@features/Validation';
import styles from './SignInForm.module.css';

type FieldType = {
  email: string;
  password: string;
};

const SignInInputForm = () => {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const { initCart } = useCart();

  const onFinish = async (values: FieldType) => {
    const email = values.email;
    const password = values.password;

    const credentials: UserAuthOptions = {
      username: email,
      password: password,
    };

    signIn(credentials).then((result) => {
      if (!result.success) {
        messageApi.open({
          type: 'error',
          content: result.message,
          duration: 0.9,
          style: {
            color: 'red',
          },
        });
      } else {
        navigate('/', {
          replace: true,
          state: {
            hi: result.data.firstName,
          },
        });
        initCart();
      }
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Sign In</h2>
      <Form
        className={styles.form}
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {contextHolder}
        <Form.Item<FieldType>
          className={styles.formItem}
          labelCol={{ span: 4 }}
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your Email!' },
            {
              validator: validateEmail,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType>
          className={styles.formItem}
          labelCol={{ span: 4 }}
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }, { validator: validatePassword }]}
        >
          <Input.Password />
        </Form.Item>
        <Button className={styles.submit} type="primary" htmlType="submit">
          Submit
        </Button>
        <div className={styles.signupRedirect}>
          You don&apos;t have an account?<Link to="/signup">Sign Up</Link>
        </div>
      </Form>
    </div>
  );
};

export { SignInInputForm };
