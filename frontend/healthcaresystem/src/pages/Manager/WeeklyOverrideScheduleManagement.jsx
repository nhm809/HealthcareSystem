import React, { useEffect, useState } from 'react';
import { Table, Tag, Form, Input, Button, Select, DatePicker, Row, Col, Space, message, Popconfirm } from 'antd';
import { weeklyOverrideScheduleApi } from '../../services/api';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const statusOptions = [
  'Đang chờ duyệt',
  'Đã xác nhận',
  'Đã từ chối',
  'Đã hủy',
];
const overrideTypeOptions = ['Làm thêm', 'Nghỉ'];
const shiftTypeOptions = [
  { value: 1, label: 'Ca sáng' },
  { value: 2, label: 'Ca chiều' },
];

const WeeklyOverrideScheduleManagement = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async (filters = {}) => {
    setLoading(true);
    try {
      const params = { ...filters };
      if (params.fromDate && params.toDate) {
        params.fromDate = params.fromDate[0].startOf('day').toISOString();
        params.toDate = params.fromDate[1].endOf('day').toISOString();
      } else {
        delete params.fromDate;
        delete params.toDate;
      }
      if (!params.userId) delete params.userId;
      if (!params.status) delete params.status;
      if (!params.overrideType) delete params.overrideType;
      if (!params.shiftType) delete params.shiftType;
      const res = await weeklyOverrideScheduleApi.getOverrideSchedules(params);
      setData(res.data || []);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = (values) => {
    fetchData(values);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await weeklyOverrideScheduleApi.updateOverrideStatus({ weeklyOverrideScheduleId: id, status });
      message.success(`Đã cập nhật trạng thái: ${status}`);
      fetchData(form.getFieldsValue());
    } catch (e) {
      message.error('Cập nhật trạng thái thất bại!');
    }
  };

  const columns = [
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Loại đăng ký',
      dataIndex: 'overrideType',
      key: 'overrideType',
      render: (type) => <Tag color={type === 'Làm thêm' ? 'green' : 'red'}>{type}</Tag>,
    },
    {
      title: 'Ca',
      dataIndex: 'shiftType',
      key: 'shiftType',
      render: (shift) => shift === 1 ? 'Ca sáng' : shift === 2 ? 'Ca chiều' : `Ca ${shift}`,
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => reason || <span style={{ color: '#aaa' }}>-</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'Đã xác nhận') color = 'green';
        else if (status === 'Đã từ chối') color = 'red';
        else if (status === 'Đang chờ duyệt') color = 'orange';
        else if (status === 'Đã hủy') color = 'default';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: 'Nhân viên',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: 'Vai trò',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) =>
        record.status === 'Đang chờ duyệt' ? (
          <Space>
            <Popconfirm
              title="Xác nhận duyệt yêu cầu này?"
              onConfirm={() => handleUpdateStatus(record.weeklyOverrideScheduleId, 'Đã xác nhận')}
              okText="Duyệt"
              cancelText="Hủy"
            >
              <Button type="primary" size="small">Duyệt</Button>
            </Popconfirm>
            <Popconfirm
              title="Xác nhận từ chối yêu cầu này?"
              onConfirm={() => handleUpdateStatus(record.weeklyOverrideScheduleId, 'Đã từ chối')}
              okText="Từ chối"
              cancelText="Hủy"
            >
              <Button danger size="small">Từ chối</Button>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  return (
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, maxWidth: 1200, margin: '0 auto', boxShadow: '0 1px 6px #f0f1f2' }}>
      <h2 style={{ marginBottom: 20, fontWeight: 600, fontSize: 24, color: '#222' }}>Quản lý đăng ký làm thêm/nghỉ</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item name="status" label="Trạng thái">
              <Select allowClear placeholder="Chọn trạng thái">
                {statusOptions.map(s => <Option key={s} value={s}>{s}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="overrideType" label="Loại đăng ký">
              <Select allowClear placeholder="Chọn loại">
                {overrideTypeOptions.map(s => <Option key={s} value={s}>{s}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="fromDate" label="Khoảng ngày">
              <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="shiftType" label="Ca">
              <Select allowClear placeholder="Chọn ca">
                {shiftTypeOptions.map(s => <Option key={s.value} value={s.value}>{s.label}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={3} style={{ display: 'flex', alignItems: 'end' }}>
            <Form.Item>
              <Button type="primary" htmlType="submit">Lọc</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="weeklyOverrideScheduleId"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
        locale={{ emptyText: 'Không có dữ liệu.' }}
      />
    </div>
  );
};

export default WeeklyOverrideScheduleManagement;
