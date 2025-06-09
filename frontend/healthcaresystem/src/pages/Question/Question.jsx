import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@components/Layout/Layout'

function BlogPage() {
     const navigate = useNavigate();
     return (

          <MainLayout>
               <Result
               status="warning"
               title="Hmmm Chúng tôi đang phát triển tính năng này, quay lại sau nhennn <333."
               extra={
                    <Button type="primary" key="console" onClick={() => navigate('/')}>
                    Về trang chủ
                    </Button>
               }
          />
          </MainLayout>
          
     );
}

export default BlogPage;