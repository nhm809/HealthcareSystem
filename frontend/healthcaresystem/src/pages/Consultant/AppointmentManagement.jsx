import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Tabs,
  Table,
  Tag,
  Card,
  Space,
  Typography,
  Empty,
  Spin,
  DatePicker,
  Input,
  Select,
  Button,
  Row,
  Col
} from 'antd';
import dayjs from 'dayjs';
import { ReloadOutlined } from '@ant-design/icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import api from '../../services/api';
import Cookies from 'js-cookie';
import AppointmentDetailModal from './AppointmentDetailModal';
import './AppointmentManagement.css';

const { Title } = Typography;

function AppointmentManagement () {
     const [appointments, setAppointments] = useState([]);
     const [loading, setLoading] = useState(false);
     const userId = Cookies.get('userId');
     const [selectedId, setSelectedId] = useState(null);
     const [showModal, setShowModal] = useState(false);
     const [searchKeyword, setSearchKeyword] = useState('');
     const [selectedDate, setSelectedDate] = useState(null);

     const applyFilters = (data, statusList = []) => {
          return data
               .filter(item => {
                    const matchStatus = statusList.length === 0 || statusList.includes((item.status || '').toLowerCase());

                    const matchSearch = !searchKeyword || item.memberName?.toLowerCase().includes(searchKeyword.toLowerCase());

                    const matchDate = !selectedDate || dayjs(item.startTime).isSame(selectedDate, 'day');

                    return matchStatus && matchSearch && matchDate;
               });
     };

     useEffect(() => {
          fetchAppointments();
     }, []);

     const fetchAppointments = async () => {
          setLoading(true);
               try {
                    const res = await api.get(`/Appointment/consultant/${userId}`);
                    if (res.data.success) {
                         const sorted = res.data.data.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                         setAppointments(sorted);
                    }
               } catch (error) {
                    console.error('Lỗi khi tải lịch hẹn:', error);
               }
          setLoading(false);
     };

     const renderStatus = (status) => {
          const map = {
               'dang cho kham': { color: 'processing', text: 'Đang chờ khám' },
               'da hoan thanh': { color: 'success', text: 'Đã hoàn thành' },
               'da danh gia': { color: 'success', text: 'Đã hoàn thành' },
               'dang thanh toan': { color: 'warning', text: 'Đang thanh toán' },
               'da huy': { color: 'default', text: 'Đã hủy' },
          };

          const key = (status || '').toLowerCase();
          const config = map[key] || { color: 'default', text: status };
          return <Tag color={config.color} style={{ fontSize: '14px' }}>{config.text}</Tag>;
     };

     const columns = [
          {
               title: 'Khách hàng',
               dataIndex: 'memberName',
               key: 'memberName',
               render: (name) => <strong>{name}</strong>,
               width: '20%',
          },
          {
               title: 'Thời gian',
               dataIndex: 'startTime',
               key: 'startTime',
               render: time => (
                    <div style={{ fontWeight:'500' }} >
                         <div>{dayjs(time).format('HH:mm')}</div>
                         <div style={{ fontSize: 12, color: '#888' }}>{dayjs(time).format('DD/MM/YYYY')}</div>
                    </div>
               ),
               width: '20%',
          },
          {
               title: 'Google Meet',
               dataIndex: 'meetLink',
               key: 'meetLink',
               render: (meet) => meet ? (
                    <a
                         href={meet}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="meet-link"
                    >
                         <FontAwesomeIcon icon={faGoogle} />
                         Google Meet
                    </a>
               ) : (
                    <Tag color="red">Chưa cập nhật</Tag>
               ),
               width: '20%',
          },
          {
               title: 'Trạng thái',
               dataIndex: 'status',
               key: 'status',
               render: renderStatus,
               width: '20%',
          },
          {
               title: 'Thao tác',
               key: 'action',
               render: (record) => <a onClick={() => {
                         setSelectedId(record.appointmentId);
                         setShowModal(true);
                    }}>Xem chi tiết</a>,
               width: '20%'
          }
     ];

     const filterByStatus = (statusList) =>
          appointments.filter(r => statusList.includes((r.status || '').toLowerCase()));

     const getCountByStatus = (statusList) =>
          filterByStatus(statusList).length;

     const tabItems = [
          {
               key: 'Tat-ca',
               label: `Tất cả (${appointments.length})`,
               children: (
                    <Table
                         columns={columns}
                         dataSource={applyFilters(appointments)}
                         rowKey="appointmentId"
                         pagination={{
                              pageSize: 3,
                              className: 'appointment-pagination',
                         }}
                    />
               )
          },
          {
               key: 'dang-thanh-toan',
               label: `Đang thanh toán (${getCountByStatus(['dang thanh toan'])})`,
               children: (
                    <Table
                         columns={columns}
                         dataSource={applyFilters(filterByStatus(['dang thanh toan']))}
                         rowKey="appointmentId"
                         pagination={{
                              pageSize: 3,
                              className: 'appointment-pagination',
                         }}
                    />
               )
          },
          {
               key: 'dang-cho-kham',
               label: `Đang chờ khám (${getCountByStatus(['dang cho kham'])})`,
               children: (
               <Table
                    columns={columns}
                    dataSource={applyFilters(filterByStatus(['dang cho kham']))}
                    rowKey="appointmentId"
                    pagination={{
                         pageSize: 3,
                         className: 'appointment-pagination',
                    }}
               />
               )
          },
          {
               key: 'da-hoan-thanh',
               label: `Đã hoàn thành (${getCountByStatus(['da hoan thanh', 'da danh gia'])})`,
               children: (
               <Table
                    columns={columns}
                    dataSource={applyFilters(filterByStatus(['da hoan thanh', 'da danh gia']))}
                    rowKey="appointmentId"
                    pagination={{
                         pageSize: 3,
                         className: 'appointment-pagination',
                    }}
               />
               )
          },
          {
               key: 'da-huy',
               label: `Đã hủy (${getCountByStatus(['da huy'])})`,
               children: (
               <Table
                    columns={columns}
                    dataSource={applyFilters(filterByStatus(['da huy']))}
                    rowKey="appointmentId"
                    pagination={{
                         pageSize: 3,
                         className: 'appointment-pagination',
                    }}
               />
               )
          },
     ];

     return (
          <div className="appointment-list">
               <Card>
                    <Space direction="vertical" style={{ width: '100%' }}>
                         <div style={{ textAlign: 'left' }}>
                              <Title level={2} style={{ color: '#1a3e72' }}>Quản lý lịch tư vấn</Title>
                         </div>

                         <Row justify="end" gutter={[16, 16]} className="filter-row">
                              <Col>
                                   <DatePicker 
                                        placeholder="mm/dd/yyyy" 
                                        value={selectedDate}
                                        onChange={(date) => setSelectedDate(date)}
                                   />
                              </Col>
                              <Col>
                                   <Input.Search 
                                        placeholder="Nhập tên khách hàng..." 
                                        style={{ width: 200 }} 
                                        value={searchKeyword}
                                        onChange={(e) => setSearchKeyword(e.target.value)}
                                   />
                              </Col>
                              <Col>
                                   <Button 
                                        icon={<ReloadOutlined />} 
                                        className="refresh-btn"
                                        onClick={() => {
                                             setSelectedDate(null);
                                             setSearchKeyword('');
                                             fetchAppointments();
                                        }}
                                   >
                                        Làm mới
                                   </Button>
                              </Col>
                         </Row>

                         {loading ? (
                              <div style={{ textAlign: 'center', padding: '50px' }}>
                                   <Spin size="large" />
                              </div>
                         ) : appointments.length > 0 ? (
                              <Tabs defaultActiveKey="tat-ca" items={tabItems} />
                         ) : (
                              <Empty description="Bạn chưa có lịch hẹn nào"></Empty>
                         )}
                    </Space>
               </Card>

               <AppointmentDetailModal
                    open={showModal}
                    onClose={() => setShowModal(false)}
                    appointmentId={selectedId}
                    onUpdateSuccess={fetchAppointments}
               />
          </div>
     );
};

export default AppointmentManagement;
