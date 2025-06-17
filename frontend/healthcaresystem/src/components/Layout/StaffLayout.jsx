import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import Dashboard from '../../pages/Staff/StaffDashboard';
import Appointments from '../../pages/Staff/Appointments';
import Patients from '../../pages/Staff/Patients';
import Services from '../../pages/Staff/Services';
import StaffSchedule from '../../pages/Staff/StaffSchedule';
import TestDone from '../../pages/Staff/TestDone';
import Profile from '../../pages/Profile/Profile';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const { Sider, Content } = Layout;

const StaffLayout = () => {
  const [selectedKey, setSelectedKey] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.roleId !== 'ST') {
      navigate('/login');
    }
  }, [navigate]);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'my-schedule',
      icon: <CalendarOutlined />,
      label: 'Các xét nghiệm đang thực hiện',
    },
    
    {
      key: 'test-done',
      icon: <CalendarOutlined />,
      label: "Test Đã hoàn thành"
    },

    {
      key: 'my-profile',
      icon: <CalendarOutlined />,
      label: "My profile"
    }
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'my-schedule':
        return <StaffSchedule />;
      case 'my-profile':
        return <Profile hideBackButton={true} />; 
      case 'test-done':
        return <TestDone />;
      case 'services':
        return <Services />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        style={{ background: '#001529', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        width={300}
      >
        <div>
          <div style={{
            height: 48,
            margin: 16,
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 18
          }}>
            STAFF
          </div>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={({ key }) => setSelectedKey(key)}
            style={{ borderRight: 0, fontSize: 16 }}
          />
        </div>
        <div style={{ padding: 16 }}>
          <button
            onClick={() => {
              Cookies.remove('email');
              Cookies.remove('userid');
              Cookies.remove('userId');
              Cookies.remove('token');
              Cookies.remove('refreshToken');
              localStorage.removeItem('userInfo');
              navigate('/');
              window.location.reload();
            }}
            style={{
              width: '100%',
              background: 'none',
              border: 'none',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              padding: '12px 0',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseOver={e => e.currentTarget.style.background = '#222b3a'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: 8 }} /> Đăng xuất
          </button>
        </div>
      </Sider>
      <Layout>
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: '#f5f5f5',
              borderRadius: 8,
              boxShadow: '0 1px 4px rgba(0,21,41,.08)',
            }}
          >
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffLayout; 