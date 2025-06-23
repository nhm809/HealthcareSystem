import { Card, Row, Col, Pagination, Select, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import MainLayout from '@components/Layout/Layout'

import "./ConsultantsList.css";

const { Option } = Select;
const { Search } = Input;
 
function Appointment() {

     const [doctors, setDoctors] = useState([]);
     const [currentPage, setCurrentPage] = useState(1);
     const navigate = useNavigate();

     useEffect(() => {
          const fetchDoctors = () => {
               // Mock data for now
               const dummyDoctors = Array.from({ length: 8 }, (_, i) => ({
                    id: i + 1,
                    name: "BS. Nguyễn Văn Minh",
                    specialization: "Sản phụ khoa",
                    image: "https://ddk.1cdn.vn/2023/05/31/image.daidoanket.vn-images-upload-vanht-05312023-_0-e90c.jpg", // Replace with real image path
               }));

               setDoctors(dummyDoctors);
          }; 
          fetchDoctors();
     }, [currentPage]);

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
                                   <Card hoverable cover={<img alt='doctor' src={doctor.image} onClick={() => navigate(`/appointment/${doctor.id}`)}/>}>
                                        <Card.Meta title={doctor.name} description={doctor.specialization} />
                                        <div className='book-button-container'>
                                             <button className='book-button'>Đặt tư vấn</button>
                                        </div>
                                   </Card>
                              </Col>
                         ))}
                    </Row>

                    <div className='pagination-container'>
                         <Pagination
                              current={currentPage}
                              onChange={setCurrentPage}
                              total={10}
                              pageSize={8}
                         />
                    </div>
               </div>
          </MainLayout>         
     );
}

export default Appointment;