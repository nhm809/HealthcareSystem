import React, { useState, useEffect, useMemo } from 'react';
import {
     DatePicker,
     Select,
     Input,
     Button,
     Table,
     Tag,
     Pagination,
     Avatar,
     Space,
     message,
     Dropdown,
     Badge,
     List,
     Typography,
     Modal,
     Spin,
     Image,
     Tabs,
} from 'antd';
import {
     ReloadOutlined,
     ClockCircleOutlined,
     MessageOutlined,
     CheckCircleOutlined,
     CloseCircleOutlined,
     BellOutlined,
     EditOutlined,
     StopOutlined,
} from '@ant-design/icons';
import { questionApi, messageApi, specialtyApi } from '../../services/api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Cookies from 'js-cookie';
import SubQuestionList from '../Question/SubQuestionList';
import './QuestionManagement.css';
import { Modal as AntdModal } from 'antd';
import logo from '../../assets/imgs/logo.png';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;
const { Text } = Typography;

const QuestionManagement = () => {
     const [allQuestions, setAllQuestions] = useState([]);
     const [loading, setLoading] = useState(false);
     const [pagination] = useState({ current: 1, pageSize: 10 });
     const [filters, setFilters] = useState({
          date: null,
          status: 'all',
          searchText: '',
     });
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [selectedQuestion, setSelectedQuestion] = useState(null);
     const [setMessages] = useState([]);
     const [setLoadingMessages] = useState(false);
     const [specialties, setSpecialties] = useState([]);
     const consultantId = Cookies.get('userId');

     // State cho phân trang của từng tab
     const [currentPage, setCurrentPage] = useState({
          'all': 1,
          'unanswered': 1,
          'answered': 1,
          'closed': 1
     });

     const [closeModalVisible, setCloseModalVisible] = useState(false);
     const [closingQuestion, setClosingQuestion] = useState(null);
     const [closeLoading, setCloseLoading] = useState(false);

     // Tách fetchQuestions ra ngoài để có thể gọi lại
     const fetchQuestions = async () => {
          setLoading(true);
          try {
               const res = await questionApi.getQuestionsByConsultant(consultantId);
               const formattedQuestions = res.data
                    .map((q) => ({
                         key: q.questionId,
                         sender: {
                              name: q.member?.fullName || q.member?.name || 'Thành viên ẩn danh',
                              avatar: q.member?.avatar,
                         },
                         sentTime: q.submitDate,
                         summary: q.titleQuestion || q.content,
                         status: q.status,
                         title: q.titleQuestion,
                         content: q.content,
                         gender: q.gender,
                         age: q.age,
                         specialtyId: q.specialtyId,
                         memberId: q.memberId,
                         consultantId: q.consultantId,
                         attachmentPath: q.attachmentPath,
                    }))
                    .sort((a, b) => dayjs(b.sentTime).diff(dayjs(a.sentTime)));
               setAllQuestions(formattedQuestions);
          } catch {
               message.error('Không thể tải danh sách câu hỏi');
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchQuestions();
          const fetchSpecialties = async () => {
               try {
                    const res = await specialtyApi.getAllSpecialties();
                    setSpecialties(res.data.data || []);
               } catch {
                    setSpecialties([]);
               }
          };
          fetchSpecialties();
     }, []);

     const getSpecialtyName = (id) => {
          const found = specialties.find((s) => String(s.id) === String(id));
          return found ? found.name : 'Chuyên khoa khác';
     };

     useEffect(() => {
          const fetchMessages = async () => {
               if (!selectedQuestion) return;
               setLoadingMessages(true);
               try {
                    const res = await messageApi.getHistory(selectedQuestion.key);
                    setMessages(res.data);
               } catch {
                    setMessages([]);
               } finally {
                    setLoadingMessages(false);
               }
          };
          if (isModalVisible) {
               fetchMessages();
          }
     }, [selectedQuestion, isModalVisible]);

     const getStatus = (record) => {
          if (record.isClosed) return 'closed';
          if (record.isAnswered) return 'answered';
          return 'unanswered';
     };

     const filteredQuestions = useMemo(() => {
          return allQuestions.filter((item) => {
               const dateMatch = filters.date ? dayjs(item.sentTime).isSame(filters.date, 'day') : true;
               const searchMatch = item.sender.name.toLowerCase().includes(filters.searchText.toLowerCase());
               return dateMatch && searchMatch;
          });
     }, [allQuestions, filters]);

     // Helper để lọc theo trạng thái
     const filterByStatus = (status) => {
          if (status === 'all') return filteredQuestions;
          if (status === 'answered') return filteredQuestions.filter(item => item.status === 'Da tra loi');
          if (status === 'unanswered') return filteredQuestions.filter(item => item.status === 'Chua tra loi');
          if (status === 'closed') return filteredQuestions.filter(item => item.status === 'Da dong');
          return filteredQuestions;
     };

     const getStatusTag = (record) => {
          switch (record.status) {
               case "Da tra loi":
                    return (
                         <Tag color="blue">Đã trả lời</Tag>
                    );
               case "Chua tra loi":
                    return (
                         <Tag color="orange">Chưa trả lời</Tag>
                    );
               case "Da dong":
                    return (
                         <Tag color="red">Đã đóng</Tag>
                    );
               default:
                    return (
                         <Tag color="default">{record.status}</Tag>
                    );
          }
     };

     const handleReplyClick = (record) => {
          setSelectedQuestion(record);
          setIsModalVisible(true);
     };

     const handleCloseQuestion = async (question) => {
          const submitDate = dayjs(question.sentTime);
          const now = dayjs();
          const diffDays = now.diff(submitDate, 'day');
          if (diffDays < 7) {
               setClosingQuestion(question);
               setCloseModalVisible(true);
          } else {
               // Đủ 7 ngày, đóng luôn
               await doCloseQuestion(question);
          }
     };

     const doCloseQuestion = async (question) => {
          setCloseLoading(true);
          try {
               await questionApi.updateQuestionStatus(question.key, JSON.stringify("Da dong"));
               message.success('Đã đóng câu hỏi!');
               setCloseModalVisible(false);
               setClosingQuestion(null);
               fetchQuestions();
          } catch {
               message.error('Đóng câu hỏi thất bại!');
          } finally {
               setCloseLoading(false);
          }
     };

     const getAction = (record) => {
          // Nếu câu hỏi đã đóng, chỉ hiển thị nút "Xem chi tiết"
          if (record.status === 'Da dong') {
               return (
                    <Button
                         type="default"
                         icon={<EditOutlined />}
                         size="small"
                         style={{ borderRadius: 6 }}
                         onClick={() => handleReplyClick(record)}
                    >
                         Xem chi tiết
                    </Button>
               );
          }
          
          // Nếu câu hỏi đã trả lời, hiển thị "Xem chi tiết" và "Đóng câu hỏi"
          if (record.status === 'Da tra loi') {
               return (
                    <Space>
                         <Button
                              type="default"
                              icon={<EditOutlined />}
                              size="small"
                              style={{ borderRadius: 6 }}
                              onClick={() => handleReplyClick(record)}
                         >
                              Xem chi tiết
                         </Button>
                         <Button
                              type="default"
                              danger
                              icon={<StopOutlined />}
                              size="small"
                              style={{
                                   borderRadius: 6,
                                   background: '#fff0f0',
                                   color: '#d4380d',
                                   border: '1px solid #ffa39e'
                              }}
                              onClick={() => handleCloseQuestion(record)}
                         >
                              Đóng câu hỏi
                         </Button>
                    </Space>
               );
          }
          
          // Nếu câu hỏi chưa trả lời, hiển thị nút "Trả lời" và "Đóng câu hỏi"
          return (
               <Space>
                    <Button
                         type="primary"
                         icon={<EditOutlined />}
                         size="small"
                         style={{ borderRadius: 6 }}
                         onClick={() => handleReplyClick(record)}
                    >
                         Trả lời
                    </Button>
                    <Button
                         type="default"
                         danger
                         icon={<StopOutlined />}
                         size="small"
                         style={{
                              borderRadius: 6,
                              background: '#fff0f0',
                              color: '#d4380d',
                              border: '1px solid #ffa39e'
                         }}
                         onClick={() => handleCloseQuestion(record)}
                    >
                         Đóng câu hỏi
                    </Button>
               </Space>
          );
     };

     const columns = [
          {
               title: 'Người gửi',
               dataIndex: 'sender',
               key: 'sender',
               render: (sender, record) => (
                    <Space>
                         <Avatar src={logo} />
                         <span>
                              {record.gender && record.age ? `${record.gender}, ${record.age} tuổi` : sender.name}
                         </span>
                    </Space>
               ),
          },
          {
               title: 'Thời gian gửi',
               dataIndex: 'sentTime',
               key: 'sentTime',
               render: (time) => (time ? dayjs.utc(time).local().format('HH:mm:ss DD/MM/YYYY') : ''),
          },
          {
               title: 'Nội dung tóm tắt',
               dataIndex: 'summary',
               key: 'summary',
          },
          {
               title: 'Trạng thái',
               key: 'status',
               render: (_, record) => getStatusTag(record),
          },
          {
               title: 'Thao tác',
               key: 'action',
               render: (_, record) => getAction(record),
          },
     ];

     const handleFilterChange = (key, value) => {
          setFilters((prev) => ({ ...prev, [key]: value }));
     };

     const handleRefresh = () => {
          setFilters({
               date: null,
               searchText: '',
          });
     };

     // Hàm xử lý thay đổi trang cho từng tab
     const handlePageChange = (tabKey, page) => {
          setCurrentPage(prev => ({
               ...prev,
               [tabKey]: page
          }));
     };

     useEffect(() => {
          // Reset tất cả trang về 1 khi thay đổi filter
          setCurrentPage({
               'all': 1,
               'unanswered': 1,
               'answered': 1,
               'closed': 1
          });
     }, [filters.searchText, filters.date]);

     // Tạo tab items cho từng trạng thái
     const tabItems = [
          {
               key: 'all',
               label: `Tất cả (${filterByStatus('all').length})`,
               children: (
                    <div>
                         <Table 
                              dataSource={filterByStatus('all').slice((currentPage['all'] - 1) * pagination.pageSize, currentPage['all'] * pagination.pageSize)} 
                              columns={columns} 
                              pagination={false} 
                              loading={loading} 
                         />
                         {filterByStatus('all').length > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                                   <Pagination
                                        current={currentPage['all']}
                                        total={filterByStatus('all').length}
                                        pageSize={pagination.pageSize}
                                        onChange={(page) => handlePageChange('all', page)}
                                        showSizeChanger={false}
                                   />
                              </div>
                         )}
                    </div>
               )
          },
          {
               key: 'unanswered',
               label: `Chưa trả lời (${filterByStatus('unanswered').length})`,
               children: (
                    <div>
                         <Table 
                              dataSource={filterByStatus('unanswered').slice((currentPage['unanswered'] - 1) * pagination.pageSize, currentPage['unanswered'] * pagination.pageSize)} 
                              columns={columns} 
                              pagination={false} 
                              loading={loading} 
                         />
                         {filterByStatus('unanswered').length > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                                   <Pagination
                                        current={currentPage['unanswered']}
                                        total={filterByStatus('unanswered').length}
                                        pageSize={pagination.pageSize}
                                        onChange={(page) => handlePageChange('unanswered', page)}
                                        showSizeChanger={false}
                                   />
                              </div>
                         )}
                    </div>
               )
          },
          {
               key: 'answered',
               label: `Đã trả lời (${filterByStatus('answered').length})`,
               children: (
                    <div>
                         <Table 
                              dataSource={filterByStatus('answered').slice((currentPage['answered'] - 1) * pagination.pageSize, currentPage['answered'] * pagination.pageSize)} 
                              columns={columns} 
                              pagination={false} 
                              loading={loading} 
                         />
                         {filterByStatus('answered').length > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                                   <Pagination
                                        current={currentPage['answered']}
                                        total={filterByStatus('answered').length}
                                        pageSize={pagination.pageSize}
                                        onChange={(page) => handlePageChange('answered', page)}
                                        showSizeChanger={false}
                                   />
                              </div>
                         )}
                    </div>
               )
          },
          {
               key: 'closed',
               label: `Đã đóng (${filterByStatus('closed').length})`,
               children: (
                    <div>
                         <Table 
                              dataSource={filterByStatus('closed').slice((currentPage['closed'] - 1) * pagination.pageSize, currentPage['closed'] * pagination.pageSize)} 
                              columns={columns} 
                              pagination={false} 
                              loading={loading} 
                         />
                         {filterByStatus('closed').length > 0 && (
                              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                                   <Pagination
                                        current={currentPage['closed']}
                                        total={filterByStatus('closed').length}
                                        pageSize={pagination.pageSize}
                                        onChange={(page) => handlePageChange('closed', page)}
                                        showSizeChanger={false}
                                   />
                              </div>
                         )}
                    </div>
               )
          },
     ];

     return (
          <div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1890ff', margin: 0 }}>Consultant Dashboard</h1>
                    {/* <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']}>
                         <Badge count={unreadCount}>
                              <BellOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
                         </Badge>
                    </Dropdown> */}
               </div>
               <Space style={{ marginBottom: 16 }} wrap>
                    <DatePicker placeholder="mm/dd/yyyy" onChange={(date) => handleFilterChange('date', date)} value={filters.date} />
                    <Input.Search
                         placeholder="Tìm kiếm khách hàng..."
                         style={{ width: 220 }}
                         value={filters.searchText}
                         onChange={(e) => handleFilterChange('searchText', e.target.value)}
                         allowClear
                    />
                    <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                         Làm mới
                    </Button>
               </Space>
               <Tabs 
                    defaultActiveKey="all" 
                    items={tabItems} 
                    tabBarStyle={{ background: '#f8f9fa', borderRadius: '16px 16px 0 0', padding: '0 16px', borderBottom: '1px solid #e0e0e0' }}
                    className="custom-question-tabs"
               />
               {selectedQuestion && (
                    <Modal
                         title="Chi tiết câu hỏi"
                         open={isModalVisible}
                         onCancel={() => {
                              setIsModalVisible(false);
                              setSelectedQuestion(null);
                         }}
                         footer={null}
                         width={720}
                    >
                         <div>
                              <div style={{ marginBottom: 8 }}>
                                   <b>
                                        {selectedQuestion.gender}, {selectedQuestion.age} tuổi
                                   </b>
                                   <Tag color="cyan">{getSpecialtyName(selectedQuestion.specialtyId)}</Tag>
                                   {getStatusTag(selectedQuestion)}
                              </div>
                              <div style={{ fontWeight: 600, color: '#2B7A4B', marginBottom: 4, fontSize: '1.2rem' }}>
                                   {selectedQuestion.title}
                              </div>
                              <div style={{ marginBottom: 8, borderBottom: '1px solid #f0f0f0', paddingBottom: 16 }}>
                                   {selectedQuestion.content}
                              </div>
                              {selectedQuestion.attachmentPath && (
                                   <div style={{ marginBottom: 8, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                                        <Image width={200} src={selectedQuestion.attachmentPath} alt="Attachment" />
                                   </div>
                              )}
                              <div style={{ marginTop: 16 }}>
                                   <SubQuestionList
                                        question={{
                                             id: selectedQuestion.key,
                                             gender: selectedQuestion.gender,
                                             age: selectedQuestion.age,
                                             title: selectedQuestion.title,
                                             content: selectedQuestion.content,
                                             submitDate: selectedQuestion.sentTime,
                                        }}
                                        isConsultant={true}
                                        onQuestionAnswered={fetchQuestions}
                                   />
                              </div>
                         </div>
                    </Modal>
               )}
               <AntdModal
                    open={closeModalVisible}
                    onCancel={() => { setCloseModalVisible(false); setClosingQuestion(null); }}
                    footer={null}
                    title={<span style={{ color: '#000' }}>Xác nhận đóng câu hỏi</span>}
               >
                    <p>Câu hỏi chưa đủ 7 ngày, bạn vẫn muốn đóng?</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                         <Button onClick={() => { setCloseModalVisible(false); setClosingQuestion(null); }}>
                              Hủy
                         </Button>
                         <Button
                              type="primary"
                              danger
                              loading={closeLoading}
                              onClick={() => doCloseQuestion(closingQuestion)}
                              style={{ border: 'none' }}
                         >
                              Đồng ý đóng
                         </Button>
                    </div>
               </AntdModal>
          </div>
     );
};

export default QuestionManagement;
