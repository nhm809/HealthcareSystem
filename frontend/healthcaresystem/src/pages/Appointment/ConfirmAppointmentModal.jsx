import { Modal, Descriptions, Button, message } from 'antd';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { authApi } from '../../services/api';
import dayjs from 'dayjs';

function ConfirmAppointmentModal({ open, onClose, doctor, user, selectedDate, selectedTime }) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const userId = Cookies.get('userId');
      const token = Cookies.get('token');
      if (!userId || !token) {
        message.error('Vui lòng đăng nhập lại!');
        return;
      }

      // Tạo ngày giờ bắt đầu và kết thúc
      const start = dayjs(`${selectedDate} ${selectedTime}`, 'YYYY-MM-DD HH:mm');
      const end = start.add(30, 'minute');

      const payload = {
        memberId: parseInt(userId),
        serviceId: 2, // giả định mã dịch vụ tư vấn online là 2
        consultantId: doctor.consultantId,
        startTime: start.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: end.format('YYYY-MM-DDTHH:mm:ss'),
        meetLink: ""
      };

      const res = await api.post('/Appointment/create', payload);

      if (res.data.success) {
        const appointmentId = res.data.data;

        // Gọi API tạo link thanh toán (nếu có)
        const paymentRes = await authApi.createPaypalUrl(null, appointmentId);

        const paymentUrl = paymentRes.data.paymentUrl || paymentRes.data.PaymentUrl;
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          message.error("Không lấy được link thanh toán!");
        }
      } else {
        message.error("Đặt lịch không thành công!");
      }
    } catch (error) {
      console.error(error);
      message.error("Có lỗi xảy ra khi đặt lịch!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Xác nhận thông tin đặt tư vấn"
      open={open}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>Quay lại</Button>,
        <Button
          key="confirm"
          type="primary"
          loading={loading}
          onClick={handleConfirm}
        >
          Xác nhận và thanh toán
        </Button>
      ]}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Họ và tên">{user?.fullName}</Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{dayjs(user?.doB).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Giới tính">{user?.gender}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{user?.phoneNumber}</Descriptions.Item>
        <Descriptions.Item label="Ngày tư vấn">{dayjs(selectedDate).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Giờ tư vấn">{selectedTime}</Descriptions.Item>
        <Descriptions.Item label="Bác sĩ">{doctor?.fullName}</Descriptions.Item>
        <Descriptions.Item label="Chuyên khoa">{doctor?.specialties?.map(s => s.name).join(', ')}</Descriptions.Item>
        <Descriptions.Item label="Hình thức">Tư vấn trực tuyến</Descriptions.Item>
        <Descriptions.Item label="Giá">150,000đ</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default ConfirmAppointmentModal;
