import React, { useState, useEffect } from 'react';
import { Table, Card, Button, Space, Modal, Form, Input, InputNumber, Select, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    // Kiểm tra role của user
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || userInfo.roleId !== 'ST') {
      navigate('/login');
      return;
    }

    // TODO: Fetch real data from API
    setServices([
      {
        key: '1',
        name: 'Khám tổng quát',
        price: 500000,
        duration: 30,
        description: 'Khám sức khỏe tổng quát, tư vấn dinh dưỡng',
        status: 'active'
      },
      {
        key: '2',
        name: 'Tư vấn dinh dưỡng',
        price: 300000,
        duration: 45,
        description: 'Tư vấn chế độ ăn uống, dinh dưỡng',
        status: 'active'
      }
    ]);
    setLoading(false);
  }, [navigate]);

  const columns = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      render: (price) => price.toLocaleString('vi-VN'),
    },
    {
      title: 'Thời gian (phút)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Đang hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => handleViewService(record)}>
            Xem chi tiết
          </Button>
          <Button onClick={() => handleEditService(record)}>
            Chỉnh sửa
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewService = (service) => {
    setSelectedService(service);
    form.setFieldsValue(service);
    setIsModalVisible(true);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    form.setFieldsValue(service);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      // TODO: Call API to update service
      console.log('Update service:', values);
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý dịch vụ</h1>
      
      <Card>
        <Table
          columns={columns}
          dataSource={services}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Thông tin dịch vụ"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={selectedService}
        >
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[{ required: true, message: 'Vui lòng nhập tên dịch vụ' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Thời gian (phút)"
            rules={[{ required: true, message: 'Vui lòng nhập thời gian' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value="active">Đang hoạt động</Select.Option>
              <Select.Option value="inactive">Không hoạt động</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Services; 