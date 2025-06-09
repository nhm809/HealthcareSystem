import { useState } from 'react';
import AuthModal from './AuthModal/AuthModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Avatar, Space, Dropdown } from 'antd';
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
    Cookies.remove('refreshToken');
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const handleViewProfile = () => {
    navigate('/profile');
  };

  const items = [
    {
      key: '1',
      label: 'Xem Profile',
      icon: <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px' }} />,
      onClick: handleViewProfile
    },
    {
      key: '2',
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
                menu={{ items }}
                placement="bottomRight"
                trigger={['click']}
              >
                <Avatar size="large" icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
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
        <span className="logo" onClick={() => navigate('/')}>hello</span>

        <div className="menu">
          <div className="service-dropdown">
            <button className="service-dropdown-button">
              Dịch vụ
              <FontAwesomeIcon icon={faAngleDown} id="service-icon" />
            </button>

            <div className="service-dropdown-content">
              <button className="stis-button" onClick={(() => navigate('/test-sti'))}>Xét Nghiệm STIs</button>
              <button onClick={() => navigate('/appointment')}>Tư vấn Trực Tuyến</button>
            </div>
          </div>

          <button>Hỏi đáp bác sĩ</button>
          <button>Theo dõi chu kỳ sinh sản</button>
          <button onClick={() => navigate('/blog')}>Blog</button>
        </div>
      </div>
    </>
  );
}

export default Header;