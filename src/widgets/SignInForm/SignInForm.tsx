import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import type { UserAuthOptions } from '@commercetools/sdk-client-v2/dist/declarations/src/types/sdk';
import { useAuth } from '@shared/hooks';
import { validateEmail, validatePassword } from '@features/Validation';

type FieldType = {
  email: string;
  password: string;
};

const SignInInputForm = () => {
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const { signIn } = useAuth();
  const navigate = useNavigate();
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
      }
    });
  };

  return (
    <>
      <Form
        name="login_form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        {contextHolder}
        <Form.Item<FieldType>
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
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }, { validator: validatePassword }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <div>
          You don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </div>
      </Form>
    </>
  );
};

export { SignInInputForm };
