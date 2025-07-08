import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Table, Tag, Spin, Typography, Card, Space, Tabs, Empty, Button } from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/Layout";
import api from "../../services/api";
import "./AppointmentHistory.css";

const { Title } = Typography;

function AppointmentHistory() {
     const [appointments, setAppointments] = useState([]);
     const [loading, setLoading] = useState(true);
     const navigate = useNavigate();
     const userId = Cookies.get('userId');

     useEffect(() => {
          if (!userId) {
               navigate('/');
               toast.warning('Đăng nhập để xem lịch sử đặt lịch');
               return;
          }

          fetchAppointments();
     }, [userId]);

     const fetchAppointments = async () => {
          try {
               const res = await api.get(`/Appointment/member/${userId}`);
               const appointments = res.data?.data || [];
               const sorted = appointments.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
               setAppointments(sorted);
          } catch (err) {
               console.error(err);
               toast.error('Không thể tải lịch sử cuộc hẹn');
          } finally {
               setLoading(false);
          }
     };

     const renderStatus = (status) => {
          const map = {
               'dang cho kham': { color: 'processing', text: 'Đang chờ khám' },
               'da hoan thanh': { color: 'success', text: 'Hoàn thành' },
               'dang thanh toan': { color: 'warning', text: 'Đang thanh toán' },
               'da huy': { color: 'default', text: 'Đã hủy' },
          };

          const key = (status || '').toLowerCase();
          const config = map[key] || { color: 'default', text: status };
          return <Tag color={config.color} style={{ fontSize: '14px' }}>{config.text}</Tag>;
     };

     const columns = [
          {
               title: 'Dịch vụ',
               dataIndex: 'serviceName',
               key: 'serviceName',
               render: () => <strong style={{ color: '#1a3e72' }}>Tư vấn sức khỏe</strong>,
               width: 140,
          },
          {
               title: 'Bác sĩ',
               dataIndex: 'consultantName',
               key: 'consultantName',
               render: name => <div style={{ fontWeight:'500' }} >{name}</div>
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
                    <Tag color="red" style={{ fontSize: '14px' }}>Chưa cập nhật</Tag>
               )
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
               )
          },
          {
               title: 'Trạng thái',
               dataIndex: 'status',
               key: 'status',
               render: renderStatus
          }
     ];

     const filterByStatus = (statusList) =>
          appointments.filter(r => statusList.includes((r.status || '').toLowerCase()));

     const getCountByStatus = (statusList) =>
          filterByStatus(statusList).length;

     const tabItems = [
          {
               key: 'tat-ca',
               label: `Tất cả (${appointments.length})`,
               children: (
                    <Table
                         columns={columns}
                         dataSource={appointments}
                         rowKey="appointmentId"
                         pagination={{
                              pageSize: 5,
                              showQuickJumper: true,
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
                         dataSource={filterByStatus(['dang thanh toan'])}
                         rowKey="appointmentId"
                         pagination={{
                         pageSize: 5,
                         showQuickJumper: true,
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
                    dataSource={filterByStatus(['dang cho kham'])}
                    rowKey="appointmentId"
                    pagination={{
                    pageSize: 5,
                    showQuickJumper: true,
                    }}
               />
               )
          },
          {
               key: 'da-hoan-thanh',
               label: `Đã hoàn thành (${getCountByStatus(['da hoan thanh'])})`,
               children: (
               <Table
                    columns={columns}
                    dataSource={filterByStatus(['da hoan thanh'])}
                    rowKey="appointmentId"
                    pagination={{
                    pageSize: 5,
                    showQuickJumper: true,
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
                    dataSource={filterByStatus(['da huy'])}
                    rowKey="appointmentId"
                    pagination={{
                    pageSize: 5,
                    showQuickJumper: true,
                    }}
               />
               )
          },
     ];

     return (
          <MainLayout>
               <div className="appointment-history">
                    <Card>
                         <Space direction="vertical" style={{ width: '100%' }}>
                              <div style={{ textAlign: 'center' }}>
                                   <Title level={2} style={{ color: '#1a3e72' }}>Lịch sử tư vấn</Title>
                              </div>
                              {loading ? (
                                   <div style={{ textAlign: 'center', padding: '50px' }}>
                                        <Spin size="large" />
                                   </div>
                              ) : appointments.length > 0 ? (
                                   <Tabs defaultActiveKey="tat-ca" items={tabItems} />
                              ) : (
                                   <Empty
                                        description="Bạn chưa có lịch hẹn nào"
                                   >
                                        <Button className='booking-button' type="primary" onClick={() => navigate('/appointment')}>
                                             Đặt lịch ngay
                                        </Button>
                                   </Empty>
                              )}
                         </Space>
                    </Card>
               </div>
          </MainLayout>
     );
}

export default AppointmentHistory;
