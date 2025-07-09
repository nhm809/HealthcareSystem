import React, { useEffect, useState } from 'react';
import { Modal, Select, Input, Descriptions, Tag } from 'antd';
import api, { notiApi } from '../../services/api';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';

const { Option } = Select;

function AppointmentDetailModal({ open, onClose, appointmentId, onUpdateSuccess }) {
    const [detail, setDetail] = useState(null);
    const [status, setStatus] = useState('');
    const [meetLink, setMeetLink] = useState('');
    const now = dayjs();
    // const endTime = dayjs(detail.endTime);

    useEffect(() => {
        if (open && appointmentId) {
            fetchDetail();
        }
    }, [open, appointmentId]);

    const fetchDetail = async () => {
        try {
            const res = await api.get(`/Appointment/detail/${appointmentId}`);
            if (res.data.success) {
                const data = res.data.data;
                setDetail(data);
                setStatus(data.status || '');
                setMeetLink(data.meetLink || '');
            }
        } catch (err) {
            toast.error('Lỗi khi tải chi tiết lịch hẹn');
        }
    };

    const handleUpdate = async () => {
        try {
            if (status !== detail.status) {
                await api.patch(`/Appointment/update-status/${appointmentId}`, `"${status}"`);
            }
            if (meetLink !== detail.meetLink) {
                await api.patch(`/Appointment/update-meetlink/${appointmentId}`, `"${meetLink}"`);
            }
            toast.success('Cập nhật thành công');
            onUpdateSuccess();
            onClose();
        } catch (err) {
            toast.error('Lỗi khi cập nhật');
        }
    };

    const renderStatus = (status) => {
        const map = {
            'dang cho kham': { color: 'processing', text: 'Đang chờ khám' },
            'da hoan thanh': { color: 'success', text: 'Đa hoàn thành' },
            'dang thanh toan': { color: 'warning', text: 'Đang thanh toán' },
            'da huy': { color: 'default', text: 'Đã hủy' },
        };

        const key = (status || '').toLowerCase();
        const config = map[key] || { color: 'default', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
    };

    return (
        <Modal
            open={open}
            onCancel={onClose}
            onOk={handleUpdate}
            width={600}
            okText="Cập nhật"
            cancelText="Hủy"
            title="Chi tiết lịch hẹn"
        >
        {detail ? (
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Khách hàng">{detail.memberName}</Descriptions.Item>
                <Descriptions.Item label="Dịch vụ">{detail.serviceName}</Descriptions.Item>
                <Descriptions.Item label="Ngày tư vấn">{dayjs(detail.startTime).format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Giờ tư vấn">{dayjs(detail.startTime).format('HH:mm')}</Descriptions.Item>
                <Descriptions.Item label="Triệu chứng">{detail.symptoms}</Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    {dayjs().isAfter(dayjs(detail.endTime)) ? (
                        <Select
                            value={status}
                            onChange={(value) => setStatus(value)}
                            style={{ width: '100%' }}
                        >
                            <Option value="Dang cho kham">Đang chờ khám</Option>
                            <Option value="Da hoan thanh">Đã hoàn thành</Option>
                            <Option value="Da huy">Đã hủy</Option>
                        </Select>
                    ) : (
                        renderStatus(status)
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Link Google Meet">
                    {dayjs().isAfter(dayjs(detail.endTime)) ? (
                        <div style={{ color: '#999' }}>{meetLink || 'Chưa có'}</div>
                    ) : (
                        <Input
                            value={meetLink}
                            onChange={(e) => setMeetLink(e.target.value)}
                            placeholder="Nhập link GoogleMeet..."
                        />
                    )}
                </Descriptions.Item>
            </Descriptions>
        ) : (
            <p>Đang tải dữ liệu...</p>
        )}
        </Modal>
    );
};

export default AppointmentDetailModal;
