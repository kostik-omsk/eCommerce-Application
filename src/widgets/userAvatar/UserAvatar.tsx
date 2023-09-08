import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import styles from './UserAvatar.module.css';

// Подумать над добавлением crossOrigin для анонима / пользователя, чтобы лого было всегда
const UserAvatar = ({ username, isopen }: { username: string; isopen: boolean }) => {
  const isLargeName = username.length <= 8;

  return (
    <Avatar
      className={isopen ? styles.avatarActive : styles.avatar}
      size={isLargeName ? 'large' : undefined}
      icon={!isLargeName ? <UserOutlined /> : null}
    >
      {username || null}
    </Avatar>
  );
};

export { UserAvatar };
