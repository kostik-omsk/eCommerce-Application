import { Customer } from '@commercetools/platform-sdk';
import { DescriptionsProps, Descriptions } from 'antd';

// Окно информации о пользователе (Имя, Фамилия, Почта) на странице
export function FillDesriptionProps(user: Customer) {
  const items: DescriptionsProps['items'] = [];

  let newKey = 1;

  if (user) {
    // Заполняем данные пользователя, основываясь на доступных данных
    const userData = [];
    if (`${user?.firstName}` !== 'undefined') {
      userData.push(['Name', `${user?.firstName}`]);
    }
    if (`${user?.lastName}` !== 'undefined') {
      userData.push(['Last Name', `${user?.lastName}`]);
    }
    if (`${user?.dateOfBirth}` !== 'undefined') {
      userData.push(['Date of birth', `${user?.dateOfBirth}`]);
    }
    if (`${user?.email}` !== 'undefined') {
      userData.push(['Email', `${user?.email}`]);
    }
    for (let i = 0; i < userData.length; i += 1) {
      newKey += 1;
      items?.push({
        key: newKey,
        label: userData[i][0],
        children: userData[i][1],
      });
    }
  }

  return (
    <>
      <Descriptions title={`Personal information`} bordered items={items} column={1} />{' '}
    </>
  );
}
