import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import AuthModal from '../AuthModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState(0); // 0: Login, 1: Register
  const navigate = useNavigate();

  const handleOpenModal = (tab) => {
    setDefaultTab(tab);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div className="header">
          <span>Hotline:
               <FontAwesomeIcon icon={faPhone} id="phone-icon"/>
               <strong>1900 3366</strong>
          </span>
        <div className="auth-buttons">
          <a class="text-header" href="#" onClick={() => handleOpenModal(0)}>Đăng nhập</a>/
          <a class="text-header" href="#" onClick={() => handleOpenModal(1)}> Đăng ký</a>
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