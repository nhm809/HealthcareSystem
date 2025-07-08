import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Tag, Spin, Avatar, message } from 'antd';
import dayjs from 'dayjs';
import { adminApi } from "../../services/api";

const roleMap = {
    MB: 'Thành viên',
    CS: 'Tư vấn viên',
    ST: 'Nhân viên xét nghiệm',
    AD: 'Quản trị viên',
    MG: 'Quản lý',
};

const UserDetailModal = ({ open, userId, onClose }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      if (!userId || !open) return;
      setLoading(true);
      try {
        const res = await adminApi.getUserDetail(userId);
        setUser(res.data);
      } catch (err) {
        message.error('Không thể tải chi tiết người dùng');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [userId, open]);

  return (
    <Modal
      open={open}
      title="Chi tiết người dùng"
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {loading ? (
        <Spin />
      ) : user ? (
        <>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ tên">{user.fullName || '(Người dùng)'}</Descriptions.Item>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{user.phoneNumber || '(Chưa cập nhật)'}</Descriptions.Item>
            <Descriptions.Item label="Ngày sinh">
              {user.doB ? dayjs(user.doB).format('DD/MM/YYYY') : '(Chưa cập nhật)'}
            </Descriptions.Item>
            <Descriptions.Item label="Giới tính">
              {user.gender === 'Male' ? 'Nam' : user.gender === 'Female' ? 'Nữ' : '(Chưa rõ)'}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{user.address || '(Chưa cập nhật)'}</Descriptions.Item>
            <Descriptions.Item label="Vai trò">{roleMap[user.roleId] || user.roleId}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={user.isAvailable ? 'green' : 'red'}>
                {user.isAvailable ? 'Hoạt động' : 'Bị khoá'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              {dayjs(user.createDate).format('DD/MM/YYYY')}
            </Descriptions.Item>
          </Descriptions>
        </>
      ) : (
        <p>Không có dữ liệu người dùng</p>
      )}
    </Modal>
  );
};

export default UserDetailModal;
