import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Badge, List, Typography } from 'antd';
import {
     AppstoreOutlined,
     UserOutlined,
     LogoutOutlined,
     BellOutlined,
     ProfileOutlined,
     SettingOutlined,
     MedicineBoxOutlined,
     TeamOutlined,
} from '@ant-design/icons';
import ManagerDashboard from '../../pages/Manager/ManagerDashboard';
import Profile from '../../pages/Profile/Profile';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { notiApi, authApi, getInfo } from '../../services/api';
import dayjs from 'dayjs';
import { icon } from '@fortawesome/fontawesome-svg-core';
import ServiceManagement from '../../pages/Manager/ServiceManagement';
import EmployeeManagement from '../../pages/Manager/EmployeeManagement';
import SpecialtyManagement from '../../pages/Manager/SpecialtyManagement';
import NotificationDropdown from '../NotificationDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import WeeklyOverrideScheduleManagement from '../../pages/Manager/WeeklyOverrideScheduleManagement';
import Logos from '../../assets/imgs/Logos.png';
import './ManagerLayout.css';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

const ManagerLayout = () => {
     const [selectedKey, setSelectedKey] = useState(() => {
          const savedKey = localStorage.getItem('managerSelectedKey');
          return savedKey || 'dashboard';
     });
     const navigate = useNavigate();
     const [userInfo, setUserInfo] = useState(null);
     const [notifications, setNotifications] = useState([]);
     const [unreadCount, setUnreadCount] = useState(0);

     useEffect(() => {
          const info = JSON.parse(localStorage.getItem('userInfo'));
          if (!info || info.roleId !== 'MG') {
               navigate('/login');
               return;
          }
          const userId = Cookies.get('userId');
          if (userId) {
               getInfo(userId)
                    .then((res) => {
                         setUserInfo(res.data);
                    })
                    .catch((err) => {
                         setUserInfo(info);
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
          } catch (err) {}
     };

     const handleMarkAllAsRead = async () => {
          try {
               await notiApi.markAllAsRead(Cookies.get('userId'));
               setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
               setUnreadCount(0);
          } catch (err) {}
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
               icon: <AppstoreOutlined />,
               label: 'Dashboard',
          },
          {
               key: 'service-management',
               icon: <MedicineBoxOutlined />,
               label: 'Dịch vụ',
          },
          {
               key: 'specialty-management',
               icon: <ProfileOutlined />, // hoặc AppstoreOutlined nếu muốn
               label: 'Chuyên khoa',
          },
          {
               key: 'employee-management',
               icon: <TeamOutlined />,
               label: 'Nhân viên'
          },
          {
               key: 'weekly-override-management',
               icon: <ProfileOutlined />,
               label: 'Đăng ký làm thêm/nghỉ',
          },
          {
               key: 'my-profile',
               icon: <UserOutlined />,
               label: 'Cài đặt cá nhân',
          }
     ];

     const renderContent = () => {
          switch (selectedKey) {
               case 'dashboard':
                    return <ManagerDashboard />;
               case 'service-management':
                    return <ServiceManagement/>;
               case 'specialty-management':
                    return <SpecialtyManagement/>;
               case 'employee-management':
                    return <EmployeeManagement/>;     
               case 'my-profile':
                    return <Profile hideBackButton={true} />;     
               case 'weekly-override-management':
                    return <WeeklyOverrideScheduleManagement />;
               default:
                    return <ManagerDashboard />;
          }
     };

     return (
          <Layout style={{ minHeight: '100vh' }}>
               <Sider width={300} className="manager-sider">
                    <div className="manager-sider-top">
                         <div className="manager-logo">
                              <img src={Logos} alt="MedSex Logo" style={{ width: 50 }} />
                              <span className="manager-logo-text">MedSex</span>
                         </div>

                         <div className="manager-avatar-container">
                              <Avatar
                                   size={80}
                                   src={userInfo?.avatar || null}
                                   icon={!userInfo?.avatar && <UserOutlined />}
                              />
                              <div className="manager-avatar-name">{userInfo?.fullName || "(MANAGER)"}</div>
                         </div>
                         

                         <Menu
                              theme="dark"
                              mode="inline"
                              selectedKeys={[selectedKey]}
                              items={menuItems}
                              onClick={({ key }) => {
                                   setSelectedKey(key);
                                   localStorage.setItem('managerSelectedKey', key);
                              }}
                              style={{ fontSize: 16 }}
                         />
                    </div>

                    <div className="manager-logout-wrapper">
                    <button onClick={() => {
                         Cookies.remove('email');
                         Cookies.remove('userid');
                         Cookies.remove('userId');
                         Cookies.remove('token');
                         Cookies.remove('refreshToken');
                         localStorage.removeItem('userInfo');
                         localStorage.removeItem('managerSelectedKey');
                         navigate('/');
                         window.location.reload();
                    }} className="manager-logout-button">
                         <span className="manager-logout-icon">
                         <LogoutOutlined />
                         </span>
                         <span className="manager-logout-text">Đăng xuất</span>
                    </button>
                    </div>
               </Sider>
               <Layout>
                    <Header className="manager-header">
                         <span className="manager-header-text">Manager Dashboard</span>
                         <Dropdown menu={{ items: notificationItems }} trigger={['click']} placement="bottomRight">
                              <Badge count={unreadCount}>
                                   <FontAwesomeIcon icon={faBell} style={{ fontSize: 24, cursor: 'pointer', color: '#1890ff' }} />
                              </Badge>
                         </Dropdown>
                    </Header>

                    <Content className="manager-content">
                         {renderContent()}
                    </Content>
               </Layout>
          </Layout>
     );
};

export default ManagerLayout; 