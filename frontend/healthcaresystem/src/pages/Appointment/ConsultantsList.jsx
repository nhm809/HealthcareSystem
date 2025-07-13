import { Card, Row, Col, Pagination, Select, Input, Empty } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MainLayout from '@components/Layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
     faStethoscope,
 } from '@fortawesome/free-solid-svg-icons'
import defaultdoctoravatar from '../../assets/imgs/defaultdoctoravatar.png';
import "./ConsultantsList.css";
import api from '../../services/api';
import dayjs from 'dayjs';

const { Option } = Select;
const { Search } = Input;
 
function Appointment() {

     const [specialties, setSpecialties] = useState([]);
     const [selectedSpecialty, setSelectedSpecialty] = useState(null);
     const [searchTerm, setSearchTerm] = useState('');
     const [doctors, setDoctors] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const navigate = useNavigate();
     const { state } = useLocation();
     const serviceId = state?.serviceId;

     const today = dayjs();
     const [selectedDate, setSelectedDate] = useState(null);

     const dateOptions = Array.from({ length: 7 }, (_, i) => {
          const date = today.add(i, 'day');
          return {
               value: date.format('YYYY-MM-DD'),
               label: `Ngày ${date.format('DD/MM/YYYY')}`
          };
     });

     useEffect(() => {
          const fetchDoctors = async () => {
               try {
                    let response;

                    if (selectedDate) {
                         response = await api.get(`/consultants/available?date=${dayjs(selectedDate).format('YYYY-MM-DD')}`);
                    } else {
                         response = await api.get('/consultants');
                    }

                    const data = response.data;
                    const mappedDoctors = data.map((item) => ({
                         id: item.consultantId,
                         name: item.fullName,
                         specialization: item.specialties?.[0]?.name || "Chưa cập nhật",
                         image: item.avatar?.trim() ? item.avatar : defaultdoctoravatar,
                    }));

                    setDoctors(mappedDoctors);
               } catch (error) {
                    console.error("Lỗi khi lấy danh sách bác sĩ:", error);
               }
          };

          const fetchSpecialties = async () => {
               try {
                    const response = await api.get('/specialty/getAll');
                    setSpecialties(response.data.data);
               } catch (error) {
                    console.error("Lỗi khi lấy danh sách chuyên khoa:", error);
               }
          };

          fetchDoctors();
          fetchSpecialties();
     }, [selectedDate]);


     const filteredDoctors = doctors.filter((doctor) => {
          const matchSpecialty = !selectedSpecialty || doctor.specialization === selectedSpecialty;
          const matchSearch = !searchTerm || (doctor.name && doctor.name.toLowerCase().includes(searchTerm.toLowerCase()));
          return matchSpecialty && matchSearch;
     });

     return (
          <MainLayout>
               <div className='doctor-list-contanter'>
                    <h2 className='doctor-list-title'>Đặt lịch tư vấn trực tuyến</h2>

                    <Search
                         placeholder='Tìm bác sĩ, ...'
                         enterButton
                         className='doctor-list-search'
                         onSearch={(value) => setSearchTerm(value)}
                         onChange={(e) => setSearchTerm(e.target.value)} 
                         allowClear
                    />

                    <div className='doctor-list-filters'>
                         <p>Chọn bác sĩ</p>
                         <Row gutter={[16,16]} justify={'center'} className='filters'>
                              <Col>
                                   <div style={{ display: "flex", gap: 12 }}>
                                        <Select
                                             placeholder='Chuyên khoa'
                                             className='filter-select'
                                             allowClear
                                             onChange={(value) => setSelectedSpecialty(value)}
                                        >
                                             {specialties.map((s) => (
                                                  <Option key={s.id} value={s.name}>{s.name}</Option>
                                             ))}
                                        </Select>

                                        <Select
                                             placeholder="Chọn ngày"
                                             className="filter-select"
                                             allowClear
                                             value={selectedDate}
                                             onChange={(value) => setSelectedDate(value)}
                                        >
                                             {dateOptions.map((opt) => (
                                                  <Option key={opt.value} value={opt.value}>
                                                       {opt.label}
                                                  </Option>
                                             ))}
                                        </Select>
                                   </div>
                              </Col>
                         </Row>
                    </div>

                    {filteredDoctors.length === 0 ? (
                         <div style={{ padding: '10px 0', textAlign: 'center', width: '100%' }}>
                              <Empty
                                   image={Empty.PRESENTED_IMAGE_SIMPLE}
                                   style={{ marginBlock: '32px 0'}}
                                   description={
                                        <span style={{ fontSize: 16, color: '#888' }}>
                                             Không có tư vấn viên nào khả dụng.
                                        </span>
                                   }
                              />
                         </div>
                    ) : (
                         <Row gutter={[16,16]}>
                              {filteredDoctors.slice((currentPage - 1) * 8, currentPage * 8).map((doctor) => (
                                   <Col key={doctor.id} xs={24} sm={12} md={8} lg={6}>
                                        <Card 
                                             hoverable
                                             cover={
                                                  <div className="doctor-icon" onClick={() => navigate(`/appointment/${doctor.id}`, { state: { serviceId, selectedDate } })}>
                                                       <img alt="doctor" src={doctor.image}/>
                                                  </div>
                                             }
                                        >
                                             <Card.Meta title={doctor.name} description={doctor.specialization} />
                                                  <button className="book-button" onClick={() => navigate(`/appointment/${doctor.id}`, { state: { serviceId, selectedDate } })}>
                                                  <FontAwesomeIcon icon={faStethoscope} className="icon" />
                                                  Đặt tư vấn
                                             </button>
                                        </Card>  
                                   </Col>
                              ))}
                         </Row>
                    )}

                    <div className='pagination-container'>
                         <Pagination
                              current={currentPage}
                              onChange={setCurrentPage}
                              total={filteredDoctors.length}
                              pageSize={8}
                         />
                    </div>
               </div>
          </MainLayout>         
     );
}

export default Appointment;