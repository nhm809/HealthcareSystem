import { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Tag, Input, List, Pagination, Form, Select, Upload, Button, Radio, Spin, message } from 'antd';
import { PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import MainLayout from '@components/Layout/Layout';
import { questionApi, messageApi } from '@services/api';
import Cookies from 'js-cookie';
import AuthModal from '@components/Header/AuthModal/AuthModal';
import { ToastContext } from '../../contexts/ToastProvider';

function Question() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { toast } = useContext(ToastContext);
    const [searchText, setSearchText] = useState('');
    const [filterSpecialty, setFilterSpecialty] = useState('');
    const [messages, setMessages] = useState([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const userId = Cookies.get('userId');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userRole = userInfo.roleId;

    const mockAnswers = [
        {
            id: 1,
            author: 'Hồ Minh Tâm',
            content: 'Chào em, không biết triệu chứng đau đầu của em có diễn ra thường xuyên không và thường kéo dài khoảng bao lâu?',
            date: '21/05/2025',
            isConsultant: true,
        },
        {
            id: 2,
            author: 'Nữ, 16 tuổi',
            content: 'Dạ em đau đầu cả 2 tuần nay liên tục suốt cả ngày ạ.',
            date: '21/05/2025',
            isConsultant: false,
        },
        {
            id: 3,
            author: 'Hồ Minh Tâm',
            content: 'Ngoài đau đầu ra em còn có triệu chứng gì nữa không',
            date: '21/05/2025',
            isConsultant: true,
        },
    ];

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const res = await questionApi.getAllQuestions();
                // Chuyển đổi dữ liệu API sang format phù hợp để render
                const data = res.data.map(q => ({
                    id: q.questionId,
                    topic: q.specialty,
                    title: q.titleQuestion,
                    date: q.submitDate ? new Date(q.submitDate).toLocaleDateString('vi-VN') : '',
                    content: q.content,
                    answers: q.isAnswered ? 1 : 0,
                    gender: q.gender,
                    age: q.age,
                    likes: 0,
                    submitDate: q.submitDate ? new Date(q.submitDate) : null,
                    memberId: q.memberId,
                }));
                // Sắp xếp mới nhất lên đầu
                data.sort((a, b) => (b.submitDate?.getTime() || 0) - (a.submitDate?.getTime() || 0));
                setQuestions(data);
            } catch {
                message.error('Không thể tải danh sách câu hỏi');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    // Lọc câu hỏi theo searchText và filterSpecialty
    const filteredQuestions = questions.filter(q => {
        const matchSearch =
            q.title.toLowerCase().includes(searchText.toLowerCase()) ||
            q.content.toLowerCase().includes(searchText.toLowerCase());
        const matchSpecialty = filterSpecialty ? q.topic === filterSpecialty : true;
        return matchSearch && matchSpecialty;
    });
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pagedQuestions = filteredQuestions.slice(startIdx, endIdx);

    // Lấy message khi chọn câu hỏi
    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedQuestion) return;
            setLoadingMessages(true);
            try {
                const res = await messageApi.getHistory(selectedQuestion.id);
                setMessages(res.data);
            } catch {
                setMessages([]);
            } finally {
                setLoadingMessages(false);
            }
        };
        fetchMessages();
    }, [selectedQuestion]);

    // Hàm upload ảnh lên Cloudinary
    const uploadToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'healthcare');
        const response = await fetch(
            'https://api.cloudinary.com/v1_1/dktu0nbjx/image/upload',
            {
                method: 'POST',
                body: formData,
            }
        );
        const data = await response.json();
        return data.secure_url;
    };

    const handleSubmit = async (values) => {
        const userId = Cookies.get('userId');
        if (!userId) {
            setAuthModalOpen(true);
            return;
        }
        let attachmentPath = '';
        if (values.image && values.image.fileList && values.image.fileList.length > 0) {
            const file = values.image.fileList[0].originFileObj;
            if (file) {
                try {
                    attachmentPath = await uploadToCloudinary(file);
                } catch {
                    toast.error('Tải ảnh lên thất bại!');
                    return;
                }
            }
        }
        const payload = {
            memberId: Number(userId),
            specialty: values.specialty,
            titleQuestion: values.title,
            content: values.content,
            attachmentPath,
            age: Number(values.age),
            gender: values.gender,
        };
        try {
            setLoading(true);
            await questionApi.addQuestion(payload);
            toast.success('Gửi câu hỏi thành công!');
            window.location.reload();
            form.resetFields();
        } catch (err) {
            toast.error('Gửi câu hỏi thất bại!');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!replyContent.trim() || !selectedQuestion) return;
        try {
            await messageApi.addMessage({
                questionId: selectedQuestion.id,
                content: replyContent,
                senderId: Number(userId),
            });
            setReplyContent('');
            setShowReplyBox(false);
            // Reload lại message history
            setLoadingMessages(true);
            const res = await messageApi.getHistory(selectedQuestion.id);
            setMessages(res.data);
        } catch {
            toast.error('Gửi tin nhắn thất bại!');
        } finally {
            setLoadingMessages(false);
        }
    };

    return (
        <MainLayout>
            <Row gutter={24}>
                <Col span={14}>
                    <Card>
                        {selectedQuestion ? (
                            <div>
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                    type="link"
                                    onClick={() => setSelectedQuestion(null)}
                                    style={{ marginBottom: 8, padding: 0 }}
                                >
                                    Quay lại
                                </Button>
                                <div style={{ marginBottom: 8 }}>
                                    <b>{selectedQuestion.gender}, {selectedQuestion.age} tuổi</b>
                                    <Tag color="green">{selectedQuestion.topic}</Tag>
                                    <Tag color={selectedQuestion.isAnswered ? 'blue' : 'orange'}>
                                        {selectedQuestion.isAnswered ? 'Đã trả lời' : 'Đang mở'}
                                    </Tag>
                                </div>
                                <div style={{ fontWeight: 600, color: '#2B7A4B', marginBottom: 4 }}>{selectedQuestion.title}</div>
                                <div style={{ marginBottom: 8 }}>{selectedQuestion.content}</div>
                                <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
                                    <span>{selectedQuestion.date}</span>
                                    <span style={{ marginLeft: 16 }}>💬 {selectedQuestion.answers} câu trả lời</span>
                                    <span style={{ marginLeft: 16 }}>❤️ {selectedQuestion.likes} Cảm ơn</span>
                                </div>
                                {/* Danh sách message thực tế */}
                                <div style={{ background: '#f6f6f6', borderRadius: 8, padding: 12, marginBottom: 8, minHeight: 120 }}>
                                    {loadingMessages ? (
                                        <Spin />
                                    ) : (
                                        messages.length === 0 ? (
                                            <div style={{ color: '#888' }}>Chưa có trao đổi nào.</div>
                                        ) : (
                                            messages.map((msg, idx) => {
                                                const isConsultant = msg.senderId === selectedQuestion.consultantId;
                                                return (
                                                    <div key={idx} style={{ marginBottom: 12 }}>
                                                        <div style={{ fontWeight: 500, color: isConsultant ? '#2B7A4B' : '#888' }}>
                                                            {isConsultant ? `Bác sĩ (${selectedQuestion.consultantId || 'ID'})` : `Thành viên (${msg.senderId})`}
                                                        </div>
                                                        <div style={{ background: isConsultant ? '#fff' : '#EAF7F0', borderRadius: 6, padding: 8, margin: '4px 0' }}>{msg.content}</div>
                                                        <div style={{ fontSize: 11, color: '#aaa', textAlign: 'right' }}>{msg.sentAt ? new Date(msg.sentAt).toLocaleString('vi-VN') : ''}</div>
                                                    </div>
                                                );
                                            })
                                        )
                                    )}
                                </div>
                                {/* Nút trả lời cho member */}
                                {userId && userRole === 'MB' && selectedQuestion && Number(userId) === Number(selectedQuestion.memberId) && (
                                    <>
                                        {!showReplyBox ? (
                                            <Button type="primary" onClick={() => setShowReplyBox(true)}>Trả lời</Button>
                                        ) : (
                                            <div style={{ marginTop: 8 }}>
                                                <Input.TextArea
                                                    rows={2}
                                                    value={replyContent}
                                                    onChange={e => setReplyContent(e.target.value)}
                                                    placeholder="Nhập nội dung trả lời..."
                                                />
                                                <div style={{ marginTop: 8, textAlign: 'right' }}>
                                                    <Button
                                                        type="primary"
                                                        onClick={handleSendMessage}
                                                        disabled={!replyContent.trim()}
                                                    >
                                                        Gửi
                                                    </Button>
                                                    <Button style={{ marginLeft: 8 }} onClick={() => setShowReplyBox(false)}>Hủy</Button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <>
                                <Input.Search
                                    placeholder="Tìm kiếm từ khóa, tiêu đề hoặc nội dung"
                                    style={{ marginBottom: 16 }}
                                    value={searchText}
                                    onChange={e => {
                                        setSearchText(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                                <div style={{ marginBottom: 16 }}>
                                    {['Hô hấp', 'Chuyên khoa sản', 'HPV', 'Lậu', 'Sản phụ khoa'].map(tag => (
                                        <Tag
                                            key={tag}
                                            color={filterSpecialty === tag ? 'green' : undefined}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setFilterSpecialty(filterSpecialty === tag ? '' : tag);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            {tag}
                                        </Tag>
                                    ))}
                                    {filterSpecialty && (
                                        <Tag
                                            color="red"
                                            closable
                                            onClose={e => {
                                                e.preventDefault();
                                                setFilterSpecialty('');
                                                setCurrentPage(1);
                                            }}
                                            style={{ marginLeft: 8 }}
                                        >
                                            Bỏ lọc
                                        </Tag>
                                    )}
                                </div>
                                {loading ? (
                                    <Spin style={{ width: '100%', margin: '32px 0' }} />
                                ) : (
                                    <List
                                        dataSource={pagedQuestions}
                                        locale={{ emptyText: 'Không có câu hỏi nào' }}
                                        renderItem={item => (
                                            <Card
                                                key={item.id}
                                                style={{ marginBottom: 16, background: '#EAF7F0', cursor: 'pointer' }}
                                                onClick={() => setSelectedQuestion(item)}
                                            >
                                                <div>
                                                    <b>{item.gender}, {item.age} tuổi</b>
                                                    <Tag color="green">{item.topic}</Tag>
                                                </div>
                                                <div style={{ fontWeight: 600, color: '#2B7A4B' }}>{item.title}</div>
                                                <div>{item.content}</div>
                                                <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                                                    <span>{item.date}</span>
                                                    <span style={{ marginLeft: 16 }}>💬 {item.answers} câu trả lời</span>
                                                    <span style={{ marginLeft: 16 }}>❤️ {item.likes} Cảm ơn</span>
                                                </div>
                                            </Card>
                                        )}
                                    />
                                )}
                                <Pagination
                                    current={currentPage}
                                    total={filteredQuestions.length}
                                    pageSize={pageSize}
                                    onChange={page => setCurrentPage(page)}
                                    style={{ textAlign: 'center', marginTop: 16 }}
                                />
                            </>
                        )}
                    </Card>
                </Col>
                <Col span={10}>
                    <Card>
                        <Form layout="vertical" form={form} onFinish={handleSubmit}>
                            <Form.Item label="Tuổi" name="age" rules={[{ required: true, message: 'Nhập tuổi của bạn' }]}> 
                                <Input placeholder="Nhập tuổi của bạn" />
                            </Form.Item>
                            <Form.Item label="Giới tính" name="gender" rules={[{ required: true, message: 'Chọn giới tính' }]}> 
                                <Radio.Group>
                                    <Radio value="Nam">Nam</Radio>
                                    <Radio value="Nữ">Nữ</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item label="Chuyên khoa" name="specialty" rules={[{ required: true, message: 'Chọn chuyên khoa' }]}> 
                                <Select placeholder="Chọn chuyên khoa">
                                    <Select.Option value="thần kinh">Thần kinh</Select.Option>
                                    <Select.Option value="hô hấp">Hô hấp</Select.Option>
                                    <Select.Option value="Sản phụ khoa">Sản phụ khoa</Select.Option>
                                    {/* ... */}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Nhập tiêu đề' }]}> 
                                <Input placeholder="Tiêu đề (vd: Mọc mụn nước)" />
                            </Form.Item>
                            <Form.Item label="Nội dung câu hỏi" name="content" rules={[{ required: true, message: 'Nhập nội dung câu hỏi' }]}> 
                                <Input.TextArea rows={4} placeholder="Nội dung câu hỏi..." />
                            </Form.Item>
                            <Form.Item label="Thêm ảnh" name="image" valuePropName="fileList" getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}>
                                <Upload listType="picture-card" maxCount={1} beforeUpload={() => false} accept="image/*">
                                    <div>
                                        <PlusOutlined />
                                        <div>Thêm ảnh</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block loading={loading}>Gửi</Button>
                            </Form.Item>
                            <div style={{ fontSize: 12, color: '#888' }}>
                                * Câu hỏi của bạn sẽ được hiển thị ẩn danh sau khi được kiểm duyệt
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </MainLayout>
    );
}

export default Question;