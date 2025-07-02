import { Card, Row, Col, Pagination, Select, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
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

const { Option } = Select;
const { Search } = Input;
 
function Appointment() {

     const [doctors, setDoctors] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const navigate = useNavigate();

     useEffect(() => {
          const fetchDoctors = async () => {
               try {
                    const response = await api.get('/consultants');
                    const data = response.data;
                    const mappedDoctors = data.map((item) => ({
                         id: item.consultantId,
                         name: item.fullName,
                         specialization: item.specialties?.[0]?.name || "Chưa cập nhật",
                         // image: defaultdoctoravatar,
                    }));
                    setDoctors(mappedDoctors);
               } catch (error) {
                    console.error("Lỗi khi lấy danh sách bác sĩ:", error);
               }
          }; 
          fetchDoctors();
     }, []);

     return (
          <MainLayout>
               <div className='doctor-list-contanter'>
                    <h2 className='doctor-list-title'>Đặt lịch tư vấn trực tuyến</h2>

                    <Search
                         placeholder='Tìm bác sĩ, ...'
                         enterButton
                         className='doctor-list-search'
                    />

                    <div className='doctor-list-filters'>
                         <p>Chọn bác sĩ</p>
                         <Row gutter={[16,16]} justify={'center'} className='filters'>
                              <Col>
                                   <Select placeholder='Chuyên khoa' className='filter-select'>
                                        <Option value='sanphukhoa'>Sản phụ khoa</Option>
                                        <Option value='nhi'>Nhi</Option>
                                   </Select>
                              </Col>
                              <Col>
                                   <Select placeholder='Ngày khám' className='filter-select'>
                                        <Option value='today'>Hôm nay</Option>
                                        <Option value='tomorrow'>Ngày mai</Option>
                                   </Select>
                              </Col>
                              <Col>
                                   <Select placeholder='Đánh giá' className='filter-select'>
                                        <Option value='high'>Cao nhất</Option>
                                        <Option value='low'>Thấp nhất</Option>
                                   </Select>
                              </Col>
                         </Row>
                    </div>

                    <Row gutter={[16,16]}>
                         {doctors.map((doctor) => (
                              <Col key={doctor.id} xs={24} sm={12} md={8} lg={6}>
                                   <Card 
                                        hoverable
                                        cover={
                                             doctor.image ? (
                                                  <img alt="doctor" src={defaultdoctoravatar} onClick={() => navigate(`/appointment/${doctor.id}`)} />
                                             ) : (
                                                  <div className="doctor-icon" onClick={() => navigate(`/appointment/${doctor.id}`)}>
                                                       <img alt="doctor" src={defaultdoctoravatar}/>
                                                  </div>
                                             )
                                        }
                                   >
                                        <Card.Meta title={doctor.name} description={doctor.specialization} />
                                        <button className="book-button" onClick={() => navigate(`/appointment/${doctor.id}`)}>
                                             <FontAwesomeIcon icon={faStethoscope} className="icon" />
                                             Đặt tư vấn
                                        </button>
                                   </Card>  
                              </Col>
                         ))}
                    </Row>

                    <div className='pagination-container'>
                         <Pagination
                              current={currentPage}
                              onChange={setCurrentPage}
                              total={doctors.length}
                              pageSize={8}
                         />
                    </div>
               </div>
          </MainLayout>         
     );
}

export default Appointment;