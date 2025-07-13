import React, { useEffect, useState } from 'react';
import { List, Card, Typography, Spin, message, Tabs, Tag, Space, Avatar, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, CalendarOutlined, MessageOutlined, EyeOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { questionApi, specialtyApi } from '../../services/api';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

// Thêm CSS để ẩn nền của .ant-tabs-content-holder
const customTabContentStyle = `
  .ant-tabs-content-holder {
    background: transparent !important;
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }
`;

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialtyMap, setSpecialtyMap] = useState({});
  const navigate = useNavigate();
  const userId = Cookies.get('userId');

  useEffect(() => {
    if (!userId) {
      message.error('Bạn cần đăng nhập để xem câu hỏi đã đặt!');
      navigate('/login');
      return;
    }
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await questionApi.getQuestionsByMember(userId);
        // Sort questions by submitDate (newest first)
        const sortedQuestions = (res.data || []).sort((a, b) => {
          const dateA = new Date(a.submitDate || 0);
          const dateB = new Date(b.submitDate || 0);
          return dateB - dateA;
        });
        setQuestions(sortedQuestions);
        // Lấy ra các specialtyId duy nhất
        const specialtyIds = Array.from(new Set((res.data || []).map(q => q.specialtyId).filter(Boolean)));
        // Gọi API lấy tên chuyên khoa cho từng id
        const specialtyMapTemp = {};
        await Promise.all(specialtyIds.map(async (id) => {
          try {
            const res = await specialtyApi.getSpecialtyById(id);
            specialtyMapTemp[id] = res.data?.data?.name || 'Chuyên khoa khác';
          } catch {
            specialtyMapTemp[id] = 'Chuyên khoa khác';
          }
        }));
        setSpecialtyMap(specialtyMapTemp);
      } catch {
        message.error('Không thể tải danh sách câu hỏi đã đặt');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [userId, navigate]);

  // Filter questions by status
  const rejected = questions.filter(q => q.status === 'Bị từ chối');
  const answered = questions.filter(q => q.status === 'Da dong' && q.status !== 'Bị từ chối');
  const unanswered = questions.filter(q => q.status !== 'Da dong' && q.status !== 'Bị từ chối');

  // Helper function to get status color and icon
  const getStatusInfo = (status) => {
    if (status === 'Bị từ chối') {
      return {
        color: '#ff4d4f',
        icon: <CloseCircleOutlined />,
        text: 'Bị từ chối'
      };
    } else if (status === 'Da dong') {
      return {
        color: '#ff4d4f',
        icon: <CheckCircleOutlined />,
        text: 'Đã đóng'
      };
    } else {
      return {
        color: '#52c41a',
        icon: <ClockCircleOutlined />,
        text: 'Đang mở'
      };
    }
  };

  // Helper function to get specialty name
  const getSpecialtyName = (specialtyId) => {
    return specialtyMap[specialtyId] || 'Chuyên khoa khác';
  };

  const renderQuestionCard = (item) => {
    const statusInfo = getStatusInfo(item.status);
    
    return (
      <Card
        key={item.questionId}
        style={{
          marginBottom: 16,
          border: '1px solid #e8e8e8',
          borderRadius: 12,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
        }}
        bodyStyle={{ padding: 20 }}
        hoverable
        onClick={() => navigate(`/question/${item.questionId}`)}
      >
        <div style={{ marginBottom: 12 }}>
          <Space size="middle" align="start">
            <Avatar
              icon={<UserOutlined />}
              size="small"
              style={{ backgroundColor: '#54AA7F' }}
            />
            <div style={{ flex: 1 }}>
              <Space size="small" style={{ marginBottom: 8 }}>
                <Text strong style={{ fontSize: 14 }}>
                  {item.gender}, {item.age} tuổi
                </Text>
                <Tag
                  color="#54AA7F"
                  style={{
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 500,
                    fontSize: 12
                  }}
                >
                  {getSpecialtyName(item.specialtyId)}
                </Tag>
                <Tag
                  color={statusInfo.color}
                  icon={statusInfo.icon}
                  style={{
                    border: 'none',
                    borderRadius: 6,
                    fontWeight: 500,
                    fontSize: 12
                  }}
                >
                  {statusInfo.text}
                </Tag>
              </Space>
            </div>
          </Space>
        </div>

        <Title level={4} style={{
          color: '#333333',
          margin: '12px 0',
          fontSize: 18,
          lineHeight: 1.4
        }}>
          {item.titleQuestion}
        </Title>

        <Paragraph
          ellipsis={{ rows: 2 }}
          style={{
            color: '#666666',
            marginBottom: 16,
            fontSize: 14,
            lineHeight: 1.5
          }}
        >
          {item.content}
        </Paragraph>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#888888',
          fontSize: 13
        }}>
          <Space size="large">
            <Space>
              <CalendarOutlined />
              <span>{dayjs(item.submitDate).format('DD/MM/YYYY HH:mm')}</span>
            </Space>
            <Space>
              <MessageOutlined />
              <span>{item.ansCount || 0} câu trả lời</span>
            </Space>
          </Space>

          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            style={{
              color: '#54AA7F',
              padding: 0
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/question/${item.questionId}`);
            }}
          >
            Xem chi tiết
          </Button>
        </div>
      </Card>
    );
  };

  const tabItems = [
    {
      key: 'unanswered',
      label: (
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          Đang mở ({unanswered.length})
        </span>
      ),
      children: (
        <div>
          {unanswered.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#888888'
            }}>
              <Text>Không có câu hỏi nào đang mở</Text>
            </div>
          ) : (
            unanswered.map(renderQuestionCard)
          )}
        </div>
      )
    },
    {
      key: 'answered',
      label: (
        <span>
          <CheckCircleOutlined style={{ marginRight: 8 }} />
          Đã đóng ({answered.length})
        </span>
      ),
      children: (
        <div>
          {answered.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#888888'
            }}>
              <Text>Không có câu hỏi nào đã đóng</Text>
            </div>
          ) : (
            answered.map(renderQuestionCard)
          )}
        </div>
      )
    },
    {
      key: 'rejected',
      label: (
        <span>
          <CloseCircleOutlined style={{ marginRight: 8 }} />
          Bị từ chối ({rejected.length})
        </span>
      ),
      children: (
        <div>
          {rejected.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 20px',
              color: '#888888'
            }}>
              <Text>Không có câu hỏi nào bị từ chối</Text>
            </div>
          ) : (
            rejected.map(renderQuestionCard)
          )}
        </div>
      )
    }
  ];

  return (
    <div style={{
      backgroundColor: '#ffffff',
      minHeight: '100vh',
      padding: '24px 0'
    }}>
      {/* Inject custom CSS for Antd Tabs content holder */}
      <style>{customTabContentStyle}</style>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>
        <Card
          style={{
            border: '1px solid #e8e8e8',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
          }}
          bodyStyle={{ padding: 24 }}
        >
          <div style={{ marginBottom: 32 }}>
            <Title level={2} style={{
              color: '#333333',
              marginBottom: 8,
              textAlign: 'center'
            }}>
              Câu hỏi của tôi
            </Title>
            <Text style={{
              color: '#666666',
              textAlign: 'center',
              display: 'block'
            }}>
              Quản lý và theo dõi tất cả câu hỏi bạn đã đặt
            </Text>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" />
            </div>
          ) : (
            <Tabs 
              defaultActiveKey="unanswered" 
              items={tabItems}
              style={{
                '& .ant-tabs-tab': {
                  fontSize: 16,
                  fontWeight: 500
                }
              }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default MyQuestions; 