import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Collapse, theme, Modal, Form, Input, DatePicker, Radio, message } from 'antd';
import MainLayout from '@components/Layout/Layout';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CaretRightOutlined, CalendarOutlined } from '@ant-design/icons';
import './TestSti.css';
import { useState, useEffect, useRef } from 'react';
import { notiApi, authApi } from '../../services/api';
import Cookies from 'js-cookie';
import AuthModal from '../../components/Header/AuthModal/AuthModal';
import ConfirmTestModal from './ConfirmTestModal';
import TestBanner from '../../assets/imgs/testbanner.jpg';

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
     const [workShifts, setWorkShifts] = useState([]);
     const [shiftsLoading, setShiftsLoading] = useState(false);
     const [selectedDate, setSelectedDate] = useState(null);
     const [isFromHistory, setIsFromHistory] = useState(false);
     const [existingTestRecord, setExistingTestRecord] = useState(null);
     

     const panelStyle = {
          marginBottom: 24,
          background: token.colorFillAlter,
          borderRadius: token.borderRadiusLG,
          border: 'none',
     };

     // Kiểm tra xem có phải từ lịch sử xét nghiệm không
     useEffect(() => {
          if (location.state?.isFromHistory) {
               setIsFromHistory(true);
               setExistingTestRecord({
                    testRecordId: location.state.testRecordId,
                    serviceName: location.state.serviceName,
                    amount: location.state.amount
               });
               // Tự động mở modal thanh toán
               if (userId) {
                    setIsModalOpen(true);
               } else {
                    setDefaultTab(0);
                    setAuthModalOpen(true);
               }
          }
     }, [location.state, userId]);

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

     // Hàm lấy work shifts cho ngày được chọn
     const fetchWorkShifts = async (date) => {
          if (!date) return;
          
          setShiftsLoading(true);
          try {
               const formattedDate = date.format('YYYY-MM-DD');
               const response = await authApi.getWorkShifts(formattedDate);
               setWorkShifts(response.data);
               setSelectedDate(date);
          } catch (error) {
               console.error('Error fetching work shifts:', error);
               message.error('Không thể tải thông tin ca làm việc. Vui lòng thử lại!');
               setWorkShifts([]);
          } finally {
               setShiftsLoading(false);
          }
     };

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
          setWorkShifts([]);
          setSelectedDate(null);
          // Nếu từ lịch sử, quay lại trang lịch sử
          if (isFromHistory) {
               navigate('/test-history');
          }
     };
     
     const handleFinish = async (values) => {
          try {
               // Validation bổ sung trước khi submit
               if (!values.fullName || !values.dob || !values.gender || !values.phone || !values.testDate) {
                    message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
                    return;
               }
               
               // Kiểm tra nếu đã chọn ngày nhưng chưa chọn ca làm việc
               if (values.testDate && !values.shift) {
                    message.error('Vui lòng chọn ca làm việc cho ngày đã chọn');
                    return;
               }
               
               // Kiểm tra xem có ca làm việc khả dụng không
               if (values.shift && workShifts.length > 0) {
                    const selectedShift = workShifts.find(shift => shift.shiftId === values.shift);
                    if (!selectedShift || !selectedShift.isAvailable) {
                         message.error('Ca làm việc đã chọn không khả dụng. Vui lòng chọn ca khác');
                         return;
                    }
               }
               
               setFormData({
                    ...values,
                    isFromHistory,
                    existingTestRecord
               });
               setIsModalOpen(false);
               setIsConfirmModalOpen(true);
          } catch (error) {
               console.error('Error in form validation:', error);
               message.error('Có lỗi xảy ra. Vui lòng thử lại');
          }
     };

     // Hàm xử lý khi đóng modal xác nhận
     const handleConfirmModalClose = () => {
          setIsConfirmModalOpen(false);
          // Mở lại modal đăng ký thông tin
          setIsModalOpen(true);
     };

     // Xử lý khi ngày lấy mẫu thay đổi
     const handleTestDateChange = (date) => {
          form.setFieldsValue({ shift: undefined }); // Reset shift selection
          if (date) {
               fetchWorkShifts(date);
          } else {
               setWorkShifts([]);
               setSelectedDate(null);
          }
     };
     
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
                              src={TestBanner}
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
                    <p>Gói xét nghiệm STIs toàn diện chỉ với 1,000,000đ</p>

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
                              <div className="modal-title-text">
                                   {isFromHistory ? 'Thanh toán xét nghiệm' : 'Thông tin đăng ký'}
                              </div>
                              {isFromHistory && existingTestRecord && (
                                   <div style={{ 
                                        marginTop: '8px', 
                                        padding: '8px 12px', 
                                        backgroundColor: '#f6ffed', 
                                        border: '1px solid #b7eb8f',
                                        borderRadius: '4px',
                                        fontSize: '14px'
                                   }}>
                                        <strong>Dịch vụ:</strong> {existingTestRecord.serviceName} - 
                                        <strong> Số tiền:</strong> {existingTestRecord.amount?.toLocaleString()}đ
                                   </div>
                              )}
                         </div>
                         <Form
                              form={form}
                              layout="vertical"
                              onFinish={handleFinish}
                              validateTrigger={['onBlur', 'onChange']}
                              scrollToFirstError={true}
                         >
                              <Form.Item
                                   label="Họ và tên"
                                   name="fullName"
                                   rules={[
                                        { required: true, message: 'Vui lòng nhập họ và tên' },
                                        { min: 2, message: 'Họ và tên phải có ít nhất 2 ký tự' },
                                        { max: 50, message: 'Họ và tên không được quá 50 ký tự' },
                                        {
                                             pattern: /^[a-zA-ZÀ-ỹ\s]+$/,
                                             message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng'
                                        },
                                        {
                                             validator: (_, value) => {
                                                  if (value) {
                                                       const trimmedValue = value.trim();
                                                       if (trimmedValue.length < 2) {
                                                            return Promise.reject('Họ và tên phải có ít nhất 2 ký tự sau khi loại bỏ khoảng trắng');
                                                       }
                                                       if (trimmedValue.split(' ').length < 2) {
                                                            return Promise.reject('Vui lòng nhập đầy đủ họ và tên');
                                                       }
                                                  }
                                                  return Promise.resolve();
                                             }
                                        }
                                   ]}
                              >
                                   <Input 
                                        placeholder="Nhập họ và tên" 
                                        maxLength={50}
                                   />
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
                                                       
                                                       // Kiểm tra ngày sinh không được trong tương lai
                                                       if (birthDate >= today) {
                                                            return Promise.reject('Ngày sinh không được trong tương lai');
                                                       }
                                                       
                                                       // Tính tuổi chính xác
                                                       const age = today.getFullYear() - birthDate.getFullYear();
                                                       const monthDiff = today.getMonth() - birthDate.getMonth();
                                                       
                                                       let actualAge = age;
                                                       if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                                                            actualAge--;
                                                       }
                                                       
                                                       // Kiểm tra tuổi tối thiểu
                                                       if (actualAge < 18) {
                                                            return Promise.reject('Bạn phải từ 18 tuổi trở lên để sử dụng dịch vụ này');
                                                       }
                                                       
                                                       // Kiểm tra tuổi tối đa
                                                       if (actualAge > 100) {
                                                            return Promise.reject('Ngày sinh không hợp lệ. Vui lòng kiểm tra lại');
                                                       }
                                                       
                                                       // Kiểm tra ngày sinh không quá xa trong quá khứ
                                                       const minBirthDate = new Date();
                                                       minBirthDate.setFullYear(today.getFullYear() - 100);
                                                       if (birthDate < minBirthDate) {
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
                                             const today = new Date();
                                             const minDate = new Date();
                                             minDate.setFullYear(today.getFullYear() - 100);
                                             return current && (current >= today || current < minDate);
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
                                        { 
                                             pattern: /^0\d{9}$/, 
                                             message: 'Số điện thoại phải bắt đầu bằng số 0 và có 10 chữ số' 
                                        },
                                        {
                                             validator: (_, value) => {
                                                  if (value) {
                                                       // Loại bỏ khoảng trắng và ký tự đặc biệt
                                                       const cleanPhone = value.replace(/\s+/g, '');
                                                       
                                                       // Kiểm tra độ dài
                                                       if (cleanPhone.length !== 10) {
                                                            return Promise.reject('Số điện thoại phải có đúng 10 chữ số');
                                                       }
                                                       
                                                       // Kiểm tra bắt đầu bằng 0
                                                       if (!cleanPhone.startsWith('0')) {
                                                            return Promise.reject('Số điện thoại phải bắt đầu bằng số 0');
                                                       }
                                                       
                                                       // Kiểm tra chỉ chứa số
                                                       if (!/^\d+$/.test(cleanPhone)) {
                                                            return Promise.reject('Số điện thoại chỉ được chứa chữ số');
                                                       }
                                                       
                                                       // Kiểm tra các đầu số phổ biến của Việt Nam
                                                       const validPrefixes = ['03', '05', '07', '08', '09'];
                                                       const prefix = cleanPhone.substring(0, 2);
                                                       if (!validPrefixes.includes(prefix)) {
                                                            return Promise.reject('Số điện thoại không hợp lệ. Vui lòng kiểm tra lại');
                                                       }
                                                  }
                                                  return Promise.resolve();
                                             }
                                        }
                                   ]}
                              >
                                   <Input 
                                        placeholder="Nhập số điện thoại" 
                                        maxLength={15}
                                        onBlur={(e) => {
                                             // Tự động format số điện thoại
                                             const value = e.target.value.replace(/\s+/g, '');
                                             if (value.length === 10 && /^0\d{9}$/.test(value)) {
                                                  const formatted = value.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
                                                  e.target.value = formatted;
                                             }
                                        }}
                                   />
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
                                                       // Chỉ cho phép chọn trong 14 ngày tới
                                                       const maxDate = new Date();
                                                       maxDate.setDate(today.getDate() + 14);
                                                       if (selectedDate <= today) {
                                                            return Promise.reject('Ngày lấy mẫu phải sau ngày hiện tại');
                                                       }
                                                       if (selectedDate > maxDate) {
                                                            return Promise.reject('Chỉ được đặt lịch trong vòng 14 ngày tới');
                                                       }
                                                       // Không cho chọn cuối tuần
                                                       const dayOfWeek = selectedDate.getDay();
                                                       if (dayOfWeek === 0 || dayOfWeek === 6) {
                                                            return Promise.reject('Ngày lấy mẫu không được chọn vào cuối tuần');
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
                                             const today = new Date();
                                             today.setHours(0, 0, 0, 0);
                                             const maxDate = new Date();
                                             maxDate.setDate(today.getDate() + 14);
                                             // Disable ngày hôm nay và trước đó, ngày sau 14 ngày, và cuối tuần
                                             return current && (
                                                  current <= today || 
                                                  current > maxDate ||
                                                  current.day() === 0 || 
                                                  current.day() === 6
                                             );
                                        }}
                                        onChange={handleTestDateChange}
                                   />
                              </Form.Item>
                              
                              {/* Hiển thị ca làm việc khi đã chọn ngày */}
                              {selectedDate && (
                                   <Form.Item
                                        label="Ca làm việc"
                                        name="shift"
                                        rules={[
                                             { required: true, message: 'Vui lòng chọn ca làm việc' },
                                             {
                                                  validator: (_, value) => {
                                                       if (value && workShifts.length > 0) {
                                                            const selectedShift = workShifts.find(shift => shift.shiftId === value);
                                                            if (selectedShift && !selectedShift.isAvailable) {
                                                                 return Promise.reject('Ca làm việc này đã hết chỗ. Vui lòng chọn ca khác');
                                                            }
                                                       }
                                                       return Promise.resolve();
                                                  }
                                             }
                                        ]}
                                   >
                                        <Radio.Group disabled={shiftsLoading}>
                                             {shiftsLoading ? (
                                                  <div style={{ color: '#666', fontStyle: 'italic' }}>
                                                       <div>Đang tải thông tin ca làm việc...</div>
                                                  </div>
                                             ) : workShifts.length > 0 ? (
                                                  workShifts.map((shift) => (
                                                       <Radio 
                                                            key={shift.shiftId} 
                                                            value={shift.shiftId}
                                                            disabled={!shift.isAvailable}
                                                            style={{ 
                                                                 display: 'block', 
                                                                 marginBottom: 8,
                                                                 opacity: shift.isAvailable ? 1 : 0.5,
                                                                 color: shift.isAvailable ? 'inherit' : '#999'
                                                            }}
                                                       >
                                                            <div>
                                                                 <strong>{shift.shiftName}</strong> ({shift.startTime} - {shift.endTime})
                                                            </div>
                                                            <div style={{ fontSize: '12px', color: shift.isAvailable ? '#666' : '#999' }}>
                                                                 Trạng thái: {shift.status}
                                                                 {!shift.isAvailable && ' (Hết chỗ)'}
                                                            </div>
                                                       </Radio>
                                                  ))
                                             ) : (
                                                  <div style={{ color: '#ff4d4f', fontStyle: 'italic' }}>
                                                       Không có ca làm việc nào cho ngày này. Vui lòng chọn ngày khác.
                                                  </div>
                                             )}
                                        </Radio.Group>
                                   </Form.Item>
                              )}
                              
                              <div className="button-register">
                                   <Button onClick={handleCancel}>
                                        {isFromHistory ? 'Quay lại' : 'Hủy'}
                                   </Button>
                                   <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        loading={loading} 
                                        style={{ minWidth: 100 }}
                                        disabled={shiftsLoading}
                                   >
                                        {isFromHistory ? 'Thanh toán' : 'Tiếp tục'}
                                   </Button>
                              </div>
                         </Form>
                    </Modal>
               </div>

               <ConfirmTestModal 
                    open={isConfirmModalOpen}
                    onClose={handleConfirmModalClose}
                    formData={formData}
                    userId={userId}
               />

               <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={defaultTab} />

               <div style={{height: 150}}></div>
          </MainLayout>
     );
}

export default TestSti;
