import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Collapse, theme, Modal, Form, Input, DatePicker, Radio, message } from 'antd';
import MainLayout from '@components/Layout/Layout';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CaretRightOutlined, CalendarOutlined } from '@ant-design/icons';
import './TestSti.css';
import { useState, useEffect, useRef } from 'react';
import { notiApi } from '../../services/api';
import Cookies from 'js-cookie';
import AuthModal from '../../components/Header/AuthModal/AuthModal';
import ConfirmTestModal from './ConfirmTestModal';

function TestSti() {
     const navigate = useNavigate();
     const location = useLocation();
     const notiSentRef = useRef({});

     // get token from Ant
     const { token } = theme.useToken(); 

     const [isModalOpen, setIsModalOpen] = useState(false);
     const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
     const [form] = Form.useForm();
     const [loading, setLoading] = useState(false);
     const userId = Cookies.get('userId');
     const [authModalOpen, setAuthModalOpen] = useState(false);
     const [defaultTab, setDefaultTab] = useState(0);
     const [formData, setFormData] = useState(null);
     

     const panelStyle = {
          marginBottom: 24,
          background: token.colorFillAlter,
          borderRadius: token.borderRadiusLG,
          border: 'none',
     };

     const items = [
          {
               key: '1',
               label: 'Xét nghiệm STIs là gì?',
               children: <p>Xét nghiệm STIs (các bệnh lây qua đường tình dục) giúp phát hiện sớm các bệnh như HIV, lậu, giang mai, chlamydia,... thông qua mẫu máu, nước tiểu hoặc dịch sinh dục. Việc xét nghiệm định kỳ rất quan trọng, kể cả khi không có triệu chứng, nhằm bảo vệ sức khỏe bản thân và cộng đồng.</p>,
               style: panelStyle,
          },
          {
               key: '2',
               label: 'Đối tượng cần xét nghiệm STIs?',
               children: <ul>
                    <li>Người đã từng quan hệ tình dục không an toàn</li>
                    <li>Người có nhiều bạn tình hoặc bạn tình mới</li>
                    <li>Phụ nữ mang thai</li>
                    <li>Người có triệu chứng nghi ngờ (dịch bất thường, ngứa, đau khi tiểu, mụn vùng kín,...)</li>
                    <li>Người từng mắc STIs hoặc có bạn tình mắc STIs</li>
                    <li>Nam quan hệ tình dục đồng giới (MSM)</li>
                    <li>Người sử dụng chung kim tiêm</li>
               </ul>,
               style: panelStyle,
          },
     ];

     const handleOpenModal = () => {
          if (!userId) {
               setDefaultTab(0);
               setAuthModalOpen(true);
               return;
          }
          setIsModalOpen(true);
     };
     const handleCancel = () => {
          setIsModalOpen(false);
          form.resetFields();
     };
     
     const handleFinish = async (values) => {
          setFormData(values);
          setIsModalOpen(false);
          setIsConfirmModalOpen(true);
     };

     // Tạo notification nếu thanh toán thành công
     useEffect(() => {
          const params = new URLSearchParams(location.search);
          const handler = params.get('handler');
          const testServiceRecordId = params.get('testServiceRecordId');
          const userId = Cookies.get('userId');
          if (handler === 'success' && testServiceRecordId && userId) {
               const sentKey = `noti_sent_${testServiceRecordId}`;
               if (!sessionStorage.getItem(sentKey) && !notiSentRef.current[sentKey]) {
                    notiSentRef.current[sentKey] = true; // Đánh dấu đã gửi trong phiên này
                    const now = new Date().toISOString();
                    notiApi.createNoti({
                         userId: Number(userId),
                         title: 'Đặt lịch xét nghiệm thành công',
                         content: `Bạn đã đặt lịch xét nghiệm thành công. Mã phiếu: ${testServiceRecordId}`,
                         sendTime: now,
                         isRead: false
                    }).finally(() => {
                         sessionStorage.setItem(sentKey, '1');
                         window.history.replaceState({}, document.title, '/test-sti');
                    });
               } else {
                    window.history.replaceState({}, document.title, '/test-sti');
               }
          }
     }, [location]);

     return (
          <MainLayout>
               <div className="test-introduce">
                    <div className="test-introduce-left">
                         <div className="test-title">
                              Gói xét nghiệm Bệnh lây qua đường tình dục (STIs)
                         </div>

                         <p>
                              Phát hiện sớm các bệnh lây truyền qua đường tình dục (STIs) với gói xét nghiệm toàn diện,
                              bảo mật và nhanh chóng. An tâm chăm sóc sức khỏe sinh sản của bạn!
                         </p>

                         <li><FontAwesomeIcon icon={faCheck} className="tick" /> Phát hiện nhiều loại STIs phổ biến: HIV, lậu, giang mai,...</li>
                         <li><FontAwesomeIcon icon={faCheck} className="tick" /> Lấy mẫu nhanh kín đáo tại phòng.</li>
                         <li><FontAwesomeIcon icon={faCheck} className="tick" /> Kết quả được trả về bảo mật nhất.</li>
                         <li><FontAwesomeIcon icon={faCheck} className="tick" /> Hỗ trợ đặt lịch giải đáp thắc mắc miễn phí.</li>

                         <Button type="primary" className="book-test-btn" onClick={() => navigate('/question')}>
                              Đặt câu hỏi về STIs
                         </Button>
                    </div>

                    <div className="test-introduce-right">
                         <img
                              src="https://cdn-media.sforum.vn/storage/app/media/anh-dep-68.jpg"
                              alt="STI test"
                              style={{ width: '100%', borderRadius: '10px' }}
                         />
                    </div>
               </div>

               <div style={{ marginTop: 40 }}>
                    <h2 style={{ color: '#54AA7F', marginBottom: 16 }}>Câu hỏi thường gặp</h2>
                    <Collapse
                         bordered={false}
                         defaultActiveKey={[]}
                         expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                         style={{ background: token.colorBgContainer }}
                         items={items}
                    />
               </div>

               <div className="test-register">
                    <p>Gói xét nghiệm STIs toàn diện chỉ với 450,000đ</p>

                    <Button type="primary" style={{ margin: '20px' }} className="book-test-btn" onClick={handleOpenModal}>
                         <CalendarOutlined />
                         Đặt lịch ngay
                    </Button>
                    <Modal
                         className="register-test-form"
                         open={isModalOpen}
                         onCancel={handleCancel}
                         footer={null}
                         centered
                         destroyOnClose                       
                    >
                         <div className="modal-title">
                              <div className="modal-title-text">Thông tin đăng ký</div>
                         </div>
                         <Form
                              form={form}
                              layout="vertical"
                              onFinish={handleFinish}
                         >
                              <Form.Item
                                   label="Họ và tên"
                                   name="fullName"
                                   rules={[
                                        { required: true, message: 'Vui lòng nhập họ và tên' },
                                        { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' }
                                   ]}
                              >
                                   <Input placeholder="Nhập họ và tên" />
                              </Form.Item>
                              <Form.Item
                                   label="Ngày sinh"
                                   name="dob"
                                   rules={[
                                        { required: true, message: 'Vui lòng chọn ngày sinh' },
                                        {
                                             validator: (_, value) => {
                                                  if (value) {
                                                       const today = new Date();
                                                       const birthDate = value.toDate();
                                                       if (birthDate >= today) {
                                                            return Promise.reject('Ngày sinh không được trong tương lai');
                                                       }
                                                       const age = today.getFullYear() - birthDate.getFullYear();
                                                       if (age < 18) {
                                                            return Promise.reject('Bạn phải từ 18 tuổi trở lên');
                                                       }
                                                       if (age > 100) {
                                                            return Promise.reject('Ngày sinh không hợp lệ');
                                                       }
                                                  }
                                                  return Promise.resolve();
                                             }
                                        }
                                   ]}
                              >
                                   <DatePicker 
                                        format="DD/MM/YYYY" 
                                        style={{ width: '100%' }} 
                                        placeholder="dd/mm/yyyy"
                                        disabledDate={(current) => {
                                             return current && current >= new Date();
                                        }}
                                   />
                              </Form.Item>
                              <Form.Item
                                   label="Giới tính"
                                   name="gender"
                                   rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                              >
                                   <Radio.Group>
                                        <Radio value="Nam">Nam</Radio>
                                        <Radio value="Nữ">Nữ</Radio>
                                        <Radio value="Khác">Khác</Radio>
                                   </Radio.Group>
                              </Form.Item>
                              <Form.Item
                                   label="Số điện thoại"
                                   name="phone"
                                   rules={[
                                        { required: true, message: 'Vui lòng nhập số điện thoại' },
                                        { pattern: /^0\d{9}$/, message: 'Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số' }
                                   ]}
                              >
                                   <Input placeholder="Nhập số điện thoại" />
                              </Form.Item>
                              <Form.Item
                                   label="Ngày lấy mẫu"
                                   name="testDate"
                                   rules={[
                                        { required: true, message: 'Vui lòng chọn ngày lấy mẫu' },
                                        {
                                             validator: (_, value) => {
                                                  if (value) {
                                                       const today = new Date();
                                                       today.setHours(0, 0, 0, 0);
                                                       const selectedDate = value.toDate();
                                                       selectedDate.setHours(0, 0, 0, 0);
                                                       
                                                       if (selectedDate <= today) {
                                                            return Promise.reject('Ngày lấy mẫu phải sau ngày hiện tại');
                                                       }
                                                  }
                                                  return Promise.resolve();
                                             }
                                        }
                                   ]}
                              >
                                   <DatePicker 
                                        format="DD/MM/YYYY" 
                                        style={{ width: '100%' }} 
                                        placeholder="dd/mm/yyyy"
                                        disabledDate={(current) => {
                                             return current && current <= new Date();
                                        }}
                                   />
                              </Form.Item>
                              <div className="button-register">
                                   <Button onClick={handleCancel}>Hủy</Button>
                                   <Button type="primary" htmlType="submit" loading={loading} style={{ minWidth: 100 }}>
                                        Tiếp tục
                                   </Button>
                              </div>
                         </Form>
                    </Modal>
               </div>

               <ConfirmTestModal 
                    open={isConfirmModalOpen}
                    onClose={() => setIsConfirmModalOpen(false)}
                    formData={formData}
                    userId={userId}
               />

               <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={defaultTab} />

               <div style={{height: 150}}></div>
          </MainLayout>
     );
}

export default TestSti;
