import React, { useState, useEffect } from 'react';
import banner from '../../assets/imgs/banner.png';
import './Home.css';
import 'antd/dist/reset.css';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Item from 'antd/es/list/Item';
import { Card } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import MainLayout from '../../components/Layout/Layout';
import isha1 from '../../assets/imgs/isha1.png';
import secury from '../../assets/imgs/secury.png';

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
    content: 'Mỗi khi lo lắng về sức khỏe mà ngại đến bệnh viện, mình lại vào đây hỏi bác sĩ. Chỉ cần gửi câu hỏi ở mục HỎI BÁC SĨ là có chuyên gia trả lời ngay. Họ giải đáp chi tiết, dễ hiểu mà mình vẫn được giữ kín thông tin cá nhân..',
    avatar: 'https://i.pravatar.cc/100?img=20',
  },
  {
    id: 3,
    name: 'Anh Lê Văn Hùng',
    content: 'Có mấy vấn đề tế nhị mà không biết hỏi ai, mình thử đăng lên mục HỎI BÁC SĨ thì được phản hồi liền. Các bác sĩ tư vấn tận tình, chuyên môn vững, lại không cần lộ danh tính, đúng là giải pháp quá tuyệt vời luôn!.',
    avatar: 'https://i.pravatar.cc/100?img=30',
  },
  {
    id: 4,
    name: 'Chị Trần Thị Mai',
    content: 'Lúc gặp rắc rối sức khỏe, mình vào đây hỏi bác sĩ cho yên tâm. Các bác sĩ trả lời nhanh, rõ ràng và rất tận tâm. Đặc biệt là mình không cần lo lắng về bảo mật thông tin cá nhân vì được ẩn danh hoàn toàn..',
    avatar: 'https://i.pravatar.cc/100?img=40',
  },
  {
    id: 5,
    name: 'Anh Nguyễn Văn Bình',
    content: 'Nhiều khi có triệu chứng lạ mà không biết là bình thường hay bệnh, mình hỏi thử trong mục HỎI BÁC SĨ thì được bác sĩ giải thích rất rõ. Hỏi dễ, nhận câu trả lời nhanh mà lại còn được giữ riêng tư tuyệt đối..',
    avatar: 'https://i.pravatar.cc/100?img=50',
  },
  {
    id: 6,
    name: 'Chị Lê Thị Thu',
    content: 'Cứ có gì bất thường về sức khỏe là mình lên mục HỎI BÁC SĨ ngay. Ở đây có đội ngũ bác sĩ giỏi, tư vấn tận tình mà chẳng cần phải lộ danh tính. Cảm giác yên tâm hơn hẳn so với việc tự tra trên mạng lung tung..',
    avatar: 'https://i.pravatar.cc/100?img=60',
  },
  {
    id: 7,
    name: 'Anh Phạm Quốc Toàn',
    content: 'Tôi rất hài lòng với dịch vụ chăm sóc khách hàng.',
    avatar: 'https://i.pravatar.cc/100?img=70',
  },
];

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % feedbacks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => setAnimate(false), 500);
    return () => clearTimeout(timeout);
  }, [activeIndex]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + feedbacks.length) % feedbacks.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % feedbacks.length);
  };

  // Lấy ra 3 avatar: trước, đang chọn, sau
  const getVisibleAvatars = () => {
    const total = feedbacks.length;
    let prev = (activeIndex - 1 + total) % total;
    let next = (activeIndex + 1) % total;
    return [
      { ...feedbacks[prev], isActive: false },
      { ...feedbacks[activeIndex], isActive: true },
      { ...feedbacks[next], isActive: false },
    ];
  };

  return (
    <div>
      {/* Start: Banner */}
      <img className="banner-img" src={banner} alt="Healthcare Banner" />
      {/* End: Banner */}

      <MainLayout>
        <div className="Main-content">
          {/* Cảm nhân  */}


          {/* Start: customer feedback */}
          <div className="customer-feedback">
            <h1 className="tile-feedback">Cảm nhận từ phía khác hàng</h1>
            <div className="feedback-box">
              <div className="feedback-left">
                <UpOutlined onClick={handlePrev} />

                <div className="avatars">
                  {getVisibleAvatars().map((item, idx) => {
                    // idx: 0 = prev, 1 = active, 2 = next
                    let onClick = undefined;
                    if (idx === 0) {
                      onClick = handlePrev;
                    } else if (idx === 2) {
                      onClick = handleNext;
                    }
                    return (
                      <img
                        key={item.id}
                        src={item.avatar}
                        alt="avatar"
                        className={item.isActive ? 'avatar active' : 'avatar'}
                        style={{ margin: '10px 0', cursor: idx !== 1 ? 'pointer' : 'default' }}
                        onClick={onClick}
                      />
                    );
                  })}
                </div>
                <DownOutlined onClick={handleNext} />
              </div>
              <div className={`feedback-right${animate ? ' fade-in' : ''}`}>
                <div className="customer">
                  <p className="customer-name">
                    {feedbacks[activeIndex].name.startsWith('Anh') || feedbacks[activeIndex].name.startsWith('Chị')
                      ? feedbacks[activeIndex].name
                      : `Anh/Chị ${feedbacks[activeIndex].name}`}
                  </p>
                </div>
                <p className="customer-content">{feedbacks[activeIndex].content}</p>
              </div>
            </div>
          </div>

          {/* End: customer feedback */}

          {/*  Start: Test STIs*/}
          <div className="test-introduce">
            <div className="test-tile">
              <h1 className="test-tile-1">Đăng ký xét nghiệp nhanh chóng</h1>
              <h1 className="test-tile-2">Không chờ đợi</h1>
            </div>

            <div className="box-test-introduce">
              <div className="box-1-test-introduce">
                <div className="box-left">
                  <h3>Đặt xét nghiệm nhanh chóng</h3>
                  <p>Đặt lịch xét nghiệm nhanh chóng với chức năng đặt lịch trên Website của chúng tôi chỉ với vài bước.</p>
                </div>

                <div className="box-right">
                  <img src={isha1} alt="" />
                </div>
              </div>

              <div className="box-2-test-introduce">
                <div className="box-left">
                  <h3>Bảo mật tuyệt đối</h3>
                  <p>Thông tin cá nhân và kết quả được bảo vệ ở mức cao nhất.</p>
                </div>

                <div className="box-right">
                  <img src={secury} />
                </div>
              </div>
            </div>

            <div className="box-test-proccess">
              <div className="proccess-tile">
                <h1 className="test-tile-2">Quy trình xét nghiệm đơn giản</h1>
              </div>

              <div className="box-test-parent">
                <div className="box-test-child">
                  <div className="proccess-component">
                    <div className="process-number">
                      <h3>1</h3>
                    </div>
                    <p>
                      Đăng ký xét nghiệm qua website
                    </p>
                    <img src={isha1} alt="" />
                  </div>
                </div>

                <div className="box-test-child">
                  <div className="proccess-component">
                    <div className="process-number">
                      <h3>1</h3>
                    </div>
                    <p>
                      Đăng ký xét nghiệm qua website
                    </p>
                    <img src={isha1} alt="" />
                  </div>
                </div>


                <div className="box-test-child">
                  <div className="proccess-component">
                    <div className="process-number">
                      <h3>1</h3>
                    </div>
                    <p>
                      Đăng ký xét nghiệm qua website
                    </p>
                    <img src={isha1} alt="" />
                  </div>
                </div>


                <div className="box-test-child">
                  <div className="proccess-component">
                    <div className="process-number">
                      <h3>1</h3>
                    </div>
                    <p>
                      Đăng ký xét nghiệm qua website
                    </p>
                    <img src={isha1} alt="" />
                  </div>
                </div>
              </div>
            </div>

          </div>


          {/*  End: Test STIs*/}


        </div>

      </MainLayout>
    </div>



  );
}

export default Home;