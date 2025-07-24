import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faYoutube, faTiktok } from '@fortawesome/free-brands-svg-icons';
import logo from '../../assets/imgs/logo.png';

function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-container">
        <div className="footer-col footer-info">
          <div className="footer-logo-row">
            <div className="footer-logo">
              <img src={logo} alt="MedSex Logo" className="footer-logo-img" />
            </div>
            <span className="footer-title">MedSex</span>
          </div>
          <div className="footer-contact">
            <div><FontAwesomeIcon icon={faMapMarkerAlt} className="footer-icon" />  Q.9, TP.HCM</div>
            <div><FontAwesomeIcon icon={faPhone} className="footer-icon" /> 1900 3366</div>
            <div><FontAwesomeIcon icon={faEnvelope} className="footer-icon" /> shevchenmex@gmail.com</div>
          </div>
        </div>
        <div className="footer-col footer-links">
          <div>Điều khoản sử dụng</div>
          <div>Chính sách bảo mật</div>
          <div>Quy chế hoạt động</div>
        </div>
        <div className="footer-col footer-social">
          <a href="#" className="footer-social-icon"><FontAwesomeIcon icon={faFacebookF} /></a>
          <a href="#" className="footer-social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
          <a href="#" className="footer-social-icon"><FontAwesomeIcon icon={faYoutube} /></a>
          <a href="#" className="footer-social-icon"><FontAwesomeIcon icon={faTiktok} /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;