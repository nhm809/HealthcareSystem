import React, { useEffect, useState } from 'react';
import { List, Card, Typography, Spin, Row, Col, Modal, Form, Input, InputNumber, Button, message } from 'antd';
import axios from 'axios';
import api from '../../services/api';

const { Title, Text } = Typography;

function ServiceManagement() {
     const [services, setServices] = useState([]);
     const [loading, setLoading] = useState(true);
     const [selectedService, setSelectedService] = useState(null);
     const [modalOpen, setModalOpen] = useState(false);
     const [form] = Form.useForm();
     const [saving, setSaving] = useState(false);

     useEffect(() => {
          fetchServices();
     }, []);

     const fetchServices = () => {
          setLoading(true);
          api.get('/Service')
               .then(res => {
                    setServices(res.data);
               })
               .catch(err => {
                    setServices([]);
               })
               .finally(() => setLoading(false));
     };

     const handleCardClick = (service) => {
          setSelectedService(service);
          form.setFieldsValue({
               name: service.name,
               description: service.description,
               price: service.price,
          });
          setModalOpen(true);
     };

     const handleModalCancel = () => {
          setModalOpen(false);
          setSelectedService(null);
          form.resetFields();
     };

     const handleSave = async () => {
          try {
               const values = await form.validateFields();
               // So sánh với selectedService, chỉ lấy các trường đã thay đổi
               const changedFields = {};
               if (values.name !== selectedService.name) changedFields.name = values.name;
               if (values.description !== selectedService.description) changedFields.description = values.description;
               if (values.price !== selectedService.price) changedFields.price = values.price;
               if (Object.keys(changedFields).length === 0) {
                    message.info('Không có thay đổi nào để cập nhật.');
                    return;
               }
               Modal.confirm({
                    title: 'Xác nhận thay đổi',
                    content: 'Bạn có chắc chắn muốn thay đổi dịch vụ này không?',
                    okText: 'Xác nhận',
                    cancelText: 'Hủy',
                    onOk: async () => {
                         setSaving(true);
                         const payload = {
                              name: changedFields.name !== undefined ? changedFields.name : selectedService.name,
                              description: changedFields.description !== undefined ? changedFields.description : selectedService.description,
                              price: changedFields.price !== undefined ? changedFields.price : selectedService.price,
                         };
                         console.log('Update service payload:', payload);
                         try {
                              await api.put(`/Service/${selectedService.serviceId}`, payload, {
                                   headers: { 'Content-Type': 'application/json' }
                              });
                              message.success('Cập nhật dịch vụ thành công!');
                              setModalOpen(false);
                              setSelectedService(null);
                              fetchServices();
                         } catch (err) {
                              message.error('Cập nhật thất bại!');
                         } finally {
                              setSaving(false);
                         }
                    }
               });
          } catch (err) {
               message.error('Cập nhật thất bại!');
          }
     };

     return (
          <div style={{ padding: 24 }}>
               <Title level={2} style={{ marginBottom: 24 }}>Quản lý dịch vụ</Title>
               {loading ? (
                    <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
               ) : (
                    <Row gutter={[24, 24]}>
                         {services.map(service => (
                              <Col xs={24} sm={12} md={8} lg={6} key={service.serviceId}>
                                   <Card hoverable style={{ borderRadius: 12, minHeight: 180 }} onClick={() => handleCardClick(service)}>
                                        <Title level={4} style={{ marginBottom: 8 }}>{service.name}</Title>
                                        <Text strong>Giá: </Text>
                                        <Text type="danger" style={{ fontSize: 16 }}>{service.price?.toLocaleString()} đ</Text>
                                        <div style={{ marginTop: 12 }}>
                                             <Text type="secondary">
                                                  {service.description || 'Không có mô tả.'}
                                             </Text>
                                        </div>
                                   </Card>
                              </Col>
                         ))}
                    </Row>
               )}
               <Modal
                    open={modalOpen}
                    title={<span style={{ color: '#000', fontWeight: 600 }}>Chi tiết dịch vụ</span>}
                    onCancel={handleModalCancel}
                    footer={null}
                    destroyOnClose
                    closeIcon={<span style={{ color: '#000', fontSize: 20 }}>&times;</span>}
               >
                    <Form
                         form={form}
                         layout="vertical"
                         initialValues={selectedService ? {
                              name: selectedService.name,
                              description: selectedService.description,
                              price: selectedService.price,
                         } : {}}
                         onFinish={handleSave}
                    >
                         <Form.Item label="Tên dịch vụ" name="name">
                              <Input />
                         </Form.Item>
                         <Form.Item label="Mô tả" name="description">
                              <Input.TextArea rows={3} />
                         </Form.Item>
                         <Form.Item label="Giá" name="price" rules={[{ validator: (_, value) => (value !== undefined && value !== null && value !== '') ? Promise.resolve() : Promise.reject('Vui lòng nhập giá') }]}>
                              <InputNumber min={0.01} style={{ width: '100%' }} step={1000} formatter={v => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                         </Form.Item>
                         <Form.Item>
                              <Button type="primary" htmlType="submit" loading={saving} block>Cập nhật</Button>
                         </Form.Item>
                    </Form>
               </Modal>
          </div>
     );
}

export default ServiceManagement;