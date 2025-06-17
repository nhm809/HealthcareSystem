import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar } from 'antd';
import {
     CalendarOutlined,
     QuestionCircleOutlined,
     BookOutlined,
     SettingOutlined,
     LogoutOutlined
} from '@ant-design/icons';
import ConsultantDashboard from '../../pages/Consultant/ConsultantDashboard';
// Placeholder components for other menu items
const QuestionManagement = () => <div>Quản lý câu hỏi (đang phát triển)</div>;
const BlogManagement = () => <div>Quản lý Blog (đang phát triển)</div>;
import Profile from '../../pages/Profile/Profile';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const { Sider, Content } = Layout;

const ConsultantLayout = () => {
     const [selectedKey, setSelectedKey] = useState('dashboard');
     const navigate = useNavigate();
     const [userInfo, setUserInfo] = useState(null);

     useEffect(() => {
          const info = JSON.parse(localStorage.getItem('userInfo'));
          setUserInfo(info);
          if (!info || info.roleId !== 'CS') {
               navigate('/login');
          }
     }, [navigate]);

     const menuItems = [
          {
               key: 'dashboard',
               icon: <CalendarOutlined />,
               label: 'Danh sách lịch hẹn',
          },
          {
               key: 'questions',
               icon: <QuestionCircleOutlined />,
               label: 'Quản lý câu hỏi',
          },
          {
               key: 'blogs',
               icon: <BookOutlined />,
               label: 'Quản lý Blog',
          },
          {
               key: 'my-profile',
               icon: <SettingOutlined />,
               label: 'Cài đặt cá nhân',
          },
     ];

     const renderContent = () => {
          switch (selectedKey) {
               case 'dashboard':
                    return <ConsultantDashboard />;
               case 'questions':
                    return <QuestionManagement />;
               case 'blogs':
                    return <BlogManagement />;
               case 'my-profile':
                    return <Profile hideBackButton={true} />;
               default:
                    return <ConsultantDashboard />;
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
                              CONSULTANT
                         </div>
                         <div style={{ textAlign: 'center', marginBottom: 16 }}>
                              <Avatar size={80} src={userInfo?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg'} />
                              <div style={{ color: '#fff', fontWeight: 600, marginTop: 8, fontSize: 18 }}>
                                   {userInfo?.fullName || 'Dr. Nguyễn Văn A'}
                              </div>
                         </div>
                         <Menu
                              theme="dark"
                              mode="inline"
                              selectedKeys={[selectedKey]}
                              items={menuItems}
                              onClick={({ key }) => setSelectedKey(key)}
                              style={{ borderRight: 0, fontSize: 16, background: 'transparent' }}
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
                              <LogoutOutlined style={{ marginRight: 8 }} /> Đăng xuất
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

export default ConsultantLayout; 