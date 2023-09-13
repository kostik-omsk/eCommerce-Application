import { useState, useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Badge, Dropdown, MenuProps, Space } from 'antd';
import { useCart } from 'pages/Cart/useCart';
import { DownOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useAuth } from '@shared/hooks';
import { UserAvatar } from '@widgets/userAvatar';
import styles from './UserMenu.module.css';
import { CartContext } from 'pages/Cart/CartProvider';

export const UserMenu = ({ onCloseMenu }: { onCloseMenu: () => void }) => {
  const { cart } = useContext(CartContext);
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { initCart } = useCart();

  const handleLinkClick = () => {
    onCloseMenu();
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const username = (user && user.firstName) || '';

  const handleSignOut = () => {
    signOut().then(() => {
      navigate('/', {
        state: { bye: username },
      });
      initCart();
    });
    handleLinkClick();
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <>
          <Link to="/profile" onClick={handleLinkClick}>
            Profile
          </Link>
        </>
      ),
    },
    {
      key: '2',
      danger: true,
      label: <a onClick={handleSignOut}>Sign Out</a>,
    },
  ];
  return (
    <div className={styles.userBlock}>
      <Space size="large" align="center">
        {/* Доставать количество товарок которые лежат в корзине */}
        <Badge count={cart?.lineItems.length || 0} color="#137dc5">
          <NavLink className={styles.cartLink} to="cart" onClick={handleLinkClick}>
            <ShoppingCartOutlined />
          </NavLink>
        </Badge>
        {user ? (
          <>
            <Dropdown onOpenChange={handleOpenChange} open={isOpen} className={styles.userDrop} menu={{ items }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  <UserAvatar username={username} isopen={isOpen} />
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>
          </>
        ) : (
          <>
            <div className={styles.userLogin}>
              <NavLink className={styles.userLoginLink} to="/cart" onClick={handleLinkClick}>
                Cart
              </NavLink>
              <NavLink className={styles.userLoginLink} to="/signin" onClick={handleLinkClick}>
                Sign In
              </NavLink>
              <NavLink className={styles.userLoginLink} to="/signup" onClick={handleLinkClick}>
                Sign Up
              </NavLink>
            </div>
          </>
        )}
      </Space>
    </div>
  );
};
