import React, { useState, useEffect } from 'react';
import AuthModal from './AuthModal/AuthModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faFlask } from '@fortawesome/free-solid-svg-icons';
import { faCheckDouble } from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Avatar, Space, Dropdown, Badge, List, Typography, Button, Divider } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getInfo } from '../../services/api';
import { notiApi } from '../../services/api';
import dayjs from 'dayjs';
import { authApi } from '../../services/api';
import  logo  from '../../assets/imgs/logo.png'
import NotificationDropdown from '../NotificationDropdown';

const { Text } = Typography;

function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState(0); // 0: Login, 1: Register
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const email = Cookies.get('email');

  useEffect(() => {
    // Request notification permission
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }

    const userId = Cookies.get('userId') || Cookies.get('userid');
    if (userId) {
      getInfo(userId).then(res => {
        setUser({
          ...res.data,
          avatar: res.data.avatarPath || res.data.avatar
        });
      }).catch(() => setUser(null));

      // Initial fetch
      fetchNotifications(userId);

      // Set up polling for new notifications
      const pollInterval = setInterval(() => {
        const currentUserId = Cookies.get('userId') || Cookies.get('userid');
        if (currentUserId) {
          fetchNotifications(currentUserId);
        }
      }, 5000); // Check every 5 seconds

      // Cleanup interval on component unmount
      return () => clearInterval(pollInterval);
    }

    // Listen for userLogin event
    const handleUserLogin = (event) => {
      setUser(event.detail);
      const userId = Cookies.get('userId') || Cookies.get('userid');
      if (userId) {
        fetchNotifications(userId);
      }
    };
    window.addEventListener('userLogin', handleUserLogin);

    return () => {
      window.removeEventListener('userLogin', handleUserLogin);
    };
  }, []);

  const fetchNotifications = (userId) => {
    notiApi.getNotifications(userId).then(res => {
      const sortedNotifications = res.data.sort((a, b) =>
        new Date(b.sendTime) - new Date(a.sendTime)
      );

      // Check if there are new unread notifications
      const newUnreadCount = sortedNotifications.filter(n => !n.isRead).length;
      if (newUnreadCount > unreadCount) {
        // If there are new unread notifications, show a notification
        const newNotifications = sortedNotifications.filter(n => !n.isRead).slice(0, newUnreadCount - unreadCount);
        newNotifications.forEach(noti => {
          if (Notification.permission === 'granted') {
            const notification = new Notification(noti.title, {
              body: noti.content,
              icon: '/path/to/your/icon.png'
            });
          }
        });
      }

      setNotifications(sortedNotifications);
      setUnreadCount(newUnreadCount);
    }).catch(err => {
      console.error('Error fetching notifications:', err);
      // If token is invalid, try to refresh it
      if (err.response?.status === 401) {
        const refreshToken = Cookies.get('refreshToken');
        if (refreshToken) {
          authApi.refreshToken(refreshToken).then(response => {
            const { token } = response.data;
            Cookies.set('token', token);
            // Retry fetching notifications
            fetchNotifications(userId);
          });
        }
      }
    });
  };

  const handleOpenModal = (tab) => {
    setDefaultTab(tab);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove('email');
    Cookies.remove('userid');
    Cookies.remove('userId');
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    localStorage.removeItem('userInfo');
    navigate('/');
    window.location.reload();
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const handleViewQuestions = () => {
    navigate('/my-questions');
  };

  const handleViewTestHistory = () => {
    navigate('/test-history'); 
  };

  const handleViewAppointmentHistory = () => {
    navigate('/appointment-history');
  };

  const handleNotificationClick = async (notiId) => {
    try {
      await notiApi.markAsRead(notiId);
      setNotifications(prev =>
        prev.map(n => n.notificationId === notiId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(unreadNotifications.map(noti => notiApi.markAsRead(noti.notificationId)));
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
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

  const items = [
    {
      key: '1',
      label: 'Xem Profile',
      icon: <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />,
      onClick: handleViewProfile
    },
    {
      key: '2',
      label: 'Câu hỏi đã đặt',
      icon: <FontAwesomeIcon icon={faQuestionCircle} style={{ marginRight: '8px' }} />,
      onClick: handleViewQuestions
    },
    {
      key: '3',
      label: 'Lịch sử cuộc hẹn',
      icon: <FontAwesomeIcon icon={faCalendarAlt} style={{ marginRight: '8px' }} />,
      onClick: handleViewAppointmentHistory
    },
    {
      key: '4',
      label: 'Lịch xét nghiệm',
      icon: <FontAwesomeIcon icon={faFlask} style={{ marginRight: '8px' }} />,
      onClick: handleViewTestHistory
    },
    {
      key: '5',
      label: 'Đăng xuất',
      icon: <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />,
      onClick: handleLogout
    },
  ];

  return (
    <>
      <div className="header">
        <span>Hotline:
          <FontAwesomeIcon icon={faPhone} id="phone-icon" />
          <strong>1900 3366</strong>
        </span>
        <div className="auth-buttons">
          {email ? (
            <div className="user-info">
              <span className="text-header">
                {email}
              </span>

              <Dropdown
                menu={{ items: notificationItems }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Badge count={unreadCount} style={{ marginRight: '16px' }}>
                  <FontAwesomeIcon
                    icon={faBell}
                    style={{
                      fontSize: '20px',
                      cursor: 'pointer',
                      color: '#ffff'
                    }}
                  />
                </Badge>
              </Dropdown>

              <Dropdown
                menu={{ items }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Avatar size="large" src={user?.avatar} icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
              </Dropdown>
            </div>
          ) : (
            <>
              <a className="text-header-lg" href="#" onClick={() => { handleOpenModal(0) }}>Đăng nhập</a>/
              <a className="text-header-lg" href="#" onClick={() => { handleOpenModal(1) }}> Đăng ký</a>
            </>
          )}
        </div>
      </div>
      <AuthModal open={modalOpen} onClose={handleCloseModal} defaultTab={defaultTab} />

      <div className="top-bar">
        <span className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="" style={{width: '50px', height: '50px'}}/>
        </span>

        <div className="menu">
          <button onClick={() => navigate('/')}>Trang chủ</button>
          <div className="service-dropdown">
            
            <button className="service-dropdown-button">
              Dịch vụ
              <FontAwesomeIcon icon={faAngleDown} id="service-icon" />
            </button>

          

          <div className="service-dropdown-content">
              <button className="stis-button" onClick={(() => navigate('/test-sti'))}>Xét Nghiệm STIs</button>
              <button onClick={() => navigate('/appointment', {
                state: { serviceId: 2 }
              })}>
                Tư vấn Trực Tuyến
              </button>
            </div>
          </div>

                              <button onClick={() => navigate('/question')}>Hỏi đáp bác sĩ</button>
                    <button onClick={() => navigate('/chatbot')}>Trợ lý AI</button>
                    <button className="cycle-button" onClick={(() => navigate('/reproductive-cycle'))}>Theo dõi chu kỳ sinh sản</button>
                    <button onClick={() => navigate('/blog')}>Blog</button>
        </div>
      </div>
    </>
  );
}

export default Header;