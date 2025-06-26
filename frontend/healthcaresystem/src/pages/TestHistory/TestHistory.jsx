import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Spin, message, Typography, Space, Modal, Descriptions, Button, Image, Tabs } from 'antd';
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
  const [detailLoading, setDetailLoading] = useState(false);
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
      // Sắp xếp theo recordDate giảm dần
      const sorted = [...response.data].sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
      setTestRecords(sorted);
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
      'Dang thuc hien': { color: 'processing', text: 'Đang thực hiện' },
      'completed': { color: 'success', text: 'Đã hoàn thành' },
      'cancelled': { color: 'default', text: 'Đã hủy' },
      'da hoan thanh': { color: 'success', text: 'Đã hoàn thành' },
      'dang cho kham': { color: 'processing', text: 'Đang chờ khám' },
      'dang thanh toan': { color: 'warning', text: 'Chờ thanh toán' },
      'da huy': { color: 'default', text: 'Đã hủy' },
      'khach hang khong den': { color: 'default', text: 'Đã hủy' }
    };

    const lowerCaseStatus = status?.toLowerCase() || '';
    const config = statusConfig[lowerCaseStatus] || { color: 'default', text: status };

    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const handleRowClick = async (record) => {
    setDetailLoading(true);
    try {
      const response = await authApi.getTestServiceRecordDetail(record.testServiceRecordId, userId);
      setSelectedRecord(response.data);
      setDetailModalVisible(true);
    } catch (error) {
      message.error('Không thể tải chi tiết xét nghiệm');
    } finally {
      setDetailLoading(false);
    }
  };

  // Helper để hiển thị ca làm việc
  const renderTimeSlot = (time) => {
    if (time === '08:00:00') return '08:00 - 12:00';
    if (time === '13:00:00') return '13:00 - 17:00';
    return time || '-';
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => renderStatus(status),
      width: 120,
    },
  ];

  // Helper để lọc theo trạng thái
  const filterByStatus = (statusList) =>
    testRecords.filter(r => statusList.includes((r.status || '').toLowerCase()));

  const tabItems = [
    {
      key: 'dang-cho-kham',
      label: 'Đang chờ khám',
      children: (
        <Table
          columns={columns}
          dataSource={filterByStatus(['dang cho kham'])}
          rowKey="testServiceRecordId"
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' }
          })}
          className="test-history-table"
        />
      )
    },
    {
      key: 'dang-thuc-hien',
      label: 'Đang thực hiện',
      children: (
        <Table
          columns={columns}
          dataSource={filterByStatus(['processing', 'dang thuc hien'])}
          rowKey="testServiceRecordId"
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' }
          })}
          className="test-history-table"
        />
      )
    },
    {
      key: 'da-hoan-thanh',
      label: 'Đã hoàn thành',
      children: (
        <Table
          columns={columns}
          dataSource={filterByStatus(['completed', 'da hoan tat', 'da hoan thanh'])}
          rowKey="testServiceRecordId"
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' }
          })}
          className="test-history-table"
        />
      )
    },
    {
      key: 'da-huy',
      label: 'Đã hủy',
      children: (
        <Table
          columns={columns}
          dataSource={filterByStatus(['cancelled', 'da huy', 'khach hang khong den'])}
          rowKey="testServiceRecordId"
          pagination={{
            pageSize: 10,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bản ghi`,
          }}
          onRow={(record) => ({
            onClick: () => handleRowClick(record),
            style: { cursor: 'pointer' }
          })}
          className="test-history-table"
        />
      )
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
              <Tabs defaultActiveKey="dang-cho-kham" items={tabItems} />
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
          {detailLoading ? (
            <div style={{ textAlign: 'center', padding: 40 }}><Spin size="large" /></div>
          ) : selectedRecord && (
            <Descriptions bordered column={1} size="middle">
              <Descriptions.Item label="Dịch vụ" labelStyle={{ fontWeight: 600 }}>
                {selectedRecord.serviceName}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đặt" labelStyle={{ fontWeight: 600 }}>
                {dayjs(selectedRecord.recordDate).format('DD/MM/YYYY HH:mm')}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày xét nghiệm" labelStyle={{ fontWeight: 600 }}>
                {selectedRecord.testDate ? dayjs(selectedRecord.testDate).format('DD/MM/YYYY') : 'Chưa có'}
              </Descriptions.Item>
              <Descriptions.Item label="Thời gian" labelStyle={{ fontWeight: 600 }}>
                {renderTimeSlot(selectedRecord.timeSlot)}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái" labelStyle={{ fontWeight: 600 }}>
                {renderStatus(selectedRecord.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Kết quả" labelStyle={{ fontWeight: 600 }}>
                {selectedRecord.result ? (
                  (() => {
                    // Regex kiểm tra link ảnh
                    const isImage = typeof selectedRecord.result === 'string' &&
                      selectedRecord.result.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i);
                    if (isImage) {
                      return (
                        <div style={{ marginTop: 8 }}>
                          <Tag color="blue" style={{ marginBottom: 8 }}>Có kết quả</Tag>
                          <div style={{ marginTop: 8, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 6 }}>
                            <Image
                              src={selectedRecord.result}
                              alt="Kết quả xét nghiệm"
                              style={{ maxWidth: 350, maxHeight: 350 }}
                              preview={{ mask: 'Xem ảnh lớn' }}
                            />
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <Tag color="blue" style={{ marginBottom: 8 }}>Có kết quả</Tag>
                          <div style={{ marginTop: 8, padding: 12, backgroundColor: '#f8f9fa', borderRadius: 6 }}>
                            {selectedRecord.result}
                          </div>
                        </div>
                      );
                    }
                  })()
                ) : (
                  <Tag color="default">Chưa có kết quả</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Ghi chú" labelStyle={{ fontWeight: 600 }}>
                {selectedRecord.notes || 'Không có ghi chú'}
              </Descriptions.Item>
              {selectedRecord.fullNameOfMember && (
                <Descriptions.Item label="Thông tin bệnh nhân" labelStyle={{ fontWeight: 600 }}>
                  <div>
                    <div><strong>Tên:</strong> {selectedRecord.fullNameOfMember}</div>
                    <div><strong>Giới tính:</strong> {selectedRecord.gender}</div>
                    <div><strong>Số điện thoại:</strong> {selectedRecord.phoneNumber}</div>
                  </div>
                </Descriptions.Item>
              )}
              {selectedRecord.staff && (
                <Descriptions.Item label="Nhân viên thực hiện" labelStyle={{ fontWeight: 600 }}>
                  <div>
                    <div><strong>Tên:</strong> {selectedRecord.staff.fullName}</div>
                    <div><strong>Email:</strong> {selectedRecord.staff.email}</div>
                    <div><strong>Chuyên khoa:</strong> {selectedRecord.staff.specialtyNames?.join(', ')}</div>
                  </div>
                </Descriptions.Item>
              )}
            </Descriptions>
          )}
        </Modal>
      </div>
    </MainLayout>
  );
};

export default TestHistory; 