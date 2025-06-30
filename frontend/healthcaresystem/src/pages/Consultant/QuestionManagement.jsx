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
} from 'antd';
import {
     ReloadOutlined,
     ClockCircleOutlined,
     MessageOutlined,
     CheckCircleOutlined,
     CloseCircleOutlined,
     BellOutlined,
} from '@ant-design/icons';
import { questionApi, messageApi, specialtyApi } from '../../services/api';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import Cookies from 'js-cookie';
import SubQuestionList from '../../components/Question/SubQuestionList';

dayjs.extend(utc);
dayjs.extend(timezone);

const { Option } = Select;
const { Text } = Typography;

const QuestionManagement = () => {
     const [allQuestions, setAllQuestions] = useState([]);
     const [loading, setLoading] = useState(false);
     const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
     const [filters, setFilters] = useState({
          date: null,
          status: 'all',
          searchText: '',
     });
     const [isModalVisible, setIsModalVisible] = useState(false);
     const [selectedQuestion, setSelectedQuestion] = useState(null);
     const [messages, setMessages] = useState([]);
     const [loadingMessages, setLoadingMessages] = useState(false);
     const [replyContent, setReplyContent] = useState('');
     const [specialties, setSpecialties] = useState([]);
     const consultantId = Cookies.get('userId');

     useEffect(() => {
          const fetchQuestions = async () => {
               setLoading(true);
               try {
                    const res = await questionApi.getAllQuestions();
                    const formattedQuestions = res.data
                         .map((q) => ({
                              key: q.questionId,
                              sender: {
                                   name: q.member?.fullName || q.member?.name || 'Thành viên ẩn danh',
                                   avatar: q.member?.avatar,
                              },
                              sentTime: q.submitDate,
                              summary: q.titleQuestion || q.content,
                              isAnswered: q.isAnswered,
                              isClosed: q.isClosed,
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
          const fetchSpecialties = async () => {
               try {
                    const res = await specialtyApi.getAllSpecialties();
                    setSpecialties(res.data.data || []);
               } catch {
                    setSpecialties([]);
               }
          };
          fetchQuestions();
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
                    message.error('Không thể tải lịch sử tin nhắn');
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
          // Mock "Đã phản hồi" status as it's not in the data model
          if (record.key % 2 === 0) return 'responded';
          return 'unanswered';
     };

     const filteredQuestions = useMemo(() => {
          return allQuestions.filter((item) => {
               const dateMatch = filters.date ? dayjs(item.sentTime).isSame(filters.date, 'day') : true;
               const searchMatch = item.sender.name.toLowerCase().includes(filters.searchText.toLowerCase());
               const statusMatch = filters.status === 'all' || getStatus(item) === filters.status;
               return dateMatch && searchMatch && statusMatch;
          });
     }, [allQuestions, filters]);

     const paginatedData = useMemo(() => {
          const start = (pagination.current - 1) * pagination.pageSize;
          const end = start + pagination.pageSize;
          return filteredQuestions.slice(start, end);
     }, [filteredQuestions, pagination]);

     useEffect(() => {
          setPagination((p) => ({ ...p, current: 1 }));
     }, [filters.searchText, filters.status, filters.date]);

     const getStatusTag = (record) => {
          const status = getStatus(record);
          switch (status) {
               case 'unanswered':
                    return (
                         <Tag icon={<ClockCircleOutlined />} color="success">
                              Chưa trả lời
                         </Tag>
                    );
               case 'responded':
                    return (
                         <Tag icon={<MessageOutlined />} color="processing">
                              Đã phản hồi
                         </Tag>
                    );
               case 'answered':
                    return (
                         <Tag icon={<CheckCircleOutlined />} color="default">
                              Đã trả lời
                         </Tag>
                    );
               case 'closed':
                    return (
                         <Tag icon={<CloseCircleOutlined />} color="error">
                              Đã đóng
                         </Tag>
                    );
               default:
                    return null;
          }
     };

     const handleReplyClick = (record) => {
          setSelectedQuestion(record);
          setIsModalVisible(true);
     };

     const handleSendMessage = async () => {
          if (!replyContent.trim() || !selectedQuestion) return;
          try {
               await messageApi.addMessage({
                    questionId: selectedQuestion.key,
                    content: replyContent,
                    senderId: Number(consultantId),
               });
               setReplyContent('');
               // Reload messages
               setLoadingMessages(true);
               const res = await messageApi.getHistory(selectedQuestion.key);
               setMessages(res.data);
               message.success('Gửi tin nhắn thành công');
          } catch {
               message.error('Gửi tin nhắn thất bại!');
          } finally {
               setLoadingMessages(false);
          }
     };

     const getAction = (record) => {
          const status = getStatus(record);
          if (status === 'closed' || status === 'answered') {
               return <a onClick={() => handleReplyClick(record)}>Xem chi tiết</a>;
          }
          return <a onClick={() => handleReplyClick(record)}>Trả lời</a>;
     };

     const columns = [
          {
               title: 'Người gửi',
               dataIndex: 'sender',
               key: 'sender',
               render: (sender, record) => (
                    <Space>
                         <Avatar src={sender.avatar} />
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
               status: 'all',
               searchText: '',
          });
     };

     return (
          <div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#5fc9a7', margin: 0 }}>Consultant Dashboard</h1>
                    {/* <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']}>
                         <Badge count={unreadCount}>
                              <BellOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
                         </Badge>
                    </Dropdown> */}
               </div>
               <Space style={{ marginBottom: 16 }} wrap>
                    <DatePicker placeholder="mm/dd/yyyy" onChange={(date) => handleFilterChange('date', date)} value={filters.date} />
                    <Select
                         value={filters.status}
                         style={{ width: 150 }}
                         onChange={(value) => handleFilterChange('status', value)}
                    >
                         <Option value="all">Tất cả</Option>
                         <Option value="unanswered">Chưa trả lời</Option>
                         <Option value="responded">Đã phản hồi</Option>
                         <Option value="answered">Đã trả lời</Option>
                         <Option value="closed">Đã đóng</Option>
                    </Select>
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
               <Table dataSource={paginatedData} columns={columns} pagination={false} loading={loading} />
               <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                    <Pagination
                         current={pagination.current}
                         total={filteredQuestions.length}
                         pageSize={pagination.pageSize}
                         onChange={(page, pageSize) => setPagination({ current: page, pageSize })}
                         showSizeChanger={false}
                    />
               </div>
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
                                   <Tag color={selectedQuestion.isAnswered ? 'blue' : 'orange'}>
                                        {selectedQuestion.isAnswered ? 'Đã phản hồi' : 'Chưa trả lời'}
                                   </Tag>
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
                                   />
                              </div>
                         </div>
                    </Modal>
               )}
          </div>
     );
};

export default QuestionManagement;
