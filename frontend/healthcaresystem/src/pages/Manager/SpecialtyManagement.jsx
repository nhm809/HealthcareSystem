import React, { useEffect, useState } from 'react';
import { Card, Typography, Row, Col, Spin, Empty, Modal, Button, Form, Input, message, Divider } from 'antd';
import { specialtyApi } from '../../services/api';

const { Title, Text } = Typography;

const cardStyle = {
  borderRadius: 16,
  minHeight: 200,
  boxShadow: '0 2px 12px #e6e6e6',
  transition: 'box-shadow 0.2s',
  cursor: 'pointer',
  background: '#fff',
};

const cardBodyStyle = {
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'center',
};

const SpecialtyManagement = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm] = Form.useForm();
  const [adding, setAdding] = useState(false);

  const fetchSpecialties = async () => {
    setLoading(true);
    try {
      const res = await specialtyApi.getAllSpecialties();
      setSpecialties(res.data.data || []);
    } catch (err) {
      setSpecialties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchDetail = async (id) => {
    setDetailLoading(true);
    try {
      const res = await specialtyApi.getSpecialtyById(id);
      setDetail(res.data.data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCardClick = async (id) => {
    setSelectedId(id);
    setModalOpen(true);
    setEditMode(false);
    await fetchDetail(id);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedId(null);
    setDetail(null);
    setEditMode(false);
    form.resetFields();
  };

  const handleEdit = () => {
    setEditMode(true);
    form.setFieldsValue({
      name: detail.name,
      description: detail.description,
    });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      await specialtyApi.updateSpecialty({
        id: detail.id,
        name: values.name,
        description: values.description,
      });
      message.success('Cập nhật chuyên khoa thành công!');
      setEditMode(false);
      await fetchSpecialties();
      await fetchDetail(detail.id);
    } catch (err) {
      message.error('Cập nhật thất bại!');
    } finally {
      setSaving(false);
    }
  };

  const handleAddClick = () => {
    setAddModalOpen(true);
    addForm.resetFields();
  };

  const handleAddCancel = () => {
    setAddModalOpen(false);
    addForm.resetFields();
  };

  const handleAddSubmit = async () => {
    try {
      const values = await addForm.validateFields();
      setAdding(true);
      await specialtyApi.createSpecialty({
        name: values.name,
        description: values.description,
      });
      message.success('Thêm chuyên khoa thành công!');
      setAddModalOpen(false);
      addForm.resetFields();
      await fetchSpecialties();
    } catch (err) {
      message.error('Thêm chuyên khoa thất bại!');
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = () => {
    if (!detail) return;
    Modal.confirm({
      title: 'Xác nhận xóa chuyên khoa',
      content: `Bạn có chắc chắn muốn xóa chuyên khoa "${detail.name}" (ID: ${detail.id})? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      centered: true,
      onOk: async () => {
        try {
          await specialtyApi.deleteSpecialty(detail.id);
          message.success('Xóa chuyên khoa thành công!');
          setModalOpen(false);
          setDetail(null);
          await fetchSpecialties();
        } catch (err) {
          message.error('Xóa chuyên khoa thất bại!');
        }
      },
    });
  };

  return (
    <div style={{ padding: 32, background: '#f7f8fa', minHeight: '100vh' }}>
      <Title level={2} style={{ marginBottom: 16, textAlign: 'left', letterSpacing: 1 }}>Quản lý chuyên khoa</Title>
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 32 }}>
        <Button type="primary" size="large" style={{ fontWeight: 600, letterSpacing: 1 }} onClick={handleAddClick}>
          Thêm chuyên khoa
        </Button>
      </div>
      {loading ? (
        <Spin size="large" style={{ display: 'block', margin: '60px auto' }} />
      ) : specialties.length === 0 ? (
        <Empty description="Không có chuyên khoa nào" style={{ marginTop: 60 }} />
      ) : (
        <Row gutter={[32, 32]} justify="center">
          {specialties.map((specialty) => (
            <Col xs={24} sm={12} md={8} lg={6} key={specialty.id}>
              <Card
                hoverable
                style={cardStyle}
                bodyStyle={cardBodyStyle}
                onClick={() => handleCardClick(specialty.id)}
                onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 24px #d6e4ff'}
                onMouseOut={e => e.currentTarget.style.boxShadow = cardStyle.boxShadow}
              >
                <Title level={4} style={{ marginBottom: 10, color: '#1677ff', textAlign: 'center', fontWeight: 700 }}>{specialty.name}</Title>
                <Text style={{ display: 'block', textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 4 }}>ID: {specialty.id}</Text>
                <Divider style={{ margin: '12px 0' }} />
                <Text type="secondary" style={{ fontSize: 15, whiteSpace: 'pre-line', textAlign: 'center', display: 'block', minHeight: 60 }}>
                  {specialty.description || 'Không có mô tả.'}
                </Text>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        open={modalOpen}
        onCancel={handleModalClose}
        footer={null}
        centered
        width={480}
        title={<Title level={4} style={{ color: '#1677ff', textAlign: 'center', margin: 0, fontWeight: 700, letterSpacing: 1 }}>Chi tiết chuyên khoa</Title>}
        destroyOnClose
        bodyStyle={{ padding: 32, paddingTop: 16 }}
      >
        {detailLoading ? (
          <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
        ) : detail ? (
          editMode ? (
            <Form
              form={form}
              layout="vertical"
              initialValues={{ name: detail.name, description: detail.description }}
              onFinish={handleSave}
              style={{ marginTop: 12 }}
            >
              <Form.Item label={<b>Tên chuyên khoa</b>} name="name" rules={[{ required: true, message: 'Vui lòng nhập tên chuyên khoa' }]}> 
                <Input size="large" placeholder="Nhập tên chuyên khoa" />
              </Form.Item>
              <Form.Item label={<b>Mô tả</b>} name="description">
                <Input.TextArea rows={4} placeholder="Nhập mô tả chuyên khoa" />
              </Form.Item>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" loading={saving} block size="large" style={{ fontWeight: 600, letterSpacing: 1 }}>Cập nhật</Button>
                <Button onClick={() => setEditMode(false)} block size="large" style={{ marginTop: 10 }}>Hủy</Button>
              </Form.Item>
            </Form>
          ) : (
            <>
              <Title level={4} style={{ color: '#1677ff', textAlign: 'center', fontWeight: 700 }}>{detail.name}</Title>
              <Text style={{ display: 'block', textAlign: 'center', color: '#888', fontSize: 13, marginBottom: 4 }}>ID: {detail.id}</Text>
              <Divider style={{ margin: '16px 0' }} />
              <Text style={{ fontSize: 16, whiteSpace: 'pre-line', display: 'block', textAlign: 'center', minHeight: 60 }}>{detail.description}</Text>
              <div style={{ marginTop: 32, textAlign: 'center', display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Button type="primary" onClick={handleEdit} size="large" style={{ fontWeight: 600, letterSpacing: 1, minWidth: 100 }}>Sửa</Button>
                <Button danger onClick={handleDelete} size="large" style={{ fontWeight: 600, minWidth: 100 }}>Xóa</Button>
              </div>
            </>
          )
        ) : (
          <Text type="danger">Không thể tải chi tiết chuyên khoa.</Text>
        )}
      </Modal>
      <Modal
        open={addModalOpen}
        onCancel={handleAddCancel}
        footer={null}
        centered
        width={480}
        title={<Title level={4} style={{ color: '#52c41a', textAlign: 'center', margin: 0, fontWeight: 700, letterSpacing: 1 }}>Thêm chuyên khoa mới</Title>}
        destroyOnClose
        bodyStyle={{ padding: 32, paddingTop: 16 }}
      >
        <Form
          form={addForm}
          layout="vertical"
          onFinish={handleAddSubmit}
          style={{ marginTop: 12 }}
        >
          <Form.Item label={<b>Tên chuyên khoa</b>} name="name" rules={[{ required: true, message: 'Vui lòng nhập tên chuyên khoa' }]}> 
            <Input size="large" placeholder="Nhập tên chuyên khoa" />
          </Form.Item>
          <Form.Item label={<b>Mô tả</b>} name="description">
            <Input.TextArea rows={4} placeholder="Nhập mô tả chuyên khoa" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Button type="primary" htmlType="submit" loading={adding} block size="large" style={{ fontWeight: 600, letterSpacing: 1 }}>Thêm mới</Button>
            <Button onClick={handleAddCancel} block size="large" style={{ marginTop: 10 }}>Hủy</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SpecialtyManagement;
