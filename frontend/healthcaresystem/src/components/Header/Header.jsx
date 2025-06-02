import { useState } from 'react';
import AuthModal from './AuthModal/AuthModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';

function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState(0); // 0: Login, 1: Register
  const navigate = useNavigate();
  const email = Cookies.get('email');

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
    Cookies.remove('token');
    window.location.reload();
  };

  return (
    <>
      <div className="header">
          <span>Hotline:
               <FontAwesomeIcon icon={faPhone} id="phone-icon"/>
               <strong>1900 3366</strong>
          </span>
        <div className="auth-buttons">
          {email ? (
            <div className="user-info">
              <span className="text-header">
                {email}
              </span>

              <div className="user-dropdown">
                <div className="user-avatar">
                  <Avatar size="large" icon={<UserOutlined />} />
                </div>

              <div className="user-dropdown-content">
                <button onClick={handleLogout} className="logout-button">
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
                  Đăng xuất
                </button>
              </div>
            </div>
            </div>

            
          ) : (
            <>
              <a className="text-header-lg" href="#" onClick={() =>{handleOpenModal(0)}}>Đăng nhập</a>/
              <a className="text-header-lg" href="#" onClick={() =>{handleOpenModal(1)}}> Đăng ký</a>
            </>
          )}
        </div>
      </div>
      <AuthModal open={modalOpen} onClose={handleCloseModal} defaultTab={defaultTab} />

      <div className="top-bar">
          <span className="logo">HealthCare App</span>
        
        <div className="menu">
          <button>
               Dịch vụ
               <FontAwesomeIcon icon={faAngleDown} id="service-icon"/> 
          </button>
          <button>Hỏi đáp bác sĩ</button>
          <button>Theo dõi chu kỳ sinh sản</button>
          <button onClick={() => navigate('/blog')}>Blog</button>
        </div>
      </div>
    </>
  );
}

export default Header;