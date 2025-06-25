import React, { useState, useEffect } from 'react';
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
import api from '../../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

function DoctorDetail() {
    const [selectedTime, setSelectedTime] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);

    const today = dayjs();
    const [selectedDate, setSelectedDate] = useState(today.format('YYYY-MM-DD'));

    const dateOptions = Array.from({ length: 7 }, (_, i) => {
        const date = today.add(i, 'day');
        return {
            value: date.format('YYYY-MM-DD'),
            label: `Ngày ${date.format('DD/MM/YYYY')}`
        };
    });

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await api.get(`consultants/${id}`);
                setDoctor(response.data);
            } catch (error) {
                console.error("Lỗi tải thông tin bác sĩ:", error);
            }
        };
        fetchDoctor();
    }, [id]);

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
                            <h3>{doctor?.fullName}</h3>
                            <div className="specialty-tags">
                                {doctor?.specialties?.map((spec) => (
                                <span className="specialty-tag">{spec.name}</span>
                                ))}
                            </div>
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
                            <Select
                            value={selectedDate}
                            onChange={value => setSelectedDate(value)}
                            className="date-select"
                            >
                            {dateOptions.map((date) => (
                                <Option key={date.value} value={date.value}>
                                {date.label}
                                </Option>
                            ))}
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
                                    <strong>Tư vấn trực tuyến với {doctor?.fullName}</strong> 150.000 đ
                                </p>
                                <Button
                                    type="primary"
                                    className="confirm-button"
                                    onClick={() => navigate('/booking-confirmation', {
                                        state: {
                                        doctor: doctor,
                                        selectedDate,
                                        selectedTime,
                                        }
                                    })}
                                >
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
