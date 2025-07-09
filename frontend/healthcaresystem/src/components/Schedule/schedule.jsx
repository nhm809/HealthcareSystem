import React, { useEffect, useState } from 'react';
import { Card, Modal, List, Badge, Spin, message, Button, Row, Col, Tooltip } from 'antd';
import { CalendarOutlined, RestOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { getWeeklySchedule } from '../../services/api';

const weekdayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

function getMonday(date) {
     const d = dayjs(date);
     const day = d.day();
     return d.subtract((day === 0 ? 6 : day - 1), 'day');
}

const Schedule = () => {
     const [weekData, setWeekData] = useState([]);
     const [loading, setLoading] = useState(true);
     const [selectedDate, setSelectedDate] = useState(null);
     const [modalVisible, setModalVisible] = useState(false);
     const [workShifts, setWorkShifts] = useState([]);
     const [offset, setOffset] = useState(0);

     const userId = Cookies.get('userId');

     useEffect(() => {
          if (!userId) return;
          setLoading(true);
          getWeeklySchedule(userId, offset)
               .then(res => {
                    const apiData = res.data || [];
                    const today = dayjs();
                    const monday = getMonday(today.add(offset, 'week'));
                    const days = [];
                    for (let i = 0; i < 7; i++) {
                         const d = monday.add(i, 'day');
                         const found = apiData.find(x => dayjs(x.date).isSame(d, 'day'));
                         days.push({
                              date: d.format(),
                              shifts: found ? found.shifts : []
                         });
                    }
                    setWeekData(days);
               })
               .catch(() => {
                    message.error('Không thể tải lịch tuần');
               })
               .finally(() => setLoading(false));
     }, [userId, offset]);

     const onSelect = (date, shifts) => {
          setSelectedDate(date);
          setWorkShifts(shifts);
          setModalVisible(shifts && shifts.length > 0);
     };

     const getShiftName = (shiftType) => {
          if (shiftType === 1) return 'Ca sáng';
          if (shiftType === 2) return 'Ca chiều';
          return `Ca ${shiftType}`;
     };

     const formatDate = (dateStr) => dayjs(dateStr).format('DD/MM');
     const getWeekday = (index) => weekdayNames[index];

     return (
          <div style={{ background: '#fff', padding: 24, borderRadius: 12, maxWidth: 900, margin: '0 auto', boxShadow: '0 1px 6px #f0f1f2' }}>
               <h2 style={{ marginBottom: 20, textAlign: 'center', fontWeight: 600, fontSize: 24, color: '#222' }}>Lịch làm việc</h2>
               <div style={{ marginBottom: 20, display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <Button onClick={() => setOffset(offset - 1)} size="middle" icon={<CalendarOutlined />}>Tuần trước</Button>
                    <Button onClick={() => setOffset(0)} size="middle" type="default" disabled={offset === 0} icon={<CalendarOutlined />}>Tuần hiện tại</Button>
                    <Button onClick={() => setOffset(offset + 1)} size="middle" icon={<CalendarOutlined />}>Tuần sau</Button>
               </div>
               {loading ? (
                    <Spin size="large" style={{ display: 'block', margin: '40px auto' }} />
               ) : (
                    <Row gutter={8} justify="center" align="middle" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
                         {weekData.length === 0 && <div>Không có dữ liệu lịch tuần này.</div>}
                         {weekData.map((day, idx) => {
                              const isOff = day.shifts.length === 0;
                              return (
                                   <Col key={day.date} style={{ minWidth: 110, flex: '0 0 1', display: 'flex', justifyContent: 'center' }}>
                                        <Tooltip title={isOff ? 'Nghỉ' : 'Có ca làm việc'}>
                                             <Card
                                                  hoverable={!isOff}
                                                  style={{
                                                       textAlign: 'center',
                                                       marginBottom: 0,
                                                       background: '#fff',
                                                       opacity: isOff ? 0.5 : 1,
                                                       border: isOff ? '1px dashed #d9d9d9' : '1.5px solid #91d5ff',
                                                       borderRadius: 10,
                                                       boxShadow: 'none',
                                                       cursor: isOff ? 'not-allowed' : 'pointer',
                                                       minHeight: 110,
                                                       display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                                       padding: 0
                                                  }}
                                                  onClick={() => !isOff && onSelect(day.date, day.shifts)}
                                                  bodyStyle={{ padding: 10 }}
                                             >
                                                  <div style={{ fontWeight: 500, fontSize: 15, color: isOff ? '#aaa' : '#222', marginBottom: 2 }}>{getWeekday(idx)}</div>
                                                  <div style={{ fontSize: 20, fontWeight: 500, color: isOff ? '#bbb' : '#222', marginBottom: 4 }}>{formatDate(day.date)}</div>
                                                  {isOff ? (
                                                       <div style={{ color: '#bbb', fontSize: 16, marginTop: 4 }}><RestOutlined /> Nghỉ</div>
                                                  ) : (
                                                       <Badge count={day.shifts.length} style={{ backgroundColor: '#1890ff', fontSize: 12, boxShadow: 'none' }} />
                                                  )}
                                             </Card>
                                        </Tooltip>
                                   </Col>
                              );
                         })}
                    </Row>
               )}
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
                                        <b>Ca:</b> {getShiftName(item.shiftType)}<br />
                                        <b>Trạng thái:</b> {item.status}<br />
                                        {item.note && <><b>Ghi chú:</b> {item.note}</>}
                                   </div>
                              </List.Item>
                         )}
                         locale={{ emptyText: 'Không có ca làm việc' }}
                    />
               </Modal>
          </div>
     );
};

export default Schedule;
