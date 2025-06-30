import React, { useEffect, useState } from 'react';
import { List, Card, Typography, Spin, message, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { questionApi } from '../../services/api';
import dayjs from 'dayjs';

const { Title } = Typography;

const MyQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setQuestions(res.data || []);
      } catch {
        message.error('Không thể tải danh sách câu hỏi đã đặt');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [userId, navigate]);

  const answered = questions.filter(q => q.isAnswered);
  const unanswered = questions.filter(q => !q.isAnswered);

  const tabItems = [
    {
      key: 'answered',
      label: `Đã trả lời (${answered.length})`,
      children: (
        <List
          dataSource={answered}
          locale={{ emptyText: 'Không có câu hỏi nào đã được trả lời.' }}
          renderItem={item => (
            <List.Item
              style={{
                cursor: 'pointer',
                padding: '18px 28px',
                margin: '12px 0',
                borderRadius: 10,
                background: '#f9f9f9',
                border: '1px solid #f0f0f0',
                transition: 'background 0.2s',
                minHeight: 60
              }}
              onClick={() => navigate(`/question/${item.questionId}`)}
            >
              <List.Item.Meta
                title={<span style={{ fontWeight: 600, fontSize: 17, color: '#1a3e72' }}>{item.titleQuestion}</span>}
                description={<span style={{ color: '#888', fontSize: 14 }}>{dayjs(item.submitDate).format('DD/MM/YYYY')}</span>}
              />
            </List.Item>
          )}
        />
      )
    },
    {
      key: 'unanswered',
      label: `Chưa trả lời (${unanswered.length})`,
      children: (
        <List
          dataSource={unanswered}
          locale={{ emptyText: 'Không có câu hỏi nào chưa được trả lời.' }}
          renderItem={item => (
            <List.Item
              style={{
                cursor: 'pointer',
                padding: '18px 28px',
                margin: '12px 0',
                borderRadius: 10,
                background: '#f9f9f9',
                border: '1px solid #f0f0f0',
                transition: 'background 0.2s',
                minHeight: 60
              }}
              onClick={() => navigate(`/question/${item.questionId}`)}
            >
              <List.Item.Meta
                title={<span style={{ fontWeight: 600, fontSize: 17, color: '#1a3e72' }}>{item.titleQuestion}</span>}
                description={<span style={{ color: '#888', fontSize: 14 }}>{dayjs(item.submitDate).format('DD/MM/YYYY')}</span>}
              />
            </List.Item>
          )}
        />
      )
    }
  ];

  return (
    <Card style={{ maxWidth: 700, margin: '32px auto' }}>
      <Title level={3} style={{ marginBottom: 24 }}>Câu hỏi đã đặt</Title>
      {loading ? (
        <Spin />
      ) : (
        <Tabs defaultActiveKey="unanswered" items={tabItems} />
      )}
    </Card>
  );
};

export default MyQuestions; 