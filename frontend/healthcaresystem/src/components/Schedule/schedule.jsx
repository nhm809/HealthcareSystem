import React, { useEffect, useState } from 'react';
import { Card, Modal, List, Badge, Spin, message, Button, Row, Col, Tooltip, Form, Input, Select, DatePicker, Space, Divider, Table, Tag } from 'antd';
import { CalendarOutlined, RestOutlined, PlusOutlined, ClockCircleOutlined, UserOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { getWeeklySchedule, weeklyOverrideScheduleApi } from '../../services/api';

const { Option } = Select;
const { TextArea } = Input;

const weekdayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];



const Schedule = () => {
     const [weekData, setWeekData] = useState([]);
     const [loading, setLoading] = useState(true);
     const [selectedDate, setSelectedDate] = useState(null);
     const [modalVisible, setModalVisible] = useState(false);
     const [workShifts, setWorkShifts] = useState([]);
     const [offset, setOffset] = useState(0);
     const [registerModalVisible, setRegisterModalVisible] = useState(false);
     const [registerForm] = Form.useForm();
     const [registerLoading, setRegisterLoading] = useState(false);
     const [selectedDayForRegister, setSelectedDayForRegister] = useState(null);
     const [overrideList, setOverrideList] = useState([]);
     const [overrideLoading, setOverrideLoading] = useState(false);
     const [showOverrideList, setShowOverrideList] = useState(false);

     const userId = Cookies.get('userId');

     useEffect(() => {
          if (!userId) return;
          setLoading(true);
          getWeeklySchedule(userId, offset)
               .then(res => {
                    const apiData = res.data || [];
                    console.log('API data:', apiData); // Debug log
                    
                    // Chỉ hiển thị những ngày có lịch làm việc
                    const days = apiData.map(item => ({
                         date: item.date,
                         shifts: item.shifts || []
                    }));
                    
                    // Sắp xếp theo ngày
                    days.sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));
                    
                    setWeekData(days);
               })
               .catch((error) => {
                    console.error('Load schedule error:', error);
                    message.error('Không thể tải lịch tuần');
               })
               .finally(() => setLoading(false));
     }, [userId, offset]);

     // Fetch override registrations
     useEffect(() => {
          if (!userId) return;
          setOverrideLoading(true);
          weeklyOverrideScheduleApi.getOverrideSchedules({ userId })
               .then(res => {
                    setOverrideList(res.data || []);
               })
               .catch(() => setOverrideList([]))
               .finally(() => setOverrideLoading(false));
     }, [userId, registerModalVisible]); // refetch after register

     const onSelect = (date, shifts) => {
          setSelectedDate(date);
          setWorkShifts(shifts);
          setModalVisible(shifts && shifts.length > 0);
     };

     const onRegisterClick = (overrideType) => {
          setSelectedDayForRegister(null);
          setRegisterModalVisible(true);
          registerForm.resetFields();
          registerForm.setFieldsValue({ overrideType });
     };

     const handleRegister = async (values) => {
          if (!userId) {
               message.error('Vui lòng đăng nhập');
               return;
          }

          Modal.confirm({
               title: 'Xác nhận đăng ký',
               content: (
                    <div>
                         Bạn chắc chắn muốn gửi đăng ký <b>{values.overrideType}</b> cho ngày <b>{values.date.format('DD/MM/YYYY')}</b> ca <b>{values.shiftType === 1 ? 'Ca sáng' : 'Ca chiều'}</b>?
                         {values.reason && <div><b>Lý do:</b> {values.reason}</div>}
                    </div>
               ),
               okText: 'Xác nhận',
               cancelText: 'Hủy',
               onOk: async () => {
                    setRegisterLoading(true);
                    try {
                         const registerData = {
                              userId: parseInt(userId),
                              date: values.date.format('YYYY-MM-DD'),
                              overrideType: values.overrideType,
                              reason: values.reason || '',
                              shiftType: values.shiftType
                         };
                         await weeklyOverrideScheduleApi.createOverrideSchedule(registerData);
                         message.success('Đăng ký thành công! Vui lòng chờ Manager duyệt.');
                         setRegisterModalVisible(false);
                         registerForm.resetFields();
                    } catch (error) {
                         console.error('Register error:', error);
                         message.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
                    } finally {
                         setRegisterLoading(false);
                    }
               }
          });
     };

     const getShiftName = (shiftType) => {
          if (shiftType === 1) return 'Ca sáng';
          if (shiftType === 2) return 'Ca chiều';
          return `Ca ${shiftType}`;
     };

     const formatDate = (dateStr) => dayjs(dateStr).format('DD/MM');

     // Table columns for override registrations
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
               render: (type) => (
                    <Tag color={type === 'Làm thêm' ? 'green' : 'red'}>{type}</Tag>
               )
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
               render: (reason) => reason || <span style={{ color: '#aaa' }}>-</span>
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
                    return <Tag color={color}>{status}</Tag>;
               }
          },
     ];

     return (
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, maxWidth: 900, margin: '0 auto', boxShadow: '0 1px 6px #f0f1f2' }}>
               <h2 style={{ marginBottom: 20, textAlign: 'center', fontWeight: 600, fontSize: 24, color: '#222' }}>Lịch làm việc</h2>
               
               {/* Registration buttons */}
               <div style={{ 
                    marginBottom: 24, 
                    display: 'flex', 
                    gap: 12, 
                    justifyContent: 'center',
                    padding: '16px',
                    background: '#f8f9fa',
                    borderRadius: 8,
                    border: '1px solid #e9ecef'
               }}>
                    <Button
                         type="primary"
                         icon={<PlusOutlined />}
                         size="large"
                         style={{ 
                              background: '#52c41a', 
                              borderColor: '#52c41a',
                              height: '40px',
                              padding: '0 20px',
                              fontWeight: 500
                         }}
                         onClick={() => onRegisterClick('Làm thêm')}
                    >
                         Đăng ký làm thêm
                    </Button>
                    <Button
                         danger
                         icon={<RestOutlined />}
                         size="large"
                         style={{ 
                              height: '40px',
                              padding: '0 20px',
                              fontWeight: 500
                         }}
                         onClick={() => onRegisterClick('Nghỉ')}
                    >
                         Đăng ký nghỉ
                    </Button>
               </div>

               <div style={{ marginBottom: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <Button onClick={() => setOffset(offset - 1)} size="middle" icon={<CalendarOutlined />}>Tuần trước</Button>
                    <Button onClick={() => setOffset(0)} size="middle" type="default" disabled={offset === 0} icon={<CalendarOutlined />}>Tuần hiện tại</Button>
                    <Button onClick={() => setOffset(offset + 1)} size="middle" icon={<CalendarOutlined />}>Tuần sau</Button>
               </div>
               {loading ? (
                    <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
               ) : (
                    <Row gutter={8} justify="center" align="middle" style={{ flexWrap: 'wrap', gap: '8px' }}>
                         {weekData.length === 0 && <div>Không có dữ liệu lịch tuần này.</div>}
                         {weekData.map((day) => {
                              const dayOfWeek = dayjs(day.date).day(); // 0=Sunday, 1=Monday, etc.
                              const weekdayName = weekdayNames[dayOfWeek === 0 ? 6 : dayOfWeek - 1]; // Convert to Mon=0, Sun=6
                              
                              return (
                                   <Col key={day.date} style={{ minWidth: 110, display: 'flex', justifyContent: 'center' }}>
                                        <Tooltip title="Có ca làm việc">
                                             <Card
                                                  hoverable
                                                  style={{
                                                       textAlign: 'center',
                                                       marginBottom: 0,
                                                       background: '#fff',
                                                       border: '1.5px solid #91d5ff',
                                                       borderRadius: 10,
                                                       boxShadow: 'none',
                                                       cursor: 'pointer',
                                                       minHeight: 110,
                                                       display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                                       padding: 0,
                                                       transition: 'all 0.3s ease'
                                                  }}
                                                  onClick={() => onSelect(day.date, day.shifts)}
                                                  bodyStyle={{ padding: 10 }}
                                             >
                                                  <div style={{ fontWeight: 500, fontSize: 15, color: '#222', marginBottom: 2 }}>{weekdayName}</div>
                                                  <div style={{ fontSize: 20, fontWeight: 500, color: '#222', marginBottom: 4 }}>{formatDate(day.date)}</div>
                                                  <Badge count={day.shifts.length} style={{ backgroundColor: '#1890ff', fontSize: 12, boxShadow: 'none' }} />
                                             </Card>
                                        </Tooltip>
                                   </Col>
                              );
                         })}
                    </Row>
               )}
               
               {/* Work shifts modal */}
               <Modal
                    title={`Ca làm việc ngày ${selectedDate ? dayjs(selectedDate).format('DD/MM/YYYY') : ''}`}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                    centered
                    bodyStyle={{ borderRadius: 10, padding: 20 }}
               >
                    <List
                         dataSource={workShifts}
                         renderItem={item => (
                              <List.Item style={{ borderRadius: 6, marginBottom: 6, background: '#f6faff', border: '1px solid #e6f7ff' }}>
                                   <div style={{ width: '100%', padding: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                             <ClockCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
                                             <b>Ca:</b> {getShiftName(item.shiftType)}
                                             <span style={{ marginLeft: 8, color: '#666' }}>
                                                  ({item.shiftType === 1 ? '8:00 - 12:00' : '13:00 - 17:00'})
                                             </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                                             <Badge 
                                                  status={item.status === 'Làm việc' ? 'success' : 'default'} 
                                                  text={<b>Trạng thái: {item.status}</b>}
                                             />
                                        </div>
                                        {item.note && (
                                             <div style={{ marginTop: 8, padding: 8, background: '#fffbe6', borderRadius: 4, border: '1px solid #ffe58f' }}>
                                                  <b>Ghi chú:</b> {item.note}
                                             </div>
                                        )}
                                   </div>
                              </List.Item>
                         )}
                         locale={{ emptyText: 'Không có ca làm việc' }}
                    />
               </Modal>

               {/* Register modal */}
               <Modal
                    title={
                         <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <ClockCircleOutlined style={{ color: '#1890ff' }} />
                              <span>Đăng ký lịch làm việc</span>
                         </div>
                    }
                    open={registerModalVisible}
                    onCancel={() => setRegisterModalVisible(false)}
                    footer={null}
                    centered
                    width={500}
                    bodyStyle={{ borderRadius: 10, padding: 20 }}
               >
                    <Form
                         form={registerForm}
                         layout="vertical"
                         onFinish={handleRegister}
                    >
                         <Form.Item
                              label="Ngày đăng ký"
                              name="date"
                              rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
                         >
                              <DatePicker
                                   style={{ width: '100%' }}
                                   format="DD/MM/YYYY"
                                   placeholder="Chọn ngày"
                                   disabledDate={(current) => {
                                        return current && current < dayjs().endOf('day');
                                   }}
                              />
                         </Form.Item>

                         <Form.Item
                              label="Loại đăng ký"
                              name="overrideType"
                              rules={[{ required: true, message: 'Vui lòng chọn loại đăng ký!' }]}
                         >
                              <Select placeholder="Chọn loại đăng ký">
                                   <Option value="Làm thêm">
                                        <Space>
                                             <PlusOutlined style={{ color: '#52c41a' }} />
                                             Làm thêm
                                        </Space>
                                   </Option>
                                   <Option value="Nghỉ">
                                        <Space>
                                             <RestOutlined style={{ color: '#ff4d4f' }} />
                                             Nghỉ
                                        </Space>
                                   </Option>
                              </Select>
                         </Form.Item>

                         <Form.Item
                              label="Ca làm việc"
                              name="shiftType"
                              rules={[{ required: true, message: 'Vui lòng chọn ca!' }]}
                         >
                              <Select placeholder="Chọn ca">
                                   <Option value={1}>Ca sáng</Option>
                                   <Option value={2}>Ca chiều</Option>
                              </Select>
                         </Form.Item>

                         <Form.Item
                              label="Lý do (không bắt buộc)"
                              name="reason"
                         >
                              <TextArea
                                   rows={3}
                                   placeholder="Nhập lý do đăng ký..."
                                   maxLength={200}
                                   showCount
                              />
                         </Form.Item>

                         <Divider />

                         <Form.Item style={{ marginBottom: 0, textAlign: 'center' }}>
                              <Space size="middle">
                                   <Button onClick={() => setRegisterModalVisible(false)}>
                                        Hủy
                                   </Button>
                                   <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={registerLoading}
                                        icon={<UserOutlined />}
                                        style={{ background: '#1890ff', borderColor: '#1890ff' }}
                                   >
                                        Đăng ký
                                   </Button>
                              </Space>
                         </Form.Item>
                    </Form>
               </Modal>

               {/* Toggle button for registration list */}
               <div style={{ marginTop: 40, textAlign: 'center' }}>
                    <Button
                         type="default"
                         icon={showOverrideList ? <UpOutlined /> : <DownOutlined />}
                         onClick={() => setShowOverrideList(v => !v)}
                         style={{ fontWeight: 500, marginBottom: showOverrideList ? 16 : 0 }}
                    >
                         {showOverrideList ? 'Ẩn danh sách đăng ký' : 'Xem danh sách đăng ký làm thêm/nghỉ'}
                    </Button>
               </div>

               {showOverrideList && (
                    <div>
                         <h3 style={{ fontWeight: 600, fontSize: 20, marginBottom: 16, marginTop: 16 }}>Danh sách đăng ký làm thêm/nghỉ</h3>
                         <Table
                              dataSource={overrideList}
                              columns={columns}
                              rowKey="weeklyOverrideScheduleId"
                              loading={overrideLoading}
                              pagination={{ pageSize: 5 }}
                              bordered
                              locale={{ emptyText: 'Chưa có đăng ký nào.' }}
                         />
                    </div>
               )}
          </div>
     );
};

export default Schedule;
