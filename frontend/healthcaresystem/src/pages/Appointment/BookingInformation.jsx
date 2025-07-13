import React, { useEffect, useState, useRef } from 'react';
import { Button, Input, Spin, Modal, Form, DatePicker, Radio } from 'antd';
import './BookingInformation.css';
import ConfirmAppointmentModal from './ConfirmAppointmentModal';
import MainLayout from '../../components/Layout/Layout';
import Cookies from 'js-cookie';
import { getInfo, authApi, notiApi } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import defaultavatar from '../../assets/imgs/defaultavatar.png';
import defaultdoctoravatar from '../../assets/imgs/defaultdoctoravatar.png';
import AuthModal from '../../components/Header/AuthModal/AuthModal';

function BookingConfirmation() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [defaultTab, setDefaultTab] = useState(0);
    const [symptom, setSymptom] = useState('');
    const [form] = Form.useForm();

    // const notiSentRef = useRef({});
    const navigate = useNavigate();
    const location = useLocation();
    const { doctor, selectedDate, selectedTime, service } = location.state || {};
    const userId = Cookies.get('userId');

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                if (!userId) {
                    setUser(null);
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

    const handleBookingClick = () => {
        if (!userId) {
            // Chưa đăng nhập
            setShowAuthModal(true);
            setDefaultTab(0);
            return;
        }

        if (isInfoIncomplete(user)) {
            // Thiếu thông tin cá nhân
            setShowUpdateInfoModal(true);
            return;
        }

        if (!symptom.trim()) {
            // Chưa nhập triệu chứng
            toast.error('Vui lòng mô tả triệu chứng!');
            return;
        }

        // Đủ điều kiện
        setShowConfirmModal(true);
    };

    const handleOpenAuthModal = () => {
        setShowAuthModal(true);
        setDefaultTab(0);
    }

    const handleOpenModal = () => {
        form.setFieldsValue({
            fullName: user?.fullName || '',
            doB: user?.doB ? dayjs(user.doB) : null,
            gender: user?.gender || '',
            phoneNumber: user?.phoneNumber || '',
            address: user?.address || ''
        });
        setShowModal(true);
    };

    const handleUpdateInfo = async (values) => {
        try {
            const payload = {
                ...user,
                fullName: values.fullName,
                phoneNumber: values.phoneNumber,
                gender: values.gender,
                doB: values.doB.format('YYYY-MM-DD'),
                address: values.address,
                avatar: user?.avatar || '',
                password: user?.password || '',
            };

            const response = await authApi.updateUserInfo(userId, payload);
            if (response.data === true) {
                toast.success('Cập nhật thành công!');
                setShowModal(false);
                // reload lại user
                const res = await getInfo(userId);
                setUser(res.data);
            } else {
                toast.error('Cập nhật thất bại');
            }
        } catch (err) {
            toast.error('Lỗi khi cập nhật thông tin');
            console.error(err);
        }
    };

    const renderUserInfoBox = () => {
        if (!userId) {
            return (
                <div className="user-info not-logged-in">
                    <img src={defaultavatar} alt="avatar" className="avatar" />
                    <div className="user-details">
                        <span className="user-label">Người tới khám</span>
                        <div className="user-name-row">
                            <p className="user-warning">Bạn cần đăng nhập để tiếp tục đặt lịch.</p>
                            <Button className="login-button" type="primary" onClick={handleOpenAuthModal}>Đăng nhập</Button>
                        </div>
                    </div>
                </div>
            );
        }
        if (isInfoIncomplete(user)) {
            return (
                <div className="user-info incomplete-info">
                    <img src={defaultavatar} alt="avatar" className="avatar" />
                    <div className="user-details">
                        <span className="user-label">Người tới khám</span>
                        <div className="user-name-row">
                            <p className="user-warning">Vui lòng bổ sung đầy đủ thông tin cá nhân.</p>
                            <Button className="update-button" onClick={handleOpenModal}>Cập nhật thông tin</Button>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="user-info completed-info">
                <img src={defaultavatar} alt="avatar" className="avatar" />
                <div className="user-details">
                    <span className="user-label">Người tới khám</span>
                    <div className="user-name-row">
                        <span className="user-name">{user.fullName}</span>
                        <Button className="update-button" onClick={handleOpenModal}>Cập nhật thông tin</Button>
                    </div>
                </div>
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
                <div className="appointment-info">
                    <div className="time-box">
                        <span className="time-label">Giờ hẹn:</span>
                        <span className="time-value">{selectedTime}</span>
                        <span className="date-value">{selectedDate}</span>
                    </div>

                    <div className="separator" />

                    <div className="doctor-info1">
                    <img
                        src={doctor?.avatar?.trim() ? doctor.avatar : defaultdoctoravatar}
                        alt="doctor"
                        className="doctor-avatar"
                    />
                        <div className="doctor-details1">
                            <p className="service-title">
                                Tư vấn trực tuyến với <strong>{doctor?.fullName}</strong>
                            </p>
                            <p className="clinic-name">Tên cơ sở y tế</p>
                            <p className="doctor-specialties">Chuyên khoa: {doctor?.specialties?.length ? doctor.specialties.map(s => s.name).join(', ') : 'Chưa cập nhật'}</p>
                            <p className="doctor-name">{doctor?.fullName}</p>
                        </div>
                        <div className="price">{service ? new Intl.NumberFormat('vi-VN').format(service.price) + ' đ' : '1XX.000 đ'}</div>
                    </div>
                </div>

               {/* Triệu chứng */}
                <div className="symptom-card">
                    <label className="symptom-label">Triệu chứng *</label>
                    <Input.TextArea
                        rows={4}
                        placeholder="Mô tả triệu chứng ..."
                        className="symptom-textarea"
                        value={symptom}
                        onChange={(e) => setSymptom(e.target.value)}
                    />
                </div>

                {/* Nút đặt tư vấn */}
                <div className="button-container">
                    <Button
                        type="primary"
                        className="confirm-button1"
                        onClick={handleBookingClick}
                    >
                        ĐẶT TƯ VẤN
                    </Button>
                </div>

                <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} defaultTab={defaultTab} />

                <ConfirmAppointmentModal
                    open={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    doctor={doctor}
                    user={user}
                    service={service}
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    symptom={symptom}
                />

                {/* Modal cập nhật thông tin */}
                <Modal
                    title="Cập nhật thông tin"
                    open={showModal}
                    onCancel={() => setShowModal(false)}
                    footer={null}
                >
                    <Form form={form} layout="vertical" onFinish={handleUpdateInfo}>
                        <Form.Item
                            label="Họ và tên"
                            name="fullName"
                            rules={[
                                { required: true, message: 'Vui lòng nhập họ và tên' },
                                { pattern: /^[\p{L}\s]+$/u, message: 'Họ và tên không hợp lệ' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Ngày sinh"
                            name="doB"
                            rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
                        >
                            <DatePicker 
                                format="DD/MM/YYYY" 
                                style={{ width: '100%' }} 
                                disabledDate={(current) => current && current > dayjs().endOf('day')}
                            />
                        </Form.Item>

                        <Form.Item
                            label="Giới tính"
                            name="gender"
                            rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                        >
                            <Radio.Group>
                                <Radio value="Nam">Nam</Radio>
                                <Radio value="Nữ">Nữ</Radio>
                                <Radio value="Khác">Khác</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            label="Số điện thoại"
                            name="phoneNumber"
                            rules={[
                                { required: true, message: 'Vui lòng nhập số điện thoại' },
                                { pattern: /^0\d{9}$/, message: 'Số điện thoại không hợp lệ (VD: 0123456789)' },
                            ]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item label="Địa chỉ" name="address">
                            <Input />
                        </Form.Item>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                            <Button onClick={() => setShowModal(false)}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Cập nhật</Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </MainLayout>
  );
}

export default BookingConfirmation;