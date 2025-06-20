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
} from 'antd';
import {
     ReloadOutlined,
     ClockCircleOutlined,
     MessageOutlined,
     CheckCircleOutlined,
     CloseCircleOutlined,
     BellOutlined,
} from '@ant-design/icons';
import { questionApi } from '../../services/api';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

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

     useEffect(() => {
          const fetchQuestions = async () => {
               setLoading(true);
               try {
                    const res = await questionApi.getAllQuestions();
                    const formattedQuestions = res.data
                         .map((q) => ({
                              key: q.questionId,
                              sender: {
                                   name: q.member?.fullName || q.member?.name || 'Ẩn danh',
                                   avatar: q.member?.avatar,
                              },
                              sentTime: dayjs(q.submitDate),
                              summary: q.titleQuestion || q.content,
                              isAnswered: q.isAnswered,
                              isClosed: q.isClosed,
                         }))
                         .sort((a, b) => b.sentTime.diff(a.sentTime)); // Sort by date descending
                    setAllQuestions(formattedQuestions);
               } catch {
                    message.error('Không thể tải danh sách câu hỏi');
               } finally {
                    setLoading(false);
               }
          };
          fetchQuestions();
     }, []);

     const getStatus = (record) => {
          if (record.isClosed) return 'closed';
          if (record.isAnswered) return 'answered';
          // Mock "Đã phản hồi" status as it's not in the data model
          if (record.key % 2 === 0) return 'responded';
          return 'unanswered';
     };

     const filteredQuestions = useMemo(() => {
          return allQuestions.filter((item) => {
               const dateMatch = filters.date ? item.sentTime.isSame(filters.date, 'day') : true;
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

     const getAction = (record) => {
          const status = getStatus(record);
          if (status === 'closed' || status === 'answered') {
               return <a>Xem chi tiết</a>;
          }
          return <a>Trả lời</a>;
     };

     const columns = [
          {
               title: 'Người gửi',
               dataIndex: 'sender',
               key: 'sender',
               render: (sender) => (
                    <Space>
                         <Avatar src={sender.avatar} />
                         <span>{sender.name}</span>
                    </Space>
               ),
          },
          {
               title: 'Thời gian gửi',
               dataIndex: 'sentTime',
               key: 'sentTime',
               render: (time) => time.format('YYYY-MM-DD, HH:mm'),
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
          </div>
     );
};

export default QuestionManagement;
