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
     UserOutlined,
} from '@ant-design/icons';
import AppointmentManagement from '../../pages/Consultant/AppointmentManagement';
// Placeholder components for other menu items
import Profile from '../../pages/Profile/Profile';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { notiApi, authApi, getInfo } from '../../services/api';
import Schedule from '../Schedule/schedule';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import NotificationDropdown from '../NotificationDropdown';
import Logos from '../../assets/imgs/Logos.png';
import './ConsultantLayout.css';

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

     // Notification logic giống Header.jsx
     const handleMarkAllAsRead = async () => {
          try {
               const unreadNotifications = notifications.filter(n => !n.isRead);
               await Promise.all(unreadNotifications.map(noti => notiApi.markAsRead(noti.notificationId)));
               setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
               setUnreadCount(0);
          } catch (err) {
               console.error('Error marking all notifications as read:', err);
          }
     };
     const notificationItems = [
          {
               key: 'notifications',
               label: (
                    <NotificationDropdown
                         notifications={notifications}
                         unreadCount={unreadCount}
                         onMarkAsRead={handleNotificationClick}
                         onMarkAllAsRead={handleMarkAllAsRead}
                    />
               )
          }
     ];

     const menuItems = [
          {
               key: 'dashboard',
               icon: <CalendarOutlined />,
               label: 'Danh sách lịch hẹn',
          },
          {
               key: 'work-schedule',
               icon: <CalendarOutlined />,
               label: 'Lịch làm việc',
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
               case 'work-schedule':
                    return <Schedule />;
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
               <Sider width={300} className="consultant-sider">
                    <div className="consultant-sider-top">
                         <div className="consultant-logo">
                              <img src={Logos} alt="MedSex Logo" style={{ width: 50 }} />
                              <span className="consultant-logo-text">MedSex</span>
                         </div>

                         <div className="consultant-avatar-container">
                              <Avatar
                                   size={80}
                                   src={userInfo?.avatar || null}
                                   icon={!userInfo?.avatar && <UserOutlined />}
                              />
                              <div className="consultant-avatar-name">{userInfo?.fullName || "(CONSULTANT)"}</div>
                         </div>
                         

                         <Menu
                              theme="dark"
                              mode="inline"
                              selectedKeys={[selectedKey]}
                              items={menuItems}
                              onClick={({ key }) => setSelectedKey(key)}
                              style={{ fontSize: 16 }}
                         />
                    </div>

                    <div className="consultant-logout-wrapper">
                    <button onClick={() => {
                         Cookies.remove('email');
                         Cookies.remove('userid');
                         Cookies.remove('userId');
                         Cookies.remove('token');
                         Cookies.remove('refreshToken');
                         localStorage.removeItem('userInfo');
                         navigate('/');
                         window.location.reload();
                    }} className="consultant-logout-button">
                         <span className="consultant-logout-icon">
                         <LogoutOutlined />
                         </span>
                         <span className="consultant-logout-text">Đăng xuất</span>
                    </button>
                    </div>
               </Sider>
               <Layout>
                    <Header className="consultant-header">
                         <span className="consultant-header-text">Consultant Dashboard</span>
                         <Dropdown menu={{ items: notificationItems }} trigger={['click']} placement="bottomRight">
                              <Badge count={unreadCount}>
                                   <FontAwesomeIcon icon={faBell} style={{ fontSize: 24, cursor: 'pointer', color: '#1890ff' }} />
                              </Badge>
                         </Dropdown>
                    </Header>

                    <Content className="consultant-content">
                         {renderContent()}
                    </Content>
               </Layout>
          </Layout>
     );
};

export default ConsultantLayout; 