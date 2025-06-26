import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Spin, message, Typography, Space, Modal, Descriptions, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { authApi, cancelTestRecord } from '../../services/api';
import MainLayout from '../../components/Layout/Layout';
import dayjs from 'dayjs';
import './TestHistory.css';

const { Title } = Typography;

const TestHistory = () => {
  const [testRecords, setTestRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const navigate = useNavigate();
  const userId = Cookies.get('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    fetchTestHistory();
  }, [userId, navigate]);

  const fetchTestHistory = async () => {
    try {
      setLoading(true);
      const response = await authApi.getTestServiceRecordsByMember(userId);
      setTestRecords(response.data);
    } catch (error) {
      console.error('Failed to fetch test history:', error);
      message.error('Không thể tải lịch sử xét nghiệm');
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status) => {
    const statusConfig = {
      'pending': { color: 'warning', text: 'Chờ thanh toán' },
      'processing': { color: 'processing', text: 'Đang thực hiện' },
      'completed': { color: 'success', text: 'Đã hoàn tất' },
      'cancelled': { color: 'default', text: 'Đã hủy' },
      'da hoan tat': { color: 'success', text: 'Đã hoàn tất' },
      'dang cho kham': { color: 'processing', text: 'Đang thực hiện' },
      'dang thanh toan': { color: 'warning', text: 'Chờ thanh toán' },
      'da huy': { color: 'default', text: 'Đã hủy' },
      'khach hang khong den': { color: 'default', text: 'Đã hủy' }
    };

    const lowerCaseStatus = status?.toLowerCase() || '';
    const config = statusConfig[lowerCaseStatus] || { color: 'default', text: status };

    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handleRowClick = (record) => {
    setSelectedRecord(record);
    setDetailModalVisible(true);
  };

  const columns = [
    {
      title: 'Dịch vụ',
      dataIndex: 'serviceName',
      key: 'serviceName',
      render: (text) => <strong style={{ color: '#1a3e72' }}>{text}</strong>,
      width: 200,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'recordDate',
      key: 'recordDate',
      render: (date) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 500 }}>{dayjs(date).format('DD/MM/YYYY')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{dayjs(date).format('HH:mm')}</div>
        </div>
      ),
      width: 120,
    },
    {
      title: 'Ngày xét nghiệm',
      dataIndex: 'testDate',
      key: 'testDate',
      render: (date) => date ? (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 500 }}>{dayjs(date).format('DD/MM/YYYY')}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{dayjs(date).format('HH:mm')}</div>
        </div>
      ) : '-',
      width: 120,
    },
    {
      title: 'Thời gian',
      dataIndex: 'timeSlot',
      key: 'timeSlot',
      render: (time) => time || '-',
      width: 100,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatus(status),
      width: 120,
    },
    {
      title: 'Kết quả',
      dataIndex: 'result',
      key: 'result',
      render: (result) => result ? (
        <Tag color="blue" style={{ fontWeight: 500 }}>Có kết quả</Tag>
      ) : (
        <Tag color="default">Chưa có</Tag>
      ),
      width: 100,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes) => (
        <div style={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {notes || '-'}
        </div>
      ),
      width: 150,
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="test-history-container">
        <Card>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={2} style={{ margin: 0, color: '#1a3e72' }}>
                Lịch sử xét nghiệm
              </Title>
            </div>

            {testRecords.length > 0 ? (
              <Table
                columns={columns}
                dataSource={testRecords}
                rowKey="testServiceRecordId"
                pagination={{
                  pageSize: 10,
                  showQuickJumper: true,
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} của ${total} bản ghi`,
                }}
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                  style: { cursor: 'pointer' }
                })}
                className="test-history-table"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Bạn chưa có lịch sử xét nghiệm nào.</p>
              </div>
            )}
          </Space>
        </Card>

        {/* Modal chi tiết */}
        <Modal
          title={
            <div style={{ color: '#1a3e72', fontSize: '18px', fontWeight: 600 }}>
              Chi tiết xét nghiệm
            </div>
          }
          open={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          footer={[
            (selectedRecord && ['dang thanh toan', 'pending'].includes((selectedRecord.status || '').toLowerCase())) && (
              <Button
                key="cancel"
                danger
                onClick={async () => {
                  Modal.confirm({
                    title: 'Xác nhận hủy lịch xét nghiệm',
                    content: 'Bạn chắc chắn muốn hủy lịch xét nghiệm này?',
                    okText: 'Hủy lịch',
                    okType: 'danger',
                    cancelText: 'Không',
                    onOk: async () => {
                      try {
                        await cancelTestRecord(selectedRecord.testServiceRecordId, userId);
                        message.success('Đã hủy lịch xét nghiệm!');
                        setDetailModalVisible(false);
                        fetchTestHistory();
                      } catch (err) {
                        message.error('Hủy lịch thất bại!');
                      }
                    },
                  });
                }}
              >
                Hủy
              </Button>
            ),
            <Button key="close" onClick={() => setDetailModalVisible(false)}>
              Đóng
            </Button>
          ]}
          width={1000}
        >
          {selectedRecord && (
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Dịch vụ" labelStyle={{ fontWeight: 600 }}>
                {selectedRecord.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt" labelStyle={{ fontWeight: 600 }}>
                {dayjs(selectedRecord.recordDate).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày xét nghiệm" labelStyle={{ fontWeight: 600 }}>
                {selectedRecord.testDate ? dayjs(selectedRecord.testDate).format('DD/MM/YYYY HH:mm') : 'Chưa có'}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian" labelStyle={{ fontWeight: 600 }}>
                {selectedRecord.timeSlot || 'Chưa có'}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" labelStyle={{ fontWeight: 600 }}>
                {renderStatus(selectedRecord.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Kết quả" labelStyle={{ fontWeight: 600 }}>
                {selectedRecord.result ? (
                  <div>
                    <Tag color="blue" style={{ marginBottom: 8 }}>Có kết quả</Tag>
                    <div style={{ marginTop: 8, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 6 }}>
                      {selectedRecord.result}
                    </div>
                  </div>
                ) : (
                  <Tag color="default">Chưa có kết quả</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" labelStyle={{ fontWeight: 600 }}>
                {selectedRecord.notes || 'Không có ghi chú'}
              </Descriptions.Item>
              <Descriptions.Item label="Thông tin bệnh nhân" labelStyle={{ fontWeight: 600 }}>
                <div>
                  <div><strong>Tên:</strong> {selectedRecord.fullNameOfMember}</div>
                  <div><strong>Giới tính:</strong> {selectedRecord.gender}</div>
                  <div><strong>Số điện thoại:</strong> {selectedRecord.phoneNumber}</div>
                </div>
              </Descriptions.Item>
            </Descriptions>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default TestHistory; 