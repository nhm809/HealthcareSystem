import React, {useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';   
import { Card, Select, Button } from 'antd';
import './ConsultantDetail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleCheck,
    faUserFriends,
    faStar,
    faMapMarkerAlt,
    faVideo
} from '@fortawesome/free-solid-svg-icons'
import MainLayout from "../../components/Layout/Layout";

const { Option } = Select;

function DoctorDetail() {
    const [selectedTime, setSelectedTime] = useState(null);
    const navigate = useNavigate();

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const renderTimeSlots = () => {
        const times = [
            "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00",
            "15:15", "15:30", "15:45", "16:00", "16:15", "16:30", "16:45",
            "17:00", "17:15"
        ];

        return times.map((time) => (
            <Button
                key={time}
                className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => handleTimeSelect(time)}
            >
                {time}
            </Button>
        ));
    };

    return (
        <MainLayout>
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
                            <p><FontAwesomeIcon icon={faUserFriends} /> Lượt tư vấn: <strong>47</strong></p>
                            <p><FontAwesomeIcon icon={faStar} /> Đánh giá: <strong>5</strong> (<em>17 đánh giá</em>)</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="schedule-card">
                    <div className="location-info">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                        <div>
                            <p className="location-name">Tên cơ sở y tế</p>
                            <p className="location-address">Địa chỉ</p>
                        </div>
                    </div>

                    <div className="date-select-container">
                        <div className="date-select-row">
                            <span className="schedule-label">Lịch tư vấn trực tuyến</span>
                            <Select defaultValue="2025-06-09" className="date-select">
                                <Option value="2025-06-09">Ngày 09/06/2025</Option>
                                <Option value="2025-06-10">Ngày 10/06/2025</Option>
                            </Select>
                        </div>

                        <div className="time-slots">
                            {renderTimeSlots()}
                        </div>

                        {selectedTime && (
                            <div className="confirm-box">
                                <p className="booking-summary">
                                    <span>
                                        <FontAwesomeIcon icon={faCircleCheck} />
                                    </span>
                                    <strong>Tư vấn trực tuyến với BS. Nguyễn Văn Minh</strong> 150.000 đ
                                </p>
                                <Button type="primary" className="confirm-button" onClick={() => navigate('/booking-confirmation')}>
                                    <span><FontAwesomeIcon icon={faVideo} size='xl' /> </span>
                                    <span className="button-text"><strong>Tư vấn</strong> trực tuyến</span>
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="experience-card">
                        <h4>KINH NGHIỆM KHÁM CHỮA BỆNH</h4>
                        <p>BS. Nguyễn Văn Minh - Sản phụ khoa</p>
                    </div>
                </div>


            </div>
        </MainLayout>
    );
};

export default DoctorDetail;
