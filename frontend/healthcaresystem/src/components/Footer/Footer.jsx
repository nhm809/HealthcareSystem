import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram, faYoutube, faTiktok } from '@fortawesome/free-brands-svg-icons';

function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-container">
        <div className="footer-col footer-info">
          <div className="footer-logo-row">
            <div className="footer-logo">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="footer-logo-icon" />
            </div>
            <span className="footer-title">Tên cơ sở y tế</span>
          </div>
          <div className="footer-contact">
            <div><FontAwesomeIcon icon={faMapMarkerAlt} className="footer-icon" /> Số 22 Nguyễn Văn Bình, Q.1, TPHCM</div>
            <div><FontAwesomeIcon icon={faPhone} className="footer-icon" /> 1900 3366</div>
            <div><FontAwesomeIcon icon={faEnvelope} className="footer-icon" /> mrokfalling@letopt.com</div>
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