import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import classes from './UserAvatar.module.css';

// Подумать над добавлением crossOrigin для анонима / пользователя, чтобы лого было всегда
const UserAvatar = ({ username, isopen }: { username: string; isopen: boolean }) => {
  const conditional = username.length <= 8;

  return (
    <Avatar
      className={isopen ? classes.avatarActiv : classes.avatar}
      size={conditional ? 'large' : undefined}
      icon={!conditional ? <UserOutlined /> : null}
    >
      {username || null}
    </Avatar>
  );
};

export { UserAvatar };
