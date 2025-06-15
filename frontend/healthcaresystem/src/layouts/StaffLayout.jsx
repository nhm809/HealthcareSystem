import React, { useState, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  CalendarOutlined,
  TeamOutlined,
  MedicineBoxOutlined,
} from '@ant-design/icons';
import Dashboard from '../pages/Staff/StaffDashboard';
import Appointments from '../pages/Staff/Appointments';
import Patients from '../pages/Staff/Patients';
import Services from '../pages/Staff/Services';
import StaffSchedule from '../pages/Staff/StaffSchedule';
import { useNavigate } from 'react-router-dom';

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
      label: 'Lịch hẹn của tôi',
    },
    {
      key: 'appointments',
      icon: <CalendarOutlined />,
      label: 'Lịch hẹn',
    },
    {
      key: 'patients',
      icon: <TeamOutlined />,
      label: 'Bệnh nhân',
    },
    {
      key: 'services',
      icon: <MedicineBoxOutlined />,
      label: 'Dịch vụ',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'dashboard':
        return <Dashboard />;
      case 'my-schedule':
        return <StaffSchedule />;
      case 'appointments':
        return <Appointments />;
      case 'patients':
        return <Patients />;
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
        style={{ background: '#001529' }}
        width={220}
      >
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