import React, { useEffect, useState } from "react";
import { Table, Tag, Spin, Typography, Card, Space, Tabs } from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/Layout/Layout";
import { authApi } from "../../services/api";
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
               const res = await authApi.getAppointmentHistory();
               const appointments = res.data.data || [];

               const filtered = appointments. filter(item => item.memberId === Number(userId));
               const sorted = filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
               
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
          return <Tag color={config.color}>{config.text}</Tag>;
     };

     const columns = [
          {
               title: 'Dịch vụ',
               dataIndex: 'serviceName',
               key: 'serviceName',
               render: () => <strong style={{ color: '#1a3e72' }}>Tư vấn sức khỏe</strong>,
               width: 200,
          },
          {
               title: 'Bác sĩ',
               dataIndex: 'consultantName',
               key: 'consultantName',
               render: name => <strong>{name}</strong>
          },
          {
               title: 'Google Meet',
               dataIndex: 'meetLink',
               key: 'meetLink',
               render: text => (
                    text ? <a href={text} target="_blank" rel="noopener noreferrer">{text}</a> : 'Chưa có'
               )
          },
          {
               title: 'Bắt đầu',
               dataIndex: 'startTime',
               key: 'startTime',
               render: time => (
               <div>
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

     const tabItems = [
          {
               key: 'dang-thanh-toan',
               label: 'Đang thanh toán',
               children: (
                    <Table
                         columns={columns}
                         dataSource={filterByStatus(['dang thanh toan', 'pending'])}
                         rowKey="appointmentId"
                         pagination={{
                         pageSize: 10,
                         showQuickJumper: true,
                         showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} cuộc hẹn`,
                         }}
                    />
               )
          },
          {
               key: 'dang-cho-kham',
               label: 'Đang chờ khám',
               children: (
               <Table
                    columns={columns}
                    dataSource={filterByStatus(['dang cho kham'])}
                    rowKey="appointmentId"
                    pagination={{
                    pageSize: 10,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} cuộc hẹn`,
                    }}
               />
               )
          },
          {
               key: 'da-hoan-thanh',
               label: 'Đã hoàn thành',
               children: (
               <Table
                    columns={columns}
                    dataSource={filterByStatus(['da hoan thanh', 'completed'])}
                    rowKey="appointmentId"
                    pagination={{
                    pageSize: 10,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} cuộc hẹn`,
                    }}
               />
               )
          },
          {
               key: 'da-huy',
               label: 'Đã hủy',
               children: (
               <Table
                    columns={columns}
                    dataSource={filterByStatus(['da huy', 'cancelled'])}
                    rowKey="appointmentId"
                    pagination={{
                    pageSize: 10,
                    showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} cuộc hẹn`,
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
                         <Title level={2} style={{ color: '#1a3e72' }}>Lịch sử tư vấn</Title>
                         {loading ? (
                              <div style={{ textAlign: 'center', padding: '50px' }}>
                                   <Spin size="large" />
                              </div>
                         ) : appointments.length > 0 ? (
                              <Tabs defaultActiveKey="dang-thanh-toan" items={tabItems} />
                         ) : (
                              <p>Bạn chưa có lịch hẹn nào.</p>
                         )}
                         </Space>
                    </Card>
               </div>
          </MainLayout>
     );
}

export default AppointmentHistory;
