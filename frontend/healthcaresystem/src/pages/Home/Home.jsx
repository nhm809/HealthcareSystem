import React, { useState } from 'react';
import banner from '../../assets/banner.png';
import './Home.css';
import 'antd/dist/reset.css';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Item from 'antd/es/list/Item';

const feedbacks = [
  {
    id: 1,
    name: 'Anh Trịnh Trần Phương Tuấn',
    content: ' khi thắc mắc mấy vấn đề nhạy cảm mà chả biết hỏi ai, cũng may nhờ các bác sĩ trên Website nhiệt tình giải đáp. Mọi người có câu hỏi nào cứ vào mục HỎI BÁC SĨ trên đây để được giải đáp nhé. Các bác sĩ ở đây chuyên môn cao mà tận tâm lắm mà còn được ẩn danh nữa nha.',
    avatar: 'https://i.pravatar.cc/100?img=10',
  },

  {
    id: 2,
    name: 'Chị Nguyễn Thị Hồng',
    content: 'Các bác sĩ rất tận tâm, tư vấn kỹ lưỡng và bảo mật thông tin.',
    avatar: 'https://i.pravatar.cc/100?img=20',
  },

  {
    id: 3,
    name: 'Anh Lê Văn Hùng',
    content: 'Website dễ sử dụng, tôi rất yên tâm khi đặt câu hỏi tại đây.',
    avatar: 'https://i.pravatar.cc/100?img=30',
  },
]

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % feedbacks.length);
  };

  return (
    <div className="home-container">
          <div className="Main-content">
            <img class="banner-img" src={banner} alt="Healthcare Banner"/>

            <div className="customer-feedback">
              <h1 className="tile-feedback">Cảm nhận từ phía khác hàng</h1>
              <div className="feedback-box">
                <div className="feedback-left">
                  <button onClick={handlePrev}>▲</button>
                  <div className="avatars">
                    {feedbacks.map((item, index) => (
                      <img
                        key={item.id}
                        src={item.avatar}
                        alt="avatar"
                        className={index === activeIndex ? 'avatar active' : 'avatar'}
                      />
                    ))}
                  </div>
                  <button onClick={handleNext}>▼</button>
                </div>

                <div className="feedback-right">
                    <p className="customer-name">
                      Anh <span>{feedbacks[activeIndex].name}</span>
                    </p>
                    <p className="customer-content">{feedbacks[activeIndex].content}</p>
                </div>
              </div>
            </div>  
          </div>
    </div>
  );
}

export default Home;