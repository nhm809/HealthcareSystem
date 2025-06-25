import React, { useEffect, useState } from 'react';
import { Button, Input, Spin } from 'antd';
import './BookingConfirmation.css';
import MainLayout from '../../components/Layout/Layout';
import Cookies from 'js-cookie';
import { getInfo } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContext } from '../../contexts/ToastProvider';
import { toast } from 'react-toastify';

function BookingConfirmation() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const { doctor, selectedDate, selectedTime } = location.state || {};
    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                if (!userId) {
                    setUser([]);
                    return;
                }

                const response = await getInfo(userId);
                setUser(response.data);
            } catch (err) {
                console.error('Error fetching user info:', err);
                toast.error('Không thể lấy thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, [userId]);

    const isInfoIncomplete = (user) => {
        const requiredFiealds = ['fullName', 'phoneNumber', 'doB', 'gender'];
        return requiredFiealds.some(field => !user?.[field] || user[field].trim() === '');
    }

    const renderUserInfoBox = () => {
        if (!userId) {
            return (
                <div className="user-info not-logged-in">
                    <p>Bạn cần đăng nhập để tiếp tục đặt lịch.</p>
                    <Button type="primary" onClick={() => navigate('/')}>Đăng nhập</Button>
                </div>
            );
        }
        if (isInfoIncomplete(user)) {
            return (
                <div className="user-info incomplete-info">
                    <p>Vui lòng bổ sung đầy đủ thông tin cá nhân.</p>
                    <Button>Cập nhật thông tin</Button>
                </div>
            );
        }

        return (
            <div className="user-info completed-info">
                <img src={user.avatar || ''} alt="avatar" className="avatar" />
                <span className="user-name">{user.fullName}</span>
                <Button>Cập nhập thông tin</Button>
            </div>
        );
    };

    return (
        <MainLayout>
            <div className="booking-confirmation-container">
                <h2 className="section-title">Thông tin đặt tư vấn</h2>

                {/* Thông tin người tới khám */}
                <div className="info-card">
                    {renderUserInfoBox()}
                </div>

                {/* Giờ hẹn + bác sĩ */}
                <div className="info-card">
                    <div className="appointment-info">
                    <div className="time-box">
                        <span className="time-value">{selectedTime}</span>
                        <span className="date-value">{selectedDate}</span>
                    </div>

                    <div className="doctor-info">
                        <img
                        src="https://via.placeholder.com/64"
                        alt="doctor"
                        className="doctor-avatar"
                        />
                        <div className="doctor-details">
                        <p className="service-title">
                            Tư vấn trực tuyến với <strong>{doctor?.fullName}</strong>
                        </p>
                        <p className="clinic-name">Tên cơ sở y tế</p>
                        <p>Chuyên khoa: {doctor?.specialties?.map(s => s.name).join(', ')}</p>
                        <p>{doctor?.fullName}</p>
                        </div>
                        <div className="price">150.000đ</div>
                    </div>
                    </div>
                </div>

                {/* Triệu chứng */}
                <div className="info-card">
                    <label className="symptom-label">Triệu chứng *</label>
                    <Input.TextArea
                    rows={4}
                    placeholder="Mô tả triệu chứng ..."
                    className="symptom-textarea"
                    />
                </div>

                {/* Nút đặt tư vấn */}
                <div className="button-container">
                    <Button type="primary" className="confirm-button">ĐẶT TƯ VẤN</Button>
                </div>
            </div>
        </MainLayout>
  );
}

export default BookingConfirmation;