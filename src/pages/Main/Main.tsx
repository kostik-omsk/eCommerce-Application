import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { IntroMain } from './ui/IntroMain';
import { CategoriesMain } from './ui/CategoriesMain';
import { CarouselMain } from './ui/CarouselMain';

export const Main = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage({ maxCount: 1 });

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
    <>
      {contextHolder}
      <IntroMain />
      <CategoriesMain />
      <CarouselMain />
    </>
  );
};
