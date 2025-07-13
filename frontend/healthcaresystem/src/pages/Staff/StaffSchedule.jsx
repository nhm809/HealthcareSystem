import React, { useEffect, useState } from 'react';
import { Table, Pagination, Button, Tag, Card, Row, Col, Modal, Form, Select, Input, message, Upload, Tabs, Image } from 'antd';
import { getTestServiceRecordsByStaff, updateTestResult, authApi } from '../../services/api';
import Cookies from 'js-cookie';
import { UploadOutlined, ClockCircleOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined, IdcardOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import './StaffSchedule.css';

const statusMap = {
  'Dang cho kham': { color: 'gold', icon: <ClockCircleOutlined />, text: 'Đang chờ khám' },
  'Dang thuc hien': { color: 'blue', icon: <SyncOutlined spin />, text: 'Đang thực hiện' },
  'Da hoan thanh': { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã hoàn thành' },
  'Khach hang khong den': { color: 'red', icon: <MinusCircleOutlined />, text: 'Khách hàng không đến'},
  'Da huy': { color: 'red', icon: <CloseCircleOutlined />, text: 'Đã huỷ' }
};

const statusOptions = [
  { value: 'Dang cho kham', label: 'Đang chờ khám' },
  { value: 'Dang thuc hien', label: 'Đang thực hiện' },
  { value: 'Da hoan thanh', label: 'Đã hoàn thành' },
  { value: 'Khach hang khong den', label: 'Khách hàng không đến' },
  { value: 'Da huy', label: 'Đã hủy'}
];

const columnsBase = [
  {
    title: 'Tên khách hàng',
    dataIndex: 'fullNameOfMember',
    key: 'fullNameOfMember',
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'phoneNumber',
    key: 'phoneNumber',
  },
  {
    title: 'Ngày đăng ký',
    dataIndex: 'recordDate',
    key: 'recordDate',
    render: (date) => new Date(date).toLocaleString('vi-VN'),
  },
  {
    title: 'Ca giờ xét nghiệm',
    dataIndex: 'testShift',
    key: 'testShift',
    render: (shift) => shift || '-',
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      const s = statusMap[status];
      return (
        <Tag color={s?.color} style={{ fontSize: 16, padding: '2px 12px', borderRadius: 16, display: 'inline-flex', alignItems: 'center' }}>
          <span style={{ marginRight: 6 }}>{s?.icon}</span> {s?.text || status}
        </Tag>
      );
    },
  },
];

const StaffSchedule = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [form] = Form.useForm();
  const pageSize = 8;
  
  // State cho phân trang của từng tab
  const [currentPage, setCurrentPage] = useState({
    'dang-cho-kham': 1,
    'dang-thuc-hien': 1,
    'da-hoan-thanh': 1,
    'da-huy': 1
  });

  // State để track status được chọn trong form
  const [selectedStatus, setSelectedStatus] = useState('');

  const staffId = Cookies.get('userId');

  // Hàm upload file lên Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'healthcare');
    const response = await fetch(
      'https://api.cloudinary.com/v1_1/dktu0nbjx/image/upload',
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();
    return data.secure_url;
  };

  // Thêm state cho uploading và result
  const [uploadingResult, setUploadingResult] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getTestServiceRecordsByStaff(staffId);
        const formattedData = response.data.map(record => ({
          key: record.testServiceRecordId,
          fullNameOfMember: record.fullNameOfMember,
          phoneNumber: record.phoneNumber,
          recordDate: record.recordDate,
          status: record.status,
          staffId: record.staffId,
          testServiceRecordId: record.testServiceRecordId,
          dob: record.dob,
          gender: record.gender,
          email: record.email,
          address: record.address,
          result: record.result,
          notes: record.notes,
          testDate: record.testDate,
          serviceId: record.serviceId,
          memberId: record.memberId
        }));
        // Sắp xếp mới nhất lên đầu
        formattedData.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
        setData(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (staffId) fetchData();
  }, [staffId]);

  // Phân trang
  const paginatedData = data.slice((current - 1) * pageSize, current * pageSize);

  // Helper để lọc theo trạng thái
  const filterByStatus = (statusList) =>
    data.filter(r => statusList.includes(r.status));

  // Hàm xử lý thay đổi trang cho từng tab
  const handlePageChange = (tabKey, page) => {
    setCurrentPage(prev => ({
      ...prev,
      [tabKey]: page
    }));
  };

  // Thêm cột Detail vào cuối bảng
  const columns = [
    ...columnsBase,
    {
      title: 'Thao tác',
      key: 'detail',
      width: 120,
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => {
            handleModalOpen(record);
          }}
          style={{
            backgroundColor: '#43AA8B',
            borderColor: '#43AA8B',
            borderRadius: '6px',
            fontWeight: 500,
            height: '32px',
            padding: '0 16px'
          }}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  // Tạo tab items cho từng trạng thái
  const tabItems = [
    {
      key: 'dang-cho-kham',
      label: `Đang chờ khám (${filterByStatus(['Dang cho kham']).length})`,
      children: (
        <div>
          <Table
            columns={columns}
            dataSource={filterByStatus(['Dang cho kham'])}
            loading={loading}
            pagination={false}
            rowKey="key"
            className="staff-schedule-table"
          />
          {filterByStatus(['Dang cho kham']).length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
              <Pagination
                current={currentPage['dang-cho-kham']}
                total={filterByStatus(['Dang cho kham']).length}
                pageSize={pageSize}
                onChange={(page) => handlePageChange('dang-cho-kham', page)}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
              />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'dang-thuc-hien',
      label: `Đang thực hiện (${filterByStatus(['Dang thuc hien']).length})`,
      children: (
        <div>
          <Table
            columns={columns}
            dataSource={filterByStatus(['Dang thuc hien'])}
            loading={loading}
            pagination={false}
            rowKey="key"
            className="staff-schedule-table"
          />
          {filterByStatus(['Dang thuc hien']).length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
              <Pagination
                current={currentPage['dang-thuc-hien']}
                total={filterByStatus(['Dang thuc hien']).length}
                pageSize={pageSize}
                onChange={(page) => handlePageChange('dang-thuc-hien', page)}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
              />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'da-hoan-thanh',
      label: `Đã hoàn thành (${filterByStatus(['Da hoan thanh']).length})`,
      children: (
        <div>
          <Table
            columns={columns}
            dataSource={filterByStatus(['Da hoan thanh'])}
            loading={loading}
            pagination={false}
            rowKey="key"
            className="staff-schedule-table"
          />
          {filterByStatus(['Da hoan thanh']).length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
              <Pagination
                current={currentPage['da-hoan-thanh']}
                total={filterByStatus(['Da hoan thanh']).length}
                pageSize={pageSize}
                onChange={(page) => handlePageChange('da-hoan-thanh', page)}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
              />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'da-huy',
      label: `Đã hủy (${filterByStatus(['Da huy', 'Khach hang khong den']).length})`,
      children: (
        <div>
          <Table
            columns={columns}
            dataSource={filterByStatus(['Da huy', 'Khach hang khong den'])}
            loading={loading}
            pagination={false}
            rowKey="key"
            className="staff-schedule-table"
          />
          {filterByStatus(['Da huy', 'Khach hang khong den']).length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
              <Pagination
                current={currentPage['da-huy']}
                total={filterByStatus(['Da huy', 'Khach hang khong den']).length}
                pageSize={pageSize}
                onChange={(page) => handlePageChange('da-huy', page)}
                showSizeChanger={false}
                showQuickJumper
                showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} mục`}
              />
            </div>
          )}
        </div>
      )
    },
  ];

  // Hàm cập nhật status
  const handleUpdateStatus = async (values) => {
    try {
      await updateTestResult(staffId, {
        testServiceRecordId: selectedTest.testServiceRecordId,
        result: selectedTest.result || '',
        notes: values.notes || '',
        status: values.status
      });
      message.success('Cập nhật trạng thái thành công!');
      setModalOpen(false);
      // Cập nhật selectedStatus
      setSelectedStatus(values.status);
      // Refresh dữ liệu sau khi cập nhật
      const response = await getTestServiceRecordsByStaff(staffId);
      const formattedData = response.data.map(record => ({
        key: record.testServiceRecordId,
        fullNameOfMember: record.fullNameOfMember,
        phoneNumber: record.phoneNumber,
        recordDate: record.recordDate,
        status: record.status,
        staffId: record.staffId,
        testServiceRecordId: record.testServiceRecordId,
        dob: record.dob,
        gender: record.gender,
        email: record.email,
        address: record.address,
        result: record.result,
        notes: record.notes,
        testDate: record.testDate,
        serviceId: record.serviceId,
        memberId: record.memberId
      }));
      formattedData.sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));
      setData(formattedData);
    } catch {
      message.error('Cập nhật trạng thái thất bại!');
    }
  };

  const handleModalOpen = async (record) => {
    try {
      // Gọi API lấy chi tiết xét nghiệm
      const detailRes = await authApi.getTestServiceRecordDetail(record.testServiceRecordId, record.memberId);
      const detail = detailRes.data;
      // Gộp thông tin cũ và mới (nếu cần)
      setSelectedTest({ ...record, ...detail });
      setSelectedStatus(detail.status || record.status);
      setModalOpen(true);
      form.setFieldsValue({ status: detail.status || record.status, notes: detail.notes || record.notes });
    } catch (err) {
      setSelectedTest(record);
      setSelectedStatus(record.status);
      setModalOpen(true);
      form.setFieldsValue({ status: record.status, notes: record.notes });
    }
  };

  return (
    <Row gutter={32}>
      <Col span={24}>
        <h2 style={{ fontWeight: 700, fontSize: 26, margin: '16px 16px' }}>Quản lý xét nghiệm</h2>
        <Card style={{ borderRadius: 16, boxShadow: '0 2px 12px #0001' }} bodyStyle={{ padding: 0 }}>
          {data.length > 0 ? (
            <Tabs 
              defaultActiveKey="dang-cho-kham" 
              items={tabItems} 
              tabBarStyle={{ background: '#f8f9fa', borderRadius: '16px 16px 0 0', padding: '0 16px', borderBottom: '1px solid #e0e0e0' }}
              className="custom-staff-tabs"
            />
          ) : (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <p>Bạn chưa có xét nghiệm nào được phân công.</p>
            </div>
          )}
        </Card>
        {/* Modal chi tiết test */}
        <Modal
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setSelectedStatus(''); // Reset selectedStatus khi đóng modal
          }}
          title={
            <div style={{ color: '#43AA8B', fontSize: '18px', fontWeight: 600 }}>
              Chi tiết xét nghiệm
            </div>
          }
          footer={null}
          width={700}
          style={{ top: 20 }}
        >
          {selectedTest && (
            <div style={{ padding: '0 8px' }}>
              {/* Thông tin bệnh nhân */}
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '20px', 
                borderRadius: '12px', 
                marginBottom: '24px',
                border: '1px solid #e9ecef'
              }}>
                <h3 style={{ 
                  color: '#43AA8B', 
                  marginBottom: '16px', 
                  fontSize: '16px', 
                  fontWeight: 600,
                  borderBottom: '2px solid #43AA8B',
                  paddingBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}>
                  <IdcardOutlined style={{ fontSize: 18 }} /> Thông tin bệnh nhân
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><strong>Tên khách hàng:</strong> {selectedTest.fullNameOfMember}</div>
                  <div><strong>Giới tính:</strong> {selectedTest.gender}</div>
                  <div><strong>Số điện thoại:</strong> {selectedTest.phoneNumber}</div>
                  <div><strong>Ngày sinh:</strong> {selectedTest.dob}</div>
                  <div><strong>Ngày đăng ký:</strong> {new Date(selectedTest.recordDate).toLocaleString('vi-VN')}</div>
                  <div><strong>Ngày xét nghiệm:</strong> {selectedTest.testDate || '-'}</div>
                  <div><strong>Ca giờ xét nghiệm:</strong> {
                    selectedTest.timeSlot === '08:00:00' ? '08h - 12h'
                    : selectedTest.timeSlot === '13:00:00' ? '13h - 17h'
                    : selectedTest.timeSlot ? `${selectedTest.timeSlot}`
                    : '-'
                  }</div>
                  <div><strong>Mã xét nghiệm:</strong> {selectedTest.testServiceRecordId}</div>
                  <div><strong>Nhân viên phụ trách:</strong> Bạn</div>
                </div>
              </div>

              {/* Tiến trình xét nghiệm */}
              {selectedTest && selectedTest.status !== 'Da hoan thanh' && (() => {
                // Kiểm tra xem đã đến ngày xét nghiệm chưa
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const testDate = selectedTest.testDate ? new Date(selectedTest.testDate) : null;
                testDate?.setHours(0, 0, 0, 0);
                const isTestDateReached = testDate && today >= testDate;
                
                return isTestDateReached ? (
                <div style={{ 
                  backgroundColor: '#fff', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  marginBottom: '24px',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ 
                    color: '#43AA8B', 
                    marginBottom: '16px', 
                    fontSize: '16px', 
                    fontWeight: 600,
                    borderBottom: '2px solid #43AA8B',
                    paddingBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <SyncOutlined /> Tiến trình xét nghiệm
                  </h3>
                  <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
                    <Form.Item 
                      name="status" 
                      label={
                        <span style={{ fontWeight: 600, color: '#333' }}>
                          Trạng thái hiện tại
                        </span>
                      }
                    >
                      <Select 
                        options={statusOptions} 
                        style={{ borderRadius: '8px' }}
                        size="large"
                        onChange={(value) => setSelectedStatus(value)}
                      />
                    </Form.Item>
                    <Form.Item 
                      name="notes" 
                      label={
                        <span style={{ fontWeight: 600, color: '#333' }}>
                          Ghi chú
                        </span>
                      }
                    >
                      <Input.TextArea 
                        placeholder="Thêm ghi chú..." 
                        rows={4}
                        style={{ borderRadius: '8px' }}
                      />
                    </Form.Item>
                    {/* Chỉ hiện upload khi chọn Đã hoàn thành và trạng thái thực tế chưa phải Đã hoàn thành */}
                    {form.getFieldValue('status') === 'Da hoan thanh' && (!selectedTest.result || selectedTest.result === '' || selectedTest.result.startsWith('http')) && (
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 600, marginBottom: '12px', color: '#333' }}>
                          Tải kết quả mới:
                        </div>
                        <Upload
                          name="result"
                          showUploadList={false}
                          accept=".jpg,.jpeg,.png,.pdf"
                          customRequest={async ({ file, onSuccess, onError }) => {
                            setUploadingResult(true);
                            try {
                              const url = await uploadToCloudinary(file);
                              setSelectedTest(prev => ({ ...prev, result: url }));
                              message.success('Tải ảnh kết quả lên thành công!');
                              // Hiển thị ảnh ngay sau khi upload
                              // Không cần form.setFieldsValue vì không có field result trong form
                              onSuccess();
                            } catch (err) {
                              message.error('Tải kết quả lên thất bại!');
                              onError(err);
                            } finally {
                              setUploadingResult(false);
                            }
                          }}
                        >
                          <Button 
                            icon={<UploadOutlined />} 
                            loading={uploadingResult} 
                            size="large"
                            style={{ 
                              backgroundColor: '#43AA8B', 
                              borderColor: '#43AA8B',
                              borderRadius: '8px',
                              fontWeight: 600,
                              height: '40px',
                              padding: '0 24px',
                              color: "white"
                            }}
                          >
                            Tải kết quả lên
                          </Button>
                        </Upload>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#6c757d', 
                          marginTop: '8px',
                          fontStyle: 'italic'
                        }}>
                          Hỗ trợ: JPG, JPEG, PNG
                        </div>
                        {/* Hiển thị ảnh preview ngay sau khi upload */}
                        {selectedTest.result && selectedTest.result.startsWith('http') && (
                          <div style={{ marginTop: 16 }}>
                            <Image
                              src={selectedTest.result}
                              alt="Kết quả xét nghiệm"
                              style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '2px solid #e9ecef' }}
                              preview={true}
                            />
                          </div>
                        )}
                      </div>
                    )}
                    <Form.Item>
                      <Button 
                        type="primary" 
                        htmlType="submit"
                        size="large"
                        style={{ 
                          backgroundColor: '#43AA8B', 
                          borderColor: '#43AA8B',
                          borderRadius: '8px',
                          fontWeight: 600,
                          height: '40px',
                          padding: '0 24px'
                        }}
                        disabled={form.getFieldValue('status') === 'Da hoan thanh' && (!selectedTest.result || selectedTest.result === '')}
                      >
                        Cập nhật trạng thái
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              ) : (
                <div style={{ 
                  backgroundColor: '#fff3cd', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid #ffeaa7',
                  marginBottom: '24px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#856404',
                    fontWeight: 500
                  }}>
                    <InfoCircleOutlined style={{ marginRight: 8, fontSize: 16 }} />
                    Chưa đến ngày xét nghiệm ({selectedTest.testDate ? new Date(selectedTest.testDate).toLocaleDateString('vi-VN') : 'Chưa có ngày'}). Chỉ có thể cập nhật trạng thái khi đến ngày xét nghiệm.
                  </div>
                </div>
              );
              })()}

              {/* Kết quả xét nghiệm - chỉ hiện khi trạng thái thực tế là Đã hoàn thành */}
              {selectedTest && selectedTest.status === 'Da hoan thanh' && (
                <div style={{ 
                  backgroundColor: '#fff', 
                  padding: '20px', 
                  borderRadius: '12px',
                  border: '1px solid #e9ecef',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <h3 style={{ 
                    color: '#43AA8B', 
                    marginBottom: '16px', 
                    fontSize: '16px', 
                    fontWeight: 600,
                    borderBottom: '2px solid #43AA8B',
                    paddingBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <CheckCircleOutlined /> Kết quả xét nghiệm
                  </h3>
                  {/* Hiển thị kết quả hiện tại */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '12px', color: '#333' }}>
                      Kết quả hiện tại:
                    </div>
                    <div style={{ 
                      minHeight: '60px', 
                      padding: '16px', 
                      backgroundColor: '#f8f9fa', 
                      borderRadius: '8px',
                      border: '1px solid #dee2e6'
                    }}>
                      {selectedTest.result ? (
                        selectedTest.result.startsWith('http') ? (
                          <div>
                            <div style={{ marginBottom: '12px' }}>
                              <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
                                Đã có kết quả
                              </Tag>
                            </div>
                            <Image
                              src={selectedTest.result}
                              alt="Kết quả xét nghiệm"
                              style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '2px solid #e9ecef' }}
                              preview={true}
                            />
                          </div>
                        ) : (
                          <div>
                            <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px', marginBottom: '8px' }}>
                              Đã có kết quả
                            </Tag>
                            <div style={{ 
                              padding: '12px', 
                              backgroundColor: '#fff', 
                              borderRadius: '6px',
                              border: '1px solid #dee2e6'
                            }}>
                              {selectedTest.result}
                            </div>
                          </div>
                        )
                      ) : (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          color: '#6c757d',
                          fontStyle: 'italic'
                        }}>
                          <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                          Chưa có kết quả
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Thông báo khi chưa chọn "Đã hoàn thành" */}
              {selectedStatus !== 'Da hoan thanh' && (
                <div style={{ 
                  backgroundColor: '#fff3cd', 
                  padding: '16px', 
                  borderRadius: '8px', 
                  border: '1px solid #ffeaa7',
                  marginTop: '16px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: '#856404',
                    fontWeight: 500
                  }}>
                    <InfoCircleOutlined style={{ marginRight: 8, fontSize: 16 }} />
                    Chỉ có thể tải kết quả xét nghiệm khi trạng thái là "Đã hoàn thành"
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </Col>
    </Row>
  );
};

export default StaffSchedule; 