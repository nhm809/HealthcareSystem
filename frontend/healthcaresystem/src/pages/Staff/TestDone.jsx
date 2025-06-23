import React, { useEffect, useState } from 'react';
import { Table, Pagination, Button, Tag, Card, Row, Col, Modal, Form, Select, Input, message, Upload } from 'antd';
import { getTestServiceRecordsByStaff, updateTestResult } from '../../services/api';
import Cookies from 'js-cookie';
import { UploadOutlined } from '@ant-design/icons';

const statusMap = {
     'Dang cho kham': { color: 'gold', icon: '⏳', text: 'Đang chờ khám' },
     'In Progress': { color: 'blue', icon: '•', text: 'Đang phân tích' },
     'Completed': { color: 'green', icon: '✔', text: 'Đã hoàn thành' },
     'Cancelled': { color: 'red', icon: '✖', text: 'Đã huỷ' },
};

const statusOptions = [
     { value: 'Dang cho kham', label: 'Đang chờ khám' },
     { value: 'In Progress', label: 'Đang phân tích' },
     { value: 'Completed', label: 'Đã hoàn thành' },
     { value: 'Cancelled', label: 'Đã huỷ' },
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

     // Thêm cột Detail vào cuối bảng
     const columns = [
          ...columnsBase,
          {
               title: 'Chi tiết',
               key: 'detail',
               render: (_, record) => (
                    <Button type="primary" onClick={() => {
                         setSelectedTest(record);
                         setModalOpen(true);
                         form.setFieldsValue({ status: record.status, notes: record.notes });
                    }}>
                         Detail
                    </Button>
               ),
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
               // Sau khi cập nhật, nên reload lại dữ liệu
               setTimeout(() => window.location.reload(), 500);
          } catch {
               message.error('Cập nhật trạng thái thất bại!');
          }
     };

     return (
          <Row gutter={32}>
               <Col span={24}>
                    <h2 style={{ fontWeight: 700, fontSize: 26, margin: '16px 0' }}>Các xét nghiệm đã hoàn thành</h2>
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
                                   total={data.length}
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
                    {/* Modal chi tiết test */}
                    <Modal
                         open={modalOpen}
                         onCancel={() => setModalOpen(false)}
                         title="Chi tiết xét nghiệm"
                         footer={null}
                         width={500}
                    >
                         {selectedTest && (
                              <div>
                                   <div style={{ marginBottom: 16 }}>
                                        <div><b>Tên khách hàng:</b> {selectedTest.fullNameOfMember}</div>
                                        <div><b>Giới tính:</b> {selectedTest.gender}</div>
                                        <div><b>Số điện thoại:</b> {selectedTest.phoneNumber}</div>
                                        <div><b>Ngày sinh:</b> {selectedTest.dob}</div>
                                        <div><b>Ngày đăng ký:</b> {new Date(selectedTest.recordDate).toLocaleString('vi-VN')}</div>
                                        <div><b>Ngày xét nghiệm:</b> {selectedTest.testDate || '-'}</div>
                                        <div><b>Mã xét nghiệm:</b> {selectedTest.testServiceRecordId}</div>
                                        <div><b>Nhân viên phụ trách:</b> Bạn</div>
                                   </div>
                                   <div style={{ marginBottom: 24 }}>
                                        <b>Tiến trình xét nghiệm:</b>
                                        <Form form={form} layout="vertical" onFinish={handleUpdateStatus} style={{ marginTop: 12 }}>
                                             <Form.Item name="status" label="Trạng thái">
                                                  <Select options={statusOptions} />
                                             </Form.Item>
                                             <Form.Item name="notes" label="Ghi chú nội bộ">
                                                  <Input.TextArea placeholder="Thêm ghi chú hoặc comment cho nội bộ..." />
                                             </Form.Item>
                                             <Form.Item>
                                                  <Button type="primary" htmlType="submit">Cập nhật trạng thái</Button>
                                             </Form.Item>
                                        </Form>
                                   </div>
                                   <div>
                                        <b>Kết quả xét nghiệm:</b>
                                        <div style={{ margin: '8px 0 16px 0', minHeight: 32 }}>
                                             {selectedTest.result && selectedTest.result.startsWith('http') ? (
                                                  <img src={selectedTest.result} alt="Kết quả xét nghiệm" style={{ maxWidth: '100%', maxHeight: 200, marginBottom: 8 }} />
                                             ) : (
                                                  selectedTest.result || 'Chưa có kết quả'
                                             )}
                                             <Upload
                                                  name="result"
                                                  showUploadList={false}
                                                  accept=".jpg,.jpeg,.png"
                                                  customRequest={async ({ file, onSuccess, onError }) => {
                                                       setUploadingResult(true);
                                                       try {
                                                            const url = await uploadToCloudinary(file);
                                                            setSelectedTest(prev => ({ ...prev, result: url }));
                                                            message.success('Tải ảnh kết quả lên thành công!');
                                                            onSuccess();
                                                       } catch (err) {
                                                            message.error('Tải ảnh lên thất bại!');
                                                            onError(err);
                                                       } finally {
                                                            setUploadingResult(false);
                                                       }
                                                  }}
                                             >
                                                  <Button icon={<UploadOutlined />} loading={uploadingResult} style={{ marginTop: 8 }}>
                                                       Tải ảnh kết quả lên
                                                  </Button>
                                             </Upload>
                                        </div>
                                   </div>
                              </div>
                         )}
                    </Modal>
               </Col>
          </Row>
     );
};

export default StaffSchedule; 