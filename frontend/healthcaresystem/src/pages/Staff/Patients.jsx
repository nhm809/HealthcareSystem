import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, DatePicker, Select, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { TextArea } = Input;

const Patients = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Kiểm tra role của user
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.roleId !== 'ST') {
      navigate('/login');
      return;
    }

    // TODO: Fetch real data from API
    setPatients([
      {
        key: '1',
        name: 'Nguyễn Văn A',
        phoneNumber: '0987654321',
        email: 'nguyenvana@gmail.com',
        lastVisit: '2024-03-15',
        status: 'active',
        medicalHistory: 'Tiền sử bệnh tim, huyết áp cao'
      },
      {
        key: '2',
        name: 'Trần Thị B',
        phoneNumber: '0912345678',
        email: 'tranthib@gmail.com',
        lastVisit: '2024-03-10',
        status: 'inactive',
        medicalHistory: 'Tiền sử tiểu đường'
      }
    ]);
    setLoading(false);
  }, [navigate]);

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Lần khám cuối',
      dataIndex: 'lastVisit',
      key: 'lastVisit',
      render: (text) => dayjs(text).format('DD/MM/YYYY'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Đang điều trị' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleViewPatient(record)}>
            Xem chi tiết
          </Button>
          <Button onClick={() => handleCreateAppointment(record)}>
            Tạo lịch hẹn
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    form.setFieldsValue({
      ...patient,
      lastVisit: dayjs(patient.lastVisit)
    });
    setIsModalVisible(true);
  };

  const handleCreateAppointment = (patient) => {
    // TODO: Navigate to appointment creation page with patient info
    console.log('Create appointment for:', patient);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      // TODO: Call API to update patient info
      console.log('Update patient:', values);
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý bệnh nhân</h1>
      
      <Card>
        <Table
          columns={columns}
          dataSource={patients}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Thông tin bệnh nhân"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedPatient}
        >
          <Form.Item
            name="name"
            label="Họ tên"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Số điện thoại"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="lastVisit"
            label="Lần khám cuối"
          >
            <DatePicker disabled />
          </Form.Item>
          <Form.Item
            name="medicalHistory"
            label="Tiền sử bệnh"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Patients; 