import React from 'react';
import { Button, Input } from 'antd';
import './BookingConfirmation.css';
import MainLayout from '../../components/Layout/Layout';

function BookingConfirmation() {
  return (
    <MainLayout>
        <div className="booking-confirmation-container">
            <h2 className="section-title">Thông tin đặt tư vấn</h2>

            {/* Thông tin người đặt */}
            <div className="info-card">
                <div className="user-info">
                <img
                    src="https://via.placeholder.com/40"
                    alt="avatar"
                    className="avatar"
                />
                <span className="user-name">Tên Member</span>
                <Button size="small" className="update-button">Cập nhật thông tin</Button>
                </div>
            </div>

            {/* Giờ hẹn + bác sĩ */}
            <div className="info-card">
                <div className="appointment-info">
                <div className="time-box">
                    <span className="time-value">14:45</span>
                    <span className="date-value">25/05/2025</span>
                </div>

                <div className="doctor-info">
                    <img
                    src="https://via.placeholder.com/64"
                    alt="doctor"
                    className="doctor-avatar"
                    />
                    <div className="doctor-details">
                    <p className="service-title">
                        Tư vấn trực tuyến với <strong>BS. Nguyễn Văn Minh</strong>
                    </p>
                    <p className="clinic-name">Tên cơ sở y tế</p>
                    <p>Chuyên khoa: Sản phụ khoa</p>
                    <p>BS. Nguyễn Văn Minh</p>
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