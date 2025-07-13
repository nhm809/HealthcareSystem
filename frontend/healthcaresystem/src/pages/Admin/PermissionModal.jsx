import React, { useState, useEffect } from 'react';
import { Modal, Select, Typography, Row, Col, Space } from 'antd';
import { toast } from 'react-toastify';

const { Text } = Typography;
const { Option } = Select;

    const roleMap = {
        MB: 'Thành viên',
        CS: 'Tư vấn viên',
        ST: 'Nhân viên xét nghiệm',
        AD: 'Quản trị viên',
        MG: 'Quản lý',
    };

const PermissionModal = ({ open, onClose, user, onSubmit }) => {
    const [newRole, setNewRole] = useState(user?.roleId);

    useEffect(() => {
        setNewRole(user?.roleId);
    }, [user]);

    const handleOk = () => {
        if (user && newRole !== user.roleId) {
            onSubmit(user.userId, newRole);
        } else {
            toast.warning("Vai trò bạn chọn giống với vai trò ban đầu");
        }
        onClose();
    };

    return (
        <Modal
            title="Phân quyền người dùng"
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            okText="Lưu"
            cancelText="Hủy"
            bodyStyle={{ paddingTop: 12, paddingBottom: 12 }}
            destroyOnHidden
            footer={(
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
                    <button onClick={onClose} className="ant-btn" style={{ 
                        background: 'none',
                        border: '1px solid #d9d9d9',
                        borderRadius: 4,
                        padding: '6px 22px',
                        fontWeight: 500,
                        cursor: 'pointer',
                    }}>Hủy</button>
                    <button onClick={handleOk} className="ant-btn ant-btn-primary" style={{ 
                        backgroundColor: '#43AA8B',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        padding: '6px 24px',
                        fontWeight: 500,
                        cursor: 'pointer'
                    }}>Lưu</button>
                </div>
            )}
        >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <div>
                    <Text strong>Họ tên:</Text> <Text>{user?.fullName}</Text>
                </div>
                <div>
                    <Text strong>Email:</Text> <Text>{user?.email}</Text>
                </div>

                {/* Vai trò hiện tại và mới */}
                <div>
                    <Row gutter={16}  align="middle">
                        <Col span={13}>
                            <Text strong>Vai trò hiện tại:</Text>
                        </Col>
                        <Col span={11}>
                            <Text strong>Vai trò mới:</Text>
                        </Col>
                    </Row>
                    <Row gutter={16} align="middle" style={{ marginTop: 8 }}>
                        <Col span={11}>
                            <Select
                                value={user?.roleId}
                                style={{ width: '100%' }}
                                disabled
                            >
                                <Option value={user?.roleId}>
                                    {roleMap[user?.roleId]}
                                </Option>
                            </Select>
                        </Col>

                        <Col span={2} style={{ textAlign: 'center' }}>
                            <Text strong>→</Text>
                        </Col>

                        <Col span={11}>
                            <Select
                                value={newRole}
                                style={{ width: '100%' }}
                                onChange={setNewRole}
                                disabled={user?.roleId === 'AD'}
                            >
                                {Object.entries(roleMap).map(([key, label]) => (
                                    <Option key={key} value={key} disabled={key === 'AD'}>
                                        {label}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                    </Row>
                </div>
            </Space>
        </Modal>
    );
};

export default PermissionModal;