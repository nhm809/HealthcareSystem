import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@components/Layout/Layout'

function TestSti() {
     const navigate = useNavigate();
     return (

          <MainLayout>
               <Result
               status="warning"
               title="Chào mừng bạn đến với trang xét nghiệm STIs."
               extra={
                    <Button type="primary" key="console" onClick={() => navigate('/')}>
                    Về trang chủ
                    </Button>
               }
          />
          </MainLayout>
          
     );
}

export default TestSti;