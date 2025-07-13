import { Modal, Descriptions, Button, message } from 'antd';
import { useState } from 'react';
import Cookies from 'js-cookie';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { authApi } from '../../services/api';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

function ConfirmAppointmentModal({ open, onClose, doctor, user, selectedDate, selectedTime, service, symptom }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const userId = Cookies.get('userId');
      const token = Cookies.get('token');
      if (!userId || !token) {
        toast.error('Vui lòng đăng nhập lại!');
        navigate('/appointment', {
              state: { serviceId: 2 }
        });
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
        meetLink: "",
        symptoms: symptom
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
          toast.error("Không lấy được link thanh toán!");
          navigate('/appointment', {
                state: { serviceId: 2 }
          });
        }
      } else {
        toast.error("Đặt lịch không thành công!");
        navigate('/appointment', {
              state: { serviceId: 2 }
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi đặt lịch!");
      navigate('/appointment', {
            state: { serviceId: 2 }
      });
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
        <Descriptions.Item label="Số điện thoại">{user?.phoneNumber}</Descriptions.Item>
        <Descriptions.Item label="Ngày tư vấn">{dayjs(selectedDate).format('DD/MM/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Giờ tư vấn">{selectedTime}</Descriptions.Item>
        <Descriptions.Item label="Triệu chứng">{symptom}</Descriptions.Item>
        <Descriptions.Item label="Bác sĩ">{doctor?.fullName}</Descriptions.Item>
        <Descriptions.Item label="Chuyên khoa">{doctor?.specialties?.length ? doctor.specialties.map(s => s.name).join(', ') : 'Chưa cập nhật'}</Descriptions.Item>
        <Descriptions.Item label="Hình thức">Tư vấn trực tuyến</Descriptions.Item>
        <Descriptions.Item label="Giá dịch vụ">{service ? new Intl.NumberFormat('vi-VN').format(service.price) + ' đ' : 'XXX.000 đ'}</Descriptions.Item>
        <Descriptions.Item label="VAT(5%)">{service ? new Intl.NumberFormat('vi-VN').format(service.price * 0.05) + ' đ' : 'XXX.000 đ'}</Descriptions.Item>
        <Descriptions.Item label="Tổng cộng">{service ? new Intl.NumberFormat('vi-VN').format(service.price * 1.05) + ' đ' : 'XXX.000 đ'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
}

export default ConfirmAppointmentModal;
