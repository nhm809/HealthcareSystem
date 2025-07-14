import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';   
import { Card, Select, Button, Empty } from 'antd';
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
import defaultdoctoravatar from '../../assets/imgs/defaultdoctoravatar.png';
import api from '../../services/api';
import dayjs from 'dayjs';

const { Option } = Select;

function DoctorDetail() {
    const [selectedTime, setSelectedTime] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [service, setService] = useState(null);
    const { state } = useLocation();
    const serviceId = state?.serviceId;
    const [consultationCount, setConsultationCount] = useState(0);

    const today = dayjs();
    const [selectedDate, setSelectedDate] = useState(state?.selectedDate || today.format('YYYY-MM-DD'));

    const dateOptions = Array.from({ length: 7 }, (_, i) => {
        const date = today.add(i, 'day');
        return {
            value: date.format('YYYY-MM-DD'),
            label: `Ngày ${date.format('DD/MM/YYYY')}`
        };
    });

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await api.get(`consultants/${id}/available-slots`, {
                    params: { date: selectedDate }
                });

                let slots = response.data.data || [];

                const now = dayjs();
                const todayStr = now.format('YYYY-MM-DD');

                if (selectedDate === todayStr) {
                    slots = slots.filter((timeStr) => {
                        const slotTime = dayjs(`${selectedDate}T${timeStr}`);
                        return slotTime.isAfter(now.add(2, 'hour'));
                    });
                }
                setAvailableSlots(slots);
            } catch (error) {
                console.error("Lỗi tải khung giờ trống:", error);
                setAvailableSlots([]);
            }
        };

        if (selectedDate && id) {
            fetchAvailableSlots();
        }
    }, [selectedDate, id]);

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

        const fetchConsultationCount = async () => {
            try {
                const res = await api.get(`/Appointment/consultant/${id}`);
                const appointments = res.data?.data || [];

                const completedAppointments = appointments.filter(app =>
                    app.status?.toLowerCase() === "da hoan thanh" || app.status?.toLowerCase() === "da danh gia"
                );

                setConsultationCount(completedAppointments.length);
            } catch (error) {
                console.error("Lỗi khi lấy lượt tư vấn:", error);
                setConsultationCount(0);
            }
        };

        if (id) fetchConsultationCount();
    }, [id]);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await api.get(`/Service/${serviceId}`);
                setService(response.data);
            } catch (error) {
                console.error("Lỗi tải thông tin dịch vụ:", error);
            }
        };
        fetchService();
    }, []);

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const renderTimeSlots = () => {
        if (availableSlots.length === 0) {
            // Nếu là hôm nay và không còn slot => hiển thị thông báo
            if (selectedDate === dayjs().format('YYYY-MM-DD')) {
                return (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            style={{ marginBlock: '0'}}
                            description={
                                <span style={{ fontSize: 16, color: '#888' }}>
                                    Không còn khung giờ phù hợp hôm nay, vui lòng chọn ngày khác.
                                </span>
                            }
                        />
                    </div>
                );
            }
            // Các ngày khác nhưng rỗng (ví dụ backend không có) => hiển thị chung
            return (
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            style={{ marginBlock: '0'}}
                            description={
                                <span style={{ fontSize: 16, color: '#888' }}>
                                    Không có khung giờ trống cho ngày này.
                                </span>
                            }
                        />
                    </div>
                );
        }

        return availableSlots.map((time) => (
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
                <div className="doctor-info">
                    <img
                        src={doctor?.avatar?.trim() ? doctor.avatar : defaultdoctoravatar}
                        alt="doctor"
                        className="doctor-image"
                    />
                    <div className="doctor-details">
                        <h3>{doctor?.fullName}</h3>
                        <div className="specialty-tags">
                            {doctor?.specialties?.length > 0 ? (
                                doctor.specialties.map((spec, index) => (
                                <span key={spec.id || index} className="specialty-tag">{spec.name}</span>
                                ))
                            ) : (
                                <span className="specialty-tag empty">Chưa cập nhật</span>
                            )}
                        </div>
                        <div className="doctor-stats">
                            <p><FontAwesomeIcon icon={faUserFriends} /> Lượt tư vấn: <strong>{consultationCount}</strong></p>
                        </div>
                    </div>
                </div>

                <div className="schedule-card">
                    <div className="location-info">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="location-icon" />
                        <div>
                            <p className="location-name">Q.9, TP Ho Chi Minh</p>
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
                                    <strong>Tư vấn trực tuyến với {doctor?.fullName}</strong>{' '}
                                    {service ? new Intl.NumberFormat('vi-VN').format(service.price) + ' đ' : '1XX.000 đ'}
                                </p>
                                <Button
                                    type="primary"
                                    className="confirm-button"
                                    onClick={() => navigate('/booking-confirmation', {
                                        state: {
                                        doctor: doctor,
                                        selectedDate,
                                        selectedTime,
                                        service: service,
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
                        <p>
                            BS. {doctor?.fullName} 
                              {doctor?.specialties?.length ? ` - ${doctor.specialties.map(s => s.name).join(', ')}` : ' - Chưa cập nhật'}
                        </p>

                    </div>
                </div>


            </div>
        </MainLayout>
    );
};

export default DoctorDetail;
