import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, List, Typography } from 'antd';
import QuestionManagement from '../../pages/Consultant/QuestionManagement';
import BlogManagement from '../../pages/Consultant/BlogManagement';
import {
     CalendarOutlined,
     QuestionCircleOutlined,
     BookOutlined,
     SettingOutlined,
     LogoutOutlined,
     BellOutlined,
} from '@ant-design/icons';
import AppointmentManagement from '../../pages/Consultant/AppointmentManagement';
// Placeholder components for other menu items
import Profile from '../../pages/Profile/Profile';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { notiApi, authApi, getInfo } from '../../services/api';
import dayjs from 'dayjs';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const ConsultantLayout = () => {
     const [selectedKey, setSelectedKey] = useState('dashboard');
     const navigate = useNavigate();
     const [userInfo, setUserInfo] = useState(null);
     const [notifications, setNotifications] = useState([]);
     const [unreadCount, setUnreadCount] = useState(0);

     useEffect(() => {
          const info = JSON.parse(localStorage.getItem('userInfo'));
          if (!info || info.roleId !== 'CS') {
               navigate('/login');
               return;
          }
          // Fetch user info from API
          const userId = Cookies.get('userId');
          if (userId) {
               getInfo(userId)
                    .then((res) => {
                         setUserInfo(res.data);
                    })
                    .catch((err) => {
                         console.error('Error fetching user info:', err);
                         setUserInfo(info); // fallback to localStorage if API fails
                    });
          }
     }, [navigate]);

     useEffect(() => {
          if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
               Notification.requestPermission();
          }
          const userId = Cookies.get('userId');

          const fetchNotifications = (userId) => {
               notiApi
                    .getNotifications(userId)
                    .then((res) => {
                         const sortedNotifications = res.data.sort((a, b) => new Date(b.sendTime) - new Date(a.sendTime));
                         const newUnreadCount = sortedNotifications.filter((n) => !n.isRead).length;

                         if (newUnreadCount > unreadCount) {
                              const newNotifications = sortedNotifications
                                   .filter((n) => !n.isRead)
                                   .slice(0, newUnreadCount - unreadCount);
                              newNotifications.forEach((noti) => {
                                   if (Notification.permission === 'granted') {
                                        new Notification(noti.title, { body: noti.content });
                                   }
                              });
                         }
                         setNotifications(sortedNotifications);
                         setUnreadCount(newUnreadCount);
                    })
                    .catch((err) => {
                         console.error('Error fetching notifications:', err);
                         if (err.response?.status === 401) {
                              const refreshToken = Cookies.get('refreshToken');
                              if (refreshToken) {
                                   authApi.refreshToken(refreshToken).then((response) => {
                                        const { token } = response.data;
                                        Cookies.set('token', token);
                                        fetchNotifications(userId);
                                   });
                              }
                         }
                    });
          };

          if (userId) {
               fetchNotifications(userId);
               const pollInterval = setInterval(() => fetchNotifications(userId), 5000);
               return () => clearInterval(pollInterval);
          }
     }, [unreadCount, navigate]);

     const handleNotificationClick = async (notiId) => {
          try {
               await notiApi.markAsRead(notiId);
               setNotifications((prev) => prev.map((n) => (n.notificationId === notiId ? { ...n, isRead: true } : n)));
               setUnreadCount((prev) => Math.max(0, prev - 1));
          } catch (err) {
               console.error('Error marking notification as read:', err);
          }
     };

     const notificationItems = [
          {
               key: 'notifications',
               label: (
                    <List
                         style={{
                              width: 300,
                              maxHeight: 400,
                              overflow: 'auto',
                              overflowX: 'hidden',
                         }}
                         dataSource={notifications}
                         renderItem={(item) => (
                              <List.Item
                                   onClick={() => handleNotificationClick(item.notificationId)}
                                   style={{
                                        cursor: 'pointer',
                                        backgroundColor: item.isRead ? 'transparent' : '#f0f0f0',
                                        padding: '8px 12px',
                                        borderBottom: '1px solid #f0f0f0',
                                   }}
                              >
                                   <List.Item.Meta
                                        title={
                                             <div
                                                  style={{
                                                       color: item.isRead ? 'rgba(0, 0, 0, 0.45)' : '#1890ff',
                                                       fontWeight: item.isRead ? 'normal' : 'bold',
                                                       whiteSpace: 'normal',
                                                       wordBreak: 'break-word',
                                                  }}
                                             >
                                                  {item.title}
                                             </div>
                                        }
                                        description={
                                             <>
                                                  <Text type="secondary" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                                                       {item.content}
                                                  </Text>
                                                  <br />
                                                  <Text type="secondary" style={{ fontSize: '12px' }}>
                                                       {dayjs(item.sendTime).format('DD/MM/YYYY HH:mm')}
                                                  </Text>
                                             </>
                                        }
                                   />
                              </List.Item>
                         )}
                    />
               ),
          },
     ];

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
                    return <AppointmentManagement />;
               case 'questions':
                    return <QuestionManagement />;
               case 'blogs':
                    return <BlogManagement />;
               case 'my-profile':
                    return <Profile hideBackButton={true} />;
               default:
                    return <AppointmentManagement />;
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
                              <Avatar size={80} src={userInfo?.avatarPath || userInfo?.avatar} />
                              <div style={{ color: '#fff', fontWeight: 600, marginTop: 8, fontSize: 18 }}>
                                   {userInfo?.fullName}
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
                    <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                         <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']}>
                              <Badge count={unreadCount}>
                                   <BellOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
                              </Badge>
                         </Dropdown>
                    </Header>
                    <Content style={{ margin: '24px' }}>
                         <div>
                              {renderContent()}
                         </div>
                    </Content>
               </Layout>
          </Layout>
     );
};

export default ConsultantLayout; 