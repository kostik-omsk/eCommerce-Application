import { useNavigate } from 'react-router-dom';
import { Result, Button } from 'antd';

const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => navigate('/', { replace: true });

  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={handleClick}>
          Back Home
        </Button>
      }
    />
  );
};

export { NotFound };
