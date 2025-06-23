import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Select, Input, Button, Table, Tag, Avatar, Pagination, Space } from 'antd';
import { ReloadOutlined, FilterOutlined } from '@ant-design/icons';
import { getTestServiceRecordsByStatus, assignTestToStaff } from '../../services/api';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const statusMap = {
  'Dang cho kham': { color: 'gold', icon: '⏳', text: 'Đang chờ khám' },
  'In Progress': { color: 'blue', icon: '•', text: 'In Progress' },
  'Completed': { color: 'green', icon: '✔', text: 'Completed' },
  'Cancelled': { color: 'red', icon: '✖', text: 'Cancelled' },
};

const StaffDashboard = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(1);
  const pageSize = 8;
  const [searchName, setSearchName] = useState('');
  const navigate = useNavigate();

  const fetchTestRecords = async () => {
    setLoading(true);
    try {
      const response = await getTestServiceRecordsByStatus();
      console.log('API DATA:', response.data);
      const formattedData = response.data.map((record) => ({
        key: record.testServiceRecordId,
        fullNameOfMember: record.fullNameOfMember,
        phoneNumber: record.phoneNumber,
        recordDate: record.recordDate,
        status: record.status,
        staffId: record.staffId,
        testServiceRecordId: record.testServiceRecordId
      }));
      console.log('Formatted Data:', formattedData);
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching test records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestRecords();
    const interval = setInterval(() => {
      fetchTestRecords();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const columns = [
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const s = statusMap[status];
        return (
          <Tag color={s.color} style={{ fontSize: 16, padding: '2px 12px', borderRadius: 16, display: 'inline-flex', alignItems: 'center' }}>
            <span style={{ marginRight: 6 }}>{s.icon}</span> {s.text}
          </Tag>
        );
      },
    },
    {
      title: 'Nhân viên phụ trách',
      dataIndex: 'staffId',
      key: 'staffId',
      render: (staffId, record) => (
        staffId ? (
          <span>Đã phân công</span>
        ) : (
          <Button 
            type="primary"
            onClick={async () => {
              const staffId = Cookies.get('userId');
              try {
                await assignTestToStaff(record.testServiceRecordId, staffId);
                fetchTestRecords();
              } catch (err) {
                console.error(err);
              }
            }}
          >
            Phân công
          </Button>
        )
      ),
    },
  ];

  const handleRefresh = () => {
    fetchTestRecords();
  };

  // Sắp xếp data theo recordDate giảm dần (mới nhất lên đầu)
  const sortedData = [...data].sort((a, b) => new Date(b.recordDate) - new Date(a.recordDate));

  // Lọc chỉ lấy test chưa phân công
  const unassignedData = sortedData.filter(item => !item.staffId);

  // Lọc dữ liệu theo số điện thoại
  const filteredData = unassignedData.filter(item =>
    item.phoneNumber && item.phoneNumber.includes(searchName)
  );
  // Tính toán dữ liệu cho trang hiện tại
  const paginatedData = filteredData.slice((current - 1) * pageSize, current * pageSize);

  const handleLogout = () => {
    Cookies.remove('email');
    Cookies.remove('userid');
    Cookies.remove('userId');
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    localStorage.removeItem('userInfo');
    navigate('/');
    window.location.reload();
  };

  return (
    <>
      <Row gutter={32}>
        {/* Filters */}
        <Col xs={24} sm={8} md={7} lg={6} xl={5}>
          <Card style={{ borderRadius: 16, marginBottom: 24 }} bodyStyle={{ padding: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}><FilterOutlined style={{ marginRight: 8 }} />Filters</div>
            <Form form={form} layout="vertical">
              <Form.Item label="Test Type" name="testType">
                <Select defaultValue="All">
                  <Option value="All">All</Option>
                  <Option value="Type1">Type 1</Option>
                  <Option value="Type2">Type 2</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Status" name="status">
                <Select defaultValue="All">
                  <Option value="All">All</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="InProgress">In Progress</Option>
                  <Option value="Completed">Completed</Option>
                  <Option value="Cancelled">Cancelled</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Số điện thoại" name="customerName">
                <Input
                  placeholder="Nhập số điện thoại..."
                  value={searchName}
                  onChange={e => {
                    setSearchName(e.target.value);
                    setCurrent(1); // Reset về trang 1 khi tìm kiếm
                  }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" block icon={<FilterOutlined />}>Apply Filters</Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        {/* Table section */}
        <Col xs={24} sm={16} md={17} lg={18} xl={19}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 26, margin: 0 }}>Danh sách các xét nghiệm</h2>
            <Button icon={<ReloadOutlined />} onClick={handleRefresh} style={{ borderRadius: 24, fontWeight: 500 }}>
              Refresh
            </Button>
          </div>
          <Card style={{ borderRadius: 16, boxShadow: '0 2px 12px #0001' }} bodyStyle={{ padding: 0 }}>
            <Table
              columns={columns}
              dataSource={paginatedData}
              loading={loading}
              pagination={false}
              rowKey="key"
              style={{ borderRadius: 16 }}
            />
            <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
              <Pagination
                current={current}
                total={filteredData.length}
                pageSize={pageSize}
                onChange={setCurrent}
                showSizeChanger={false}
                itemRender={(page, type, originalElement) => {
                  if (type === 'page') {
                    return <Button shape="circle" type={page === current ? 'primary' : 'default'}>{page}</Button>;
                  }
                  return originalElement;
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default StaffDashboard; 