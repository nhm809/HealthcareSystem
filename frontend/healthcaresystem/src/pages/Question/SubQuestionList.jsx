import React, { useEffect, useState } from 'react';
import { Collapse, Card, Button, Input, Form, Spin, message, Avatar } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import api from '../../services/api';
import { subQuestionApi } from '../../services/api';

const { Panel } = Collapse;

const SubQuestionList = ({ question, isConsultant }) => {
  const [subQuestions, setSubQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [answeringId, setAnsweringId] = useState(null);
  const [form] = Form.useForm();
  const [answerForm] = Form.useForm();

  // Lấy danh sách sub-question
  const fetchSubQuestions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/subQuestion/get/${question.id}`);
      setSubQuestions(res.data);
    } catch {
      setSubQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (question?.id) fetchSubQuestions();
    // eslint-disable-next-line
  }, [question?.id]);

  // Tạo sub-question mới (member)
  const handleCreate = async (values) => {
    setCreating(true);
    try {
      await api.post('/subQuestion/add', {
        ThreadItemId: 0,
        QuestionId: question.id,
        QuestionText: values.questionText,
        AnswerText: '',
        SentAt: new Date().toISOString(),
        AttachmentPath: '',
        IsAnswered: false,
      });
      message.success('Gửi câu hỏi thành công!');
      form.resetFields();
      fetchSubQuestions();
    } catch {
      message.error('Gửi câu hỏi thất bại!');
    } finally {
      setCreating(false);
    }
  };

  // Consultant trả lời sub-question
  const handleAnswer = async (values) => {
    setAnsweringId('');
    try {
      await subQuestionApi.answerSubQuestion({
        ThreadItemId: values.threadItemId,
        QuestionId: question.id,
        QuestionText: values.questionText,
        AnswerText: values.answerText,
        SentAt: new Date().toISOString(),
        AttachmentPath: '',
        IsAnswered: true,
      });
      message.success('Trả lời thành công!');
      answerForm.resetFields();
      fetchSubQuestions();
    } catch {
      message.error('Trả lời thất bại!');
    }
  };

  // Hiển thị sub-question đầu tiên lấy từ câu hỏi cha
  const firstSub = subQuestions.length > 0 ? subQuestions[0] : null;

  return (
    <Card title="Trao đổi chi tiết" style={{ marginTop: 24 }}>
      {loading ? (
        <Spin />
      ) : (
        <Collapse accordion>
          {/* Sub-question đầu tiên lấy từ câu hỏi cha */}
          <Panel
            header={
              <div>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                <b>{question.gender}, {question.age} tuổi</b> - {question.title}
                <span style={{ marginLeft: 16, color: '#888' }}>{dayjs(question.submitDate).format('DD/MM/YYYY')}</span>
              </div>
            }
            key="parent"
          >
            <div style={{ marginBottom: 8 }}>{question.content}</div>
            {/* Consultant trả lời */}
            {isConsultant && !firstSub?.answerText && (
              <Form
                form={answerForm}
                onFinish={(values) => handleAnswer({
                  ...values,
                  threadItemId: firstSub?.threadItemId || 0,
                  questionText: question.content,
                })}
                layout="vertical"
              >
                <Form.Item name="answerText" label="Trả lời" rules={[{ required: true, message: 'Nhập câu trả lời' }]}> 
                  <Input.TextArea rows={2} placeholder="Nhập câu trả lời..." />
                </Form.Item>
                <Button type="primary" htmlType="submit">Gửi trả lời</Button>
              </Form>
            )}
            {firstSub?.answerText && (
              <div style={{ marginTop: 12, background: '#f6ffed', padding: 12, borderRadius: 8 }}>
                <b>Bác sĩ trả lời:</b> {firstSub.answerText}
              </div>
            )}
          </Panel>

          {/* Các sub-question tiếp theo */}
          {subQuestions.slice(1).map((sub) => (
            <Panel
              header={
                <div>
                  <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                  <b>Hỏi:</b> {sub.questionText}
                  <span style={{ marginLeft: 16, color: '#888' }}>{dayjs(sub.sentAt).format('DD/MM/YYYY')}</span>
                </div>
              }
              key={sub.threadItemId}
            >
              {/* Nếu đã có trả lời */}
              {sub.answerText ? (
                <div style={{ background: '#f6ffed', padding: 12, borderRadius: 8 }}>
                  <b>Bác sĩ trả lời:</b> {sub.answerText}
                </div>
              ) : (
                isConsultant ? (
                  <Form
                    form={answerForm}
                    onFinish={(values) => handleAnswer({
                      ...values,
                      threadItemId: sub.threadItemId,
                      questionText: sub.questionText,
                    })}
                    layout="vertical"
                  >
                    <Form.Item name="answerText" label="Trả lời" rules={[{ required: true, message: 'Nhập câu trả lời' }]}> 
                      <Input.TextArea rows={2} placeholder="Nhập câu trả lời..." />
                    </Form.Item>
                    <Button type="primary" htmlType="submit">Gửi trả lời</Button>
                  </Form>
                ) : (
                  <div style={{ color: '#888' }}>Chờ bác sĩ trả lời...</div>
                )
              )}
            </Panel>
          ))}
        </Collapse>
      )}

      {/* Form tạo sub-question mới cho member */}
      {!isConsultant && (
        <Form form={form} onFinish={handleCreate} layout="vertical" style={{ marginTop: 24 }}>
          <Form.Item name="questionText" label="Đặt câu hỏi tiếp theo" rules={[{ required: true, message: 'Nhập câu hỏi' }]}> 
            <Input.TextArea rows={2} placeholder="Nhập câu hỏi tiếp theo..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={creating} icon={<PlusOutlined />}>Gửi câu hỏi</Button>
        </Form>
      )}
    </Card>
  );
};

export default SubQuestionList; 