import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, MenuProps, message } from 'antd';
import {
  HomeOutlined,
  ProfileOutlined,
  ReadOutlined,
  ShoppingOutlined,
  UserAddOutlined,
  UserOutlined,
} from '@ant-design/icons';

const items: MenuProps['items'] = [
  {
    label: <Link to="/">Home</Link>,
    key: 'mail',
    icon: <HomeOutlined />,
  },
  {
    label: <Link to="/catalog">Catalog</Link>,
    key: 'Catalog',
    icon: <ShoppingOutlined />,
  },
  {
    label: <Link to="/about">About</Link>,
    key: 'about',
    icon: <ReadOutlined />,
  },
  {
    label: <Link to="/signin">Sign In</Link>,
    key: 'signin',
    icon: <UserOutlined />,
  },
  {
    label: <Link to="/signup">Sign Up</Link>,
    key: 'signup',
    icon: <UserAddOutlined />,
  },
  {
    label: <Link to="/profile">Profile</Link>,
    key: 'Profile',
    icon: <ProfileOutlined />,
  },
];

export const Main = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });
  const [current, setCurrent] = useState('mail');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  useEffect(() => {
    const hi = state?.hi;
    const bye = state?.bye;

    if (hi || bye) {
      messageApi.open({
        type: 'success',
        content: hi ? `Hello, ${hi}` : `Goodbye, ${bye}`,
      });

      navigate('/', { replace: true });
    }
  }, [state, messageApi, navigate]);

  return (
    <div style={{ color: '#000', width: '300px', margin: '0 auto' }}>
      <h2>Main page</h2>
      {contextHolder}
      <Menu onClick={onClick} selectedKeys={[current]} mode="vertical" items={items} />
    </div>
  );
};
