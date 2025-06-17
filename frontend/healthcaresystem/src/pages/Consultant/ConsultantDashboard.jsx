import React, { useState } from 'react';
import { DatePicker, Select, Input, Button, Table, Tag, Pagination } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Option } = Select;

const dataSource = [
     {
          key: '1',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          name: 'Lê Thùy Linh',
          time: '2025-05-28, 16:00',
          meet: null,
          status: 'Sắp diễn ra',
          meetStatus: 'Chưa cập nhật',
     },
     {
          key: '2',
          avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
          name: 'Trần Mạnh Quân',
          time: '2025-05-25, 18:00',
          meet: 'https://meet.google.com/',
          status: 'Đã hoàn thành',
          meetStatus: 'Đã cập nhật',
     },
     {
          key: '3',
          avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
          name: 'Hoàng Văn Bình',
          time: '2025-05-23, 09:30',
          meet: 'https://meet.google.com/',
          status: 'Đã hủy',
          meetStatus: 'Đã cập nhật',
     },
];

const columns = [
     {
          title: 'Khách hàng',
          dataIndex: 'name',
          key: 'name',
          render: (text, record) => (
               <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <img src={record.avatar} alt={text} style={{ width: 32, height: 32, borderRadius: '50%' }} />
                    <span>{text}</span>
               </div>
          ),
     },
     {
          title: 'Thời gian hẹn',
          dataIndex: 'time',
          key: 'time',
     },
     {
          title: 'Link GGMeet',
          dataIndex: 'meet',
          key: 'meet',
          render: (meet, record) =>
               meet ? (
                    <a href={meet} target="_blank" rel="noopener noreferrer">
                         <img src="https://upload.wikimedia.org/wikipedia/commons/5/5c/Google_Meet_logo_%282020%29.svg" alt="Google Meet" style={{ width: 20, marginRight: 4 }} />
                         Google Meet
                    </a>
               ) : (
                    <Tag color="red">Chưa cập nhật</Tag>
               ),
     },
     {
          title: 'Trạng thái',
          dataIndex: 'status',
          key: 'status',
          render: (status) => {
               if (status === 'Sắp diễn ra') return <Tag color="green">{status}</Tag>;
               if (status === 'Đã hoàn thành') return <Tag color="default">{status}</Tag>;
               if (status === 'Đã hủy') return <Tag color="red">{status}</Tag>;
               return status;
          },
     },
     {
          title: 'Thao tác',
          key: 'action',
          render: () => <a>Xem chi tiết</a>,
     },
];

const ConsultantDashboard = () => {
     return (
          <div style={{ background: '#fff', borderRadius: 8, padding: 24 }}>
               <div style={{ fontSize: 28, fontWeight: 700, color: '#5fc9a7', marginBottom: 24 }}>
                    Consultant Dashboarch
               </div>
               <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                    <DatePicker placeholder="mm/dd/yyyy" style={{ width: 160 }} />
                    <Select defaultValue="all" style={{ width: 120 }}>
                         <Option value="all">Tất cả</Option>
                         <Option value="upcoming">Sắp diễn ra</Option>
                         <Option value="done">Đã hoàn thành</Option>
                         <Option value="cancelled">Đã hủy</Option>
                    </Select>
                    <Input.Search placeholder="Nhập tên khách hàng..." style={{ width: 220 }} />
                    <Button icon={<ReloadOutlined />}>Làm mới</Button>
               </div>
               <Table
                    dataSource={dataSource}
                    columns={columns}
                    pagination={false}
                    style={{ background: '#fff', borderRadius: 8 }}
               />
               <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
                    <Pagination current={1} total={30} pageSize={3} />
               </div>
          </div>
     );
};

export default ConsultantDashboard;
