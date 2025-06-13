import { Modal, Descriptions, Button, message } from 'antd';
import { authApi } from '../../services/api';
import { useState } from 'react';

function ConfirmTestModal({ open, onClose, formData, userId }) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            const data = {
                serviceId: 0,
                fullName: formData.fullName,
                dob: formData.dob.format('YYYY-MM-DD'),
                gender: formData.gender,
                phoneNumber: formData.phone,
                userId: userId
            };

            const response = await authApi.bookTestServiceRecord(data);
            console.log('Book response:', response.data);
            
            if (response.data.message === "Thông tin đặt lịch đã được lưu. Vui lòng tiến hành thanh toán.") {
                const testServiceRecordId = response.data.testServiceRecordId || response.data.testServiceRecordID;
                console.log('ID:', testServiceRecordId);
                if (testServiceRecordId) {
                    const payRes = await authApi.createPaypalUrl(testServiceRecordId, null);
                    console.log('PayPal response:', payRes.data);
                    const paymentUrl = payRes.data.PaymentUrl || payRes.data.paymentUrl;
                    if (paymentUrl) {
                        window.location.href = paymentUrl;
                        return;
                    } else {
                        message.error('Không lấy được link thanh toán PayPal!');
                    }
                } else {
                    message.error('Không lấy được mã phiếu xét nghiệm!');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Đăng ký thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Xác nhận thông tin đăng ký"
            open={open}
            onCancel={onClose}
            footer={[
                <Button key="back" onClick={onClose}>
                    Quay lại
                </Button>,
                <Button 
                    key="submit" 
                    type="primary" 
                    onClick={handleConfirm}
                    loading={loading}
                >
                    Xác nhận và thanh toán
                </Button>
            ]}
            width={600}
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Họ và tên">{formData?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{formData?.dob?.format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Giới tính">{formData?.gender}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{formData?.phone}</Descriptions.Item>
                <Descriptions.Item label="Dịch vụ">Gói xét nghiệm STIs</Descriptions.Item>
                <Descriptions.Item label="Giá tiền">450,000đ</Descriptions.Item>
            </Descriptions>
        </Modal>
    );
}

export default ConfirmTestModal; 