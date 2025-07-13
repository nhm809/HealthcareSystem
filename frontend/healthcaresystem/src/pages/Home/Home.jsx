import React, { useState, useEffect } from 'react';
import banner from '../../assets/imgs/banner.png';
import './Home.css';
import 'antd/dist/reset.css';
import { Button, Upload } from 'antd';
import { UpOutlined, DownOutlined, CalendarOutlined, ForwardOutlined } from '@ant-design/icons';
import MainLayout from '../../components/Layout/Layout';
import isha1 from '../../assets/imgs/isha1.png';
import testprocess1 from '../../assets/imgs/testprocess1.png';
import testprocess2 from '../../assets/imgs/testprocess2.png';
import testprocess3 from '../../assets/imgs/testprocess3.png';
import testprocess4 from '../../assets/imgs/testprocess4.png';
import menstrual1 from '../../assets/imgs/menstrual1.png';
import menstrual2 from '../../assets/imgs/menstrual2.png';
import menstrual3 from '../../assets/imgs/menstrual3.png';
import menstrual4 from '../../assets/imgs/menstrual4.png';
import malefemaledoctor from '../../assets/imgs/malefemaledoctor.png';
import secury from '../../assets/imgs/secury.png';
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';


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
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [animate, setAnimate] = useState(false);

  // Khởi tạo AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: 'ease-in-out'
    });
  }, []);

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
          <div className="customer-feedback" data-aos="fade-up">
            <h1 className="tile-feedback" data-aos="fade-down">Cảm nhận từ phía khác hàng</h1>
            <div className="feedback-box" data-aos="fade-up" data-aos-delay="200">
              <div className="feedback-left" data-aos="fade-right" data-aos-delay="300">
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
              <div className={"feedback-right"} data-aos="fade-left" data-aos-delay="400">
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
          <div className="test-introduce" style={{ display: 'flex', flexDirection: 'column', gap: '40px' }} data-aos="fade-up">
            <div className="test-tile" data-aos="fade-down">
              <h1 className="test-tile-1">Đăng ký xét nghiệp nhanh chóng</h1>
              <h1 className="test-tile-2">Không chờ đợi</h1>
            </div>

            <div className="box-test-introduce" style={{ display: 'flex', flexDirection: 'row', gap: '20px', width: '100%' }} data-aos="fade-up" data-aos-delay="200">
              <div className="box-1-test-introduce" style={{ flex: '1' }} data-aos="fade-right" data-aos-delay="300">
                <div className="box-left">
                  <h3>Đặt xét nghiệm nhanh chóng</h3>
                  <p>Đặt lịch xét nghiệm nhanh chóng với chức năng đặt lịch trên Website của chúng tôi chỉ với vài bước.</p>
                </div>

                <div className="box-right">
                  <img src={isha1} alt="" />
                </div>
              </div>

              <div className="box-2-test-introduce" style={{ flex: '1' }} data-aos="fade-left" data-aos-delay="400">
                <div className="box-left">
                  <h3>Bảo mật tuyệt đối</h3>
                  <p>Thông tin cá nhân và kết quả được bảo vệ ở mức cao nhất.</p>
                </div>

                <div className="box-right">
                  <img src={secury} />
                </div>
              </div>
            </div>

            <div className="box-test-proccess" data-aos="fade-up" data-aos-delay="500">
              <div className="proccess-tile">
                <h1 className="test-tile-2">Quy trình xét nghiệm đơn giản</h1>
              </div>

              <div className="process-test-inside">
                <div className="box-test-parent" style={{ display: 'flex', flexDirection: 'row', gap: '10px', width: '100%' }}>
                  <div className="box-test-child" style={{ flex: '1' }} data-aos="zoom-in" data-aos-delay="600">
                    <div className="proccess-component">
                      <div className="process-number">
                        <h3>1</h3>
                      </div>
                      <p>
                        Đăng ký xét nghiệm qua website
                      </p>
                      <img src={testprocess1} alt="" />
                    </div>
                  </div>

                  <div className="box-test-child" style={{ flex: '1' }} data-aos="zoom-in" data-aos-delay="700">
                    <div className="proccess-component">
                      <div className="process-number">
                        <h3>2</h3>
                      </div>
                      <p>
                        Gửi mẫu xét nghiệm tại cơ sở y tế
                      </p>
                      <img src={testprocess2} alt="" />
                    </div>
                  </div>

                  <div className="box-test-child" style={{ flex: '1' }} data-aos="zoom-in" data-aos-delay="800">
                    <div className="proccess-component">
                      <div className="process-number">
                        <h3>3</h3>
                      </div>
                      <p>
                        Kết quả sẽ được gửi về Mail/Website
                      </p>
                      <img src={testprocess3} alt="" />
                    </div>
                  </div>

                  <div className="box-test-child" style={{ flex: '1' }} data-aos="zoom-in" data-aos-delay="900">
                    <div className="proccess-component">
                      <div className="process-number">
                        <h3>4</h3>
                      </div>
                      <p>
                        Bác sĩ đánh giá kết quả và kê đơn điều trị chuyên khoa
                      </p>
                      <img src={testprocess4} alt="" />
                    </div>
                  </div>

                </div>

                <Button type="primary" style={{ margin: '20px' }} className="book-test-btn" onClick={() => navigate('/test-sti')}>
                  <CalendarOutlined />
                  Đặt lịch ngay
                </Button>

              </div>
            </div>

            <div className="appointment" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }} data-aos="fade-up" data-aos-delay="1000">
              <div className="appointment-left" style={{ flex: '1' }} data-aos="fade-right" data-aos-delay="1100">
                <h3>Đặt lịch tư vấn online 1-1 với bác sĩ chuyên môn</h3>
                <p>Nhanh chóng kết nối với các chuyên gia hàng đầu, nhận tư vấn cá nhân hóa về sức khỏe sinh sản và các vấn đề bạn quan tâm, ngay tại nhà.</p>
                <Button type="primary" className="book-test-btn" onClick={() => navigate('/appointment')}>
                  <CalendarOutlined />
                  Đặt lịch ngay
                </Button>
              </div>

              <div className="appointment-right" style={{ flex: '1' }} data-aos="fade-left" data-aos-delay="1200">
                  <img src={malefemaledoctor} alt="" />
              </div>

            </div>

          </div>


          {/*  End: Test STIs*/}


          {/* Start: chu ky sinh san */}





          <div className="menstrual-cycle" data-aos="fade-up">
            <div className="menstrual-cycle-left" data-aos="fade-right" data-aos-delay="200">
              <h1>Theo dõi chu kỳ sinh sản</h1>
                      <p>Hệ thống theo dõi chu kỳ kinh sản bằng cách dựa trên chu kỳ kinh nguyệt. Giúp bạn chủ động kiểm soát và bảo vệ sức khỏe sinh sản của mình mọi lúc, mọi nơi.</p>
                      <Button type="primary" className="book-test-btn" onClick={() => navigate('/reproductive-cycle')}>
                Dùng ngay
                  <ForwardOutlined />
                </Button>
            </div>
            <div className="menstrual-cycle-right" data-aos="fade-left" data-aos-delay="300">
              <img src={menstrual1} alt="" />
              <img src={menstrual2} alt="" />
              <img src={menstrual3} alt="" />
              <img src={menstrual4} alt="" />
            </div>
          </div>




          {/* End: chu ky sinh san */}

          {/* Start: Question */}
          <div className="question" data-aos="fade-up">
            <div className="question-left" data-aos="fade-right" data-aos-delay="200">
              <h3>Câu hỏi thường gặp</h3>
              <p>Chúng tôi hiểu bạn có nhiều thắc mắc về các dịch vụ cũng như các vấn đề y khoa.</p>
            </div>

            <div className="question-right" data-aos="fade-left" data-aos-delay="300">
              <Button type="primary" className="book-test-btn" onClick={() => navigate('/question')}>
                Hãy đặt câu hỏi cho chúng tôi ngay
              </Button>
            </div>
          </div>
          {/* End: Question */}



          <div style={{ height: '100px' }}></div>
        </div>

      </MainLayout>
    </div>



  );
}

export default Home;