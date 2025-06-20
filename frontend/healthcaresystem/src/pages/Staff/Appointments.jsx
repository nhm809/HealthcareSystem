import React, { useState, useEffect } from 'react';
import { Table, Card, Tag, Button, Space, Modal, Form, Input, DatePicker, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { TextArea } = Input;

const Appointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Kiểm tra role của user
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.roleId !== 'ST') {
      navigate('/login');
      return;
    }

    // TODO: Fetch real data from API
    setAppointments([
      {
        key: '1',
        patientName: 'Nguyễn Văn A',
        time: '2024-03-20 09:00',
        service: 'Khám tổng quát',
        status: 'pending',
        phoneNumber: '0987654321',
        notes: 'Bệnh nhân có tiền sử bệnh tim'
      },
      {
        key: '2',
        patientName: 'Trần Thị B',
        time: '2024-03-20 10:00',
        service: 'Tư vấn dinh dưỡng',
        status: 'confirmed',
        phoneNumber: '0912345678',
        notes: 'Bệnh nhân cần tư vấn về chế độ ăn kiêng'
      }
    ]);
    setLoading(false);
  }, [navigate]);

  const columns = [
    {
      title: 'Bệnh nhân',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      render: (text) => dayjs(text).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service',
      key: 'service',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { color: 'warning', text: 'Chờ xác nhận' },
          confirmed: { color: 'success', text: 'Đã xác nhận' },
          cancelled: { color: 'error', text: 'Đã hủy' },
          completed: { color: 'processing', text: 'Hoàn thành' }
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      }
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleViewAppointment(record)}>
            Xem chi tiết
          </Button>
          {record.status === 'pending' && (
            <>
              <Button type="primary" onClick={() => handleConfirmAppointment(record)}>
                Xác nhận
              </Button>
              <Button danger onClick={() => handleCancelAppointment(record)}>
                Hủy
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    form.setFieldsValue({
      ...appointment,
      time: dayjs(appointment.time)
    });
    setIsModalVisible(true);
  };

  const handleConfirmAppointment = async (appointment) => {
    // TODO: Call API to confirm appointment
    console.log('Confirm appointment:', appointment);
  };

  const handleCancelAppointment = async (appointment) => {
    // TODO: Call API to cancel appointment
    console.log('Cancel appointment:', appointment);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      // TODO: Call API to update appointment
      console.log('Update appointment:', values);
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý lịch hẹn</h1>
      
      <Card>
        <Table
          columns={columns}
          dataSource={appointments}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Chi tiết lịch hẹn"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedAppointment}
        >
          <Form.Item
            name="patientName"
            label="Bệnh nhân"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="time"
            label="Thời gian"
          >
            <DatePicker showTime format="DD/MM/YYYY HH:mm" disabled />
          </Form.Item>
          <Form.Item
            name="service"
            label="Dịch vụ"
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
            name="notes"
            label="Ghi chú"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Appointments; 