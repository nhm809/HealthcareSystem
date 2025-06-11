import React from 'react';
import { useParams } from 'react-router-dom';   
import { Card, Select, Button } from 'antd';
import './DoctorDetailPage.css';

const { Option } = Select;

function DoctorDetail() {
    return (
        <div className="doctor-detail-container">
            <div className="doctor-info-card">
                <div className="doctor-info">
                    <img
                        src="https://via.placeholder.com/120x160"
                        alt="doctor"
                        className="doctor-image"
                    />
                    <div className="doctor-details">
                        <h3>BS. Nguyễn Văn Minh</h3>
                        <span className="specialty-tag">Sản phụ khoa</span>
                        <div className="doctor-stats">
                        <p><i className="fas fa-user-friends"></i> Lượt tư vấn: <strong>47</strong></p>
                        <p><i className="fas fa-star"></i> Đánh giá: <strong>5</strong> (<em>17 đánh giá</em>)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="schedule-card">
                <div className="location-info">
                    <i className="fas fa-map-marker-alt location-icon"></i>
                    <div>
                        <p className="location-name">Tên cơ sở y tế</p>
                        <p className="location-address">Địa chỉ</p>
                    </div>
                </div>

                <div className="date-select-row">
                    <span className="schedule-label">Lịch tư vấn trực tuyến</span>
                    <Select defaultValue="2025-06-09" className="date-select">
                        <Option value="2025-06-09">Ngày 09/06/2025</Option>
                        <Option value="2025-06-10">Ngày 10/06/2025</Option>
                    </Select>
                </div>

                <div className="time-slots">
                    {Array.from({ length: 18 }).map((_, i) => (
                        <Button key={i} className="time-slot">14:45</Button>
                    ))}
                </div>
            </div>

            <div className="experience-card">
                <h4>KINH NGHIỆM KHÁM CHỮA BỆNH</h4>
                <p>BS. Nguyễn Văn Minh - Sản phụ khoa</p>
            </div>
        </div>
    );
};

export default DoctorDetail;
