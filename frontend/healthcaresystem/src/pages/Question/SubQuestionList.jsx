import React, { useEffect, useState } from 'react';
import { Collapse, Card, Button, Input, Form, Spin, message, Avatar } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { subQuestionApi, questionApi, getInfo } from '../../services/api';
import logo from '../../assets/imgs/logo.png';

const { Panel } = Collapse;

const SubQuestionList = ({ question, isConsultant, onQuestionAnswered, canAddSubQuestion }) => {
  const [subQuestions, setSubQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [answeringId, setAnsweringId] = useState(null);
  const [form] = Form.useForm();
  const [consultantInfo, setConsultantInfo] = useState(null);

  console.log('Consultant info:', consultantInfo);

  // Lấy danh sách sub-question
  const fetchSubQuestions = async () => {
    setLoading(true);
    try {
      const res = await subQuestionApi.getSubQuestions(question.id);
      console.log('Sub-questions response:', res.data);
      setSubQuestions(res.data);
    } catch (error) {
      console.error('Error fetching sub-questions:', error);
      setSubQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (question?.id) fetchSubQuestions();
    if (question?.consultantId) {
      getInfo(question.consultantId)
        .then(res => {
          console.log('Consultant info:', res.data); // Thêm log kiểm tra dữ liệu
          setConsultantInfo(res.data)
        })
        .catch(() => setConsultantInfo(null));
    }
    // eslint-disable-next-line
  }, [question?.id, question?.consultantId]);

  // Tạo sub-question mới (member)
  const handleCreate = async (values) => {
    setCreating(true);
    try {
      await subQuestionApi.addSubQuestion({
        ThreadItemId: 0,
        QuestionId: question.id,
        QuestionText: values.questionText,
        AnswerText: '',
        SentAt: new Date().toISOString(),
        AttachmentPath: '',
        IsAnswered: false,
      });
      // Sau khi tạo sub-question, cập nhật status câu hỏi cha về 'Chua tra loi'
      await questionApi.updateQuestionStatus(question.id, JSON.stringify("Chua tra loi"));
      message.success('Gửi câu hỏi thành công!');
      form.resetFields();
      fetchSubQuestions();
    } catch (error) {
      console.error('Error creating sub-question:', error);
      message.error('Gửi câu hỏi thất bại!');
    } finally {
      setCreating(false);
    }
  };

  // Consultant trả lời sub-question
  const handleAnswer = async (values) => {
    setAnsweringId('');
    try {
      console.log('SubQuestions length:', subQuestions.length);
      console.log('Question ID:', question.id);
      console.log('Answer values:', values);
      let answerPayload;
      if (!values.threadItemId || values.threadItemId === 0) {
        // Trả lời cho cha hoặc sub-question đầu tiên
        answerPayload = {
          ThreadItemId: 0,
          QuestionId: question.id,
          QuestionText: question.content,
          AnswerText: values.answerText,
          SentAt: new Date().toISOString(),
          AnsweredAt: new Date().toISOString(),
          AttachmentPath: '',
          IsAnswered: true,
        };
      } else {
        // Trả lời cho sub-question cụ thể
        const sub = subQuestions.find(sq => sq.threadItemId === values.threadItemId);
        answerPayload = {
          ThreadItemId: sub.threadItemId,
          QuestionId: question.id,
          QuestionText: sub.questionText || question.content,
          AnswerText: values.answerText,
          SentAt: sub.sentAt || new Date().toISOString(),
          AnsweredAt: new Date().toISOString(),
          AttachmentPath: sub.attachmentPath || '',
          IsAnswered: true,
        };
      }
      console.log('Payload gửi lên answerSubQuestion:', answerPayload);
      const answerResponse = await subQuestionApi.answerSubQuestion(answerPayload);
      console.log('Answer sub-question response:', answerResponse);
      // Cập nhật trạng thái câu hỏi chính thành "đã trả lời"
      try {
        await questionApi.updateQuestionStatus(question.id, JSON.stringify("Da tra loi"));
      } catch (err) {
        console.error('Lỗi update status:', err);
      }
      message.success('Trả lời thành công!');
      fetchSubQuestions();
      if (onQuestionAnswered) {
        onQuestionAnswered();
      }
    } catch (error) {
      console.error('Error in handleAnswer:', error);
      message.error('Trả lời thất bại!');
    }
  };

  // Hiển thị tất cả sub-questions
  const allSubQuestions = subQuestions || [];

  // Form riêng cho panel đầu tiên
  const [firstPanelForm] = Form.useForm();

  return (
    <Card title="Trao đổi chi tiết" style={{ marginTop: 24 }}>
      {loading ? (
        <Spin />
      ) : (
        <Collapse accordion>
          {allSubQuestions.length === 0 ? (
            // Nếu chưa có sub-question, render panel câu hỏi cha
            <Panel
              header={
                <div>
                  <Avatar src={logo} style={{ marginRight: 8 }} />
                  <b>{question.gender}, {question.age} tuổi</b> - {question.title}
                  <span style={{ marginLeft: 16, color: '#888' }}>{dayjs(question.submitDate).format('DD/MM/YYYY')}</span>
                </div>
              }
              key="parent"
            >
              <div style={{ marginBottom: 8 }}>{question.content}</div>
              {isConsultant && (
                <Form
                  form={firstPanelForm}
                  onFinish={(values) => handleAnswer({
                    ...values,
                    threadItemId: 0,
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
            </Panel>
          ) : (
            // Nếu đã có sub-question, render tất cả các panel sub-question
            allSubQuestions.map((sub) => (
              <Panel
                header={
                  <div>
                    <Avatar src={logo} style={{ marginRight: 8 }} />
                    <b>Hỏi:</b> {sub.questionText || 'Không có nội dung'}
                    <span style={{ marginLeft: 16, color: '#888' }}>
                      {sub.sentAt ? dayjs(sub.sentAt).format('DD/MM/YYYY') : 'Không có ngày'}
                    </span>
                  </div>
                }
                key={`sub-${sub.threadItemId}`}
              >
                {/* Nếu đã có trả lời */}
                {sub.answerText ? (
                  <div style={{ background: '#f6ffed', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Avatar src={consultantInfo?.avatar && consultantInfo.avatar.trim() !== '' ? consultantInfo.avatar : logo} />
                    <b>{consultantInfo?.fullName || consultantInfo?.name || 'Bác sĩ'}</b>
                    <span style={{ marginLeft: 8 }}>{sub.answerText}</span>
                  </div>
                ) : (
                  isConsultant ? (
                    <Form
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
            ))
          )}
        </Collapse>
      )}

      {/* Form tạo sub-question mới, chỉ hiển thị nếu canAddSubQuestion là true */}
      {canAddSubQuestion && !isConsultant && (
        <Form
          form={form}
          onFinish={handleCreate}
          layout="vertical"
          style={{ marginTop: 24 }}
        >
          <Form.Item name="questionText" label="Thêm câu hỏi trao đổi" rules={[{ required: true, message: 'Nhập nội dung câu hỏi' }]}> 
            <Input.TextArea rows={2} placeholder="Nhập nội dung câu hỏi..." />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={creating} icon={<PlusOutlined />}>Gửi câu hỏi</Button>
        </Form>
      )}
    </Card>
  );
};

export default SubQuestionList; 