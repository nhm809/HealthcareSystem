import { Modal, Descriptions, Button, message } from 'antd';
import { authApi } from '../../services/api';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function ConfirmTestModal({ open, onClose, formData, userId }) {
    const [loading, setLoading] = useState(false);
    const [serviceInfo, setServiceInfo] = useState(null);
    const [serviceLoading, setServiceLoading] = useState(false);

    // Lấy thông tin dịch vụ khi component mount
    useEffect(() => {
        const fetchServiceInfo = async () => {
            if (open && !formData?.isFromHistory) {
                setServiceLoading(true);
                try {
                    const response = await authApi.getServiceById(1); // Service ID 1 cho STI test
                    setServiceInfo(response.data);
                } catch (error) {
                    console.error('Error fetching service info:', error);
                    message.error('Không thể tải thông tin dịch vụ');
                } finally {
                    setServiceLoading(false);
                }
            }
        };

        fetchServiceInfo();
    }, [open, formData?.isFromHistory]);

    // Tính toán giá tiền với VAT
    const calculatePriceWithVAT = () => {
        if (!serviceInfo) return { originalPrice: 0, vat: 0, total: 0 };
        
        const originalPrice = serviceInfo.price || 0;
        const vat = Math.round(originalPrice * 0.05); // VAT 5%
        const total = originalPrice + vat;
        
        return { originalPrice, vat, total };
    };

    // Hàm lấy tên ca làm việc từ shiftId
    const getShiftName = (shiftId) => {
        switch (shiftId) {
            case 1:
                return 'Ca 1 (8h - 12h)';
            case 2:
                return 'Ca 2 (13h - 17h)';
            default:
                return 'Không xác định';
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        try {
            // Kiểm tra token
            const token = Cookies.get('token');
            if (!token) {
                message.error('Vui lòng đăng nhập lại!');
                setLoading(false);
                return;
            }

            // Nếu thanh toán từ lịch sử xét nghiệm
            if (formData?.isFromHistory && formData?.existingTestRecord) {
                const testServiceRecordId = formData.existingTestRecord.testRecordId;
                console.log('Payment from history - Test Record ID:', testServiceRecordId);
                
                const payRes = await authApi.createPaypalUrl(testServiceRecordId, null);
                console.log('PayPal response:', payRes.data);  
                const paymentUrl = payRes.data.PaymentUrl || payRes.data.paymentUrl;
                if (paymentUrl) {
                    window.location.href = paymentUrl;
                    return;
                } else {
                    message.error('Không lấy được link thanh toán PayPal!');
                }
                return;
            }

            // Kiểm tra và xử lý ngày tháng
            if (!formData.dob || !formData.testDate) {
                message.error('Vui lòng chọn đầy đủ ngày tháng!');
                setLoading(false);
                return;
            }

            // Validate dữ liệu
            if (!formData.fullName || !formData.gender || !formData.phone || !formData.shift) {
                message.error('Vui lòng điền đầy đủ thông tin!');
                setLoading(false);
                return;
            }

            const data = {
                serviceId: 1,
                fullName: formData.fullName,
                dob: formData.dob.format('YYYY-MM-DD'),
                gender: formData.gender,
                phoneNumber: formData.phone,
                testDate: formData.testDate.format('YYYY-MM-DD'),
                userId: parseInt(userId),
                shift: parseInt(formData.shift)
            };

            // Log dữ liệu gửi đi
            console.log('Form data:', formData);
            console.log('Sending data:', data);
            console.log('User ID:', userId);
            console.log('Token:', token ? 'Present' : 'Missing');

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
            console.error('Error details:', error.response?.data || error);
            if (error.response?.data?.message) {
                message.error(error.response.data.message);
            } else {
                message.error('Đã xảy ra lỗi khi đặt lịch. Vui lòng thử lại sau!');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={formData?.isFromHistory ? "Xác nhận thanh toán" : "Xác nhận thông tin đăng ký"}
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
                    {formData?.isFromHistory ? "Xác nhận và thanh toán" : "Xác nhận và thanh toán"}
                </Button>
            ]}
            width={600}
        >
            {formData?.isFromHistory ? (
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Dịch vụ">{formData?.existingTestRecord?.serviceName}</Descriptions.Item>
                    <Descriptions.Item label="Số tiền">{formData?.existingTestRecord?.amount?.toLocaleString()}đ</Descriptions.Item>
                    <Descriptions.Item label="Mã phiếu">{formData?.existingTestRecord?.testRecordId}</Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <span style={{ color: '#faad14', fontWeight: 'bold' }}>Chờ thanh toán</span>
                    </Descriptions.Item>
                </Descriptions>
            ) : (
                <Descriptions bordered column={1}>
                    <Descriptions.Item label="Họ và tên">{formData?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh">{formData?.dob?.format('DD/MM/YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Giới tính">{formData?.gender}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{formData?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Ngày lấy mẫu">{formData?.testDate?.format('DD/MM/YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Ca làm việc">{formData?.shift ? getShiftName(formData.shift) : 'Chưa chọn'}</Descriptions.Item>
                    <Descriptions.Item label="Dịch vụ">{serviceInfo?.name || 'Gói xét nghiệm STIs'}</Descriptions.Item>
                    {serviceLoading ? (
                        <Descriptions.Item label="Giá tiền">Đang tải...</Descriptions.Item>
                    ) : (
                        <>
                            <Descriptions.Item label="Giá gốc">{calculatePriceWithVAT().originalPrice?.toLocaleString()}đ</Descriptions.Item>
                            <Descriptions.Item label="VAT (5%)">{calculatePriceWithVAT().vat?.toLocaleString()}đ</Descriptions.Item>
                            <Descriptions.Item label="Tổng cộng">
                                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                                    {calculatePriceWithVAT().total?.toLocaleString()}đ
                                </span>
                            </Descriptions.Item>
                        </>
                    )}
                </Descriptions>
            )}
        </Modal>
    );
}

export default ConfirmTestModal; 