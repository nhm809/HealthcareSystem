import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AuthModal from './AuthModal/AuthModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../contexts/StoreProvider';
import Cookies from 'js-cookie';

function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState(0); // 0: Login, 1: Register
  const navigate = useNavigate();
  // const { userInfo } = useContext(StoreContext); thang nay de lay info
  const email = Cookies.get('email');

  const handleOpenModal = (tab) => {
    setDefaultTab(tab);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleLogout = () => {
    // Xóa tất cả cookies liên quan đến authentication
    Cookies.remove('email');
    Cookies.remove('userid');
    Cookies.remove('token');
    // Refresh trang để cập nhật trạng thái
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
            <div className="user-dropdown">
              <span className="text-header">
                <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />
                {email}
              </span>
              <div className="user-dropdown-content">
                <button onClick={handleLogout} className="logout-button">
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <>
              <a className="text-header" href="#" onClick={() =>{handleOpenModal(0)}}>Đăng nhập</a>/
              <a className="text-header" href="#" onClick={() =>{handleOpenModal(1)}}> Đăng ký</a>
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
          <button onClick={() => navigate('/verify-otp')}>Blog</button>
        </div>
      </div>
    </>
  );
}

export default Header;