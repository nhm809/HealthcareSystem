import { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Tag, Input, List, Pagination, Form, Select, Upload, Button, Radio, Spin, message, Image } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, MessageOutlined, HeartOutlined } from '@ant-design/icons';
import MainLayout from '@components/Layout/Layout';
import { questionApi, specialtyApi } from '@services/api';
import Cookies from 'js-cookie';
import AuthModal from '@components/Header/AuthModal/AuthModal';
import { ToastContext } from '../../contexts/ToastProvider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useParams, useNavigate } from 'react-router-dom';
import SubQuestionList from '@components/Question/SubQuestionList';

dayjs.extend(utc);
dayjs.extend(timezone);

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
    const userId = Cookies.get('userId');
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userRole = userInfo.roleId;
    const [specialties, setSpecialties] = useState([]);
    const { questionId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            try {
                // Fetch specialties first, as they are needed for both views
                const specialtyRes = await specialtyApi.getAllSpecialties();
                setSpecialties(specialtyRes.data.data || []);

                if (questionId) {
                    // If an ID is in the URL, fetch that specific question
                    const questionRes = await questionApi.getQuestionById(questionId);
                    const q = questionRes.data;
                    const formattedQuestion = {
                        id: q.questionId,
                        specialtyId: q.specialtyId || q.specialty,
                        title: q.titleQuestion,
                        date: q.submitDate ? dayjs(q.submitDate).format('DD/MM/YYYY') : '',
                        content: q.content,
                        answers: q.isAnswered,
                        gender: q.gender,
                        age: q.age,
                        likes: q.heartCount,
                        answersCount: q.messCount,
                        submitDate: q.submitDate ? new Date(q.submitDate) : null,
                        memberId: q.memberId,
                        attachmentPath: q.attachmentPath,
                        consultantId: q.consultantId,
                        consultant: q.consultant,
                    };
                    setSelectedQuestion(formattedQuestion);
                } else {
                    // Otherwise, fetch the list of all questions
                    const res = await questionApi.getAllQuestions();
                    const data = res.data.map((q) => ({
                        id: q.questionId,
                        specialtyId: q.specialtyId || q.specialty,
                        title: q.titleQuestion,
                        date: q.submitDate ? dayjs(q.submitDate).format('DD/MM/YYYY') : '',
                        content: q.content,
                        answers: q.isAnswered,
                        gender: q.gender,
                        age: q.age,
                        likes: q.heartCount,
                        answersCount: q.messCount,
                        submitDate: q.submitDate ? new Date(q.submitDate) : null,
                        memberId: q.memberId,
                        attachmentPath: q.attachmentPath,
                        consultantId: q.consultantId,
                        consultant: q.consultant,
                    }));
                    data.sort((a, b) => (b.submitDate?.getTime() || 0) - (a.submitDate?.getTime() || 0));
                    setQuestions(data);
                }
            } catch (error) {
                message.error('Không thể tải dữ liệu câu hỏi');
                console.error('Fetch error:', error);
                navigate('/question'); // Redirect to base page on error
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [questionId, navigate]);

    // Lọc câu hỏi theo searchText và filterSpecialty
    const filteredQuestions = questions.filter(q => {
        const matchSearch =
            q.title.toLowerCase().includes(searchText.toLowerCase()) ||
            q.content.toLowerCase().includes(searchText.toLowerCase());
        const matchSpecialty = filterSpecialty ? q.specialtyId === filterSpecialty : true;
        return matchSearch && matchSpecialty;
    });
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pagedQuestions = filteredQuestions.slice(startIdx, endIdx);

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
        setLoading(true);
        let attachmentPath = '';
        if (values.image && values.image.length > 0) {
            const file = values.image[0].originFileObj;
            if (file) {
                try {
                    attachmentPath = await uploadToCloudinary(file);
                } catch {
                    toast.error('Tải ảnh lên thất bại!');
                    setLoading(false);
                    return;
                }
            }
        }
        // Tìm specialtyId từ specialties, ép kiểu về số
        const selectedSpecialty = specialties.find(s => String(s.id) === String(values.specialty));
        if (!selectedSpecialty) {
            toast.error('Vui lòng chọn chuyên khoa hợp lệ!');
            setLoading(false);
            return;
        }
        const payload = {
            memberId: Number(userId),
            specialtyId: Number(selectedSpecialty.id), // luôn là số
            titleQuestion: values.title,
            content: values.content,
            attachmentPath,
            age: Number(values.age),
            gender: values.gender,
        };
        try {
            await questionApi.addQuestion(payload);
            toast.success('Gửi câu hỏi thành công!');
            setTimeout(() => {
                window.location.reload();
            }, 3000);
            form.resetFields();
        } catch {
            toast.error('Gửi câu hỏi thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // Hàm lấy tên chuyên khoa từ id
    const getSpecialtyName = (id) => {
        const found = specialties.find(s => String(s.id) === String(id));
        return found ? found.name : 'Chuyên khoa khác';
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
                                    onClick={() => {
                                        setSelectedQuestion(null);
                                        navigate('/question');
                                    }}
                                    style={{ marginBottom: 8, padding: 0 }}
                                >
                                    Quay lại
                                </Button>
                                <div style={{ marginBottom: 8 }}>
                                    <b>{selectedQuestion.gender}, {selectedQuestion.age} tuổi</b>
                                    <Tag color="green">{getSpecialtyName(selectedQuestion.specialtyId)}</Tag>
                                    <Tag color={selectedQuestion.isAnswered ? 'blue' : 'orange'}>
                                        {selectedQuestion.isAnswered ? 'Đã trả lời' : 'Đang mở'}
                                    </Tag>
                                </div>
                                <div style={{ fontWeight: 600, color: '#2B7A4B', marginBottom: 4 }}>{selectedQuestion.title}</div>
                                <div style={{ marginBottom: 8 }}>{selectedQuestion.content}</div>
                                {selectedQuestion.attachmentPath && (
                                    <div style={{ marginBottom: 8 }}>
                                        <Image
                                            width={200}
                                            src={selectedQuestion.attachmentPath}
                                            alt="Ảnh câu hỏi"
                                        />
                                    </div>
                                )}
                                <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
                                    <span>{selectedQuestion.date}</span>
                                    <span style={{ marginLeft: 16 }}>
                                        <MessageOutlined style={{ marginRight: 4 }} />
                                        {selectedQuestion.answersCount || 0} câu trả lời
                                    </span>
                                    <span style={{ marginLeft: 16 }}>
                                        <HeartOutlined style={{ marginRight: 4 }} />
                                        {selectedQuestion.likes || 0} Cảm ơn
                                    </span>
                                </div>
                                {/* SubQuestionList hiển thị trao đổi chi tiết */}
                                <SubQuestionList
                                    question={selectedQuestion}
                                    isConsultant={userRole === 'CS'}
                                />
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
                                                onClick={() => {
                                                    setSelectedQuestion(item);
                                                    navigate(`/question/${item.id}`);
                                                }}
                                            >
                                                <div>
                                                    <b>{item.gender}, {item.age} tuổi</b>
                                                    <Tag color="green">{getSpecialtyName(item.specialtyId)}</Tag>
                                                </div>
                                                <div style={{ fontWeight: 600, color: '#2B7A4B' }}>{item.title}</div>
                                                <div>{item.content}</div>
                                                <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>
                                                    <span>{item.date}</span>
                                                    <a 
                                                        href={`/question/${item.id}`}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            navigate(`/question/${item.id}`);
                                                        }}
                                                        style={{ 
                                                            marginLeft: 16, 
                                                            color: '#1890ff', 
                                                            cursor: 'pointer', 
                                                            textDecoration: 'none',
                                                            transition: 'color 0.2s'
                                                        }}
                                                    >
                                                        <MessageOutlined style={{ marginRight: 4}} />
                                                        {item.answersCount || 0} câu trả lời
                                                    </a>
                                                    <span style={{ marginLeft: 16 }}>
                                                        <HeartOutlined style={{ marginRight: 4 }} />
                                                        {item.likes || 0} Cảm ơn
                                                    </span>
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
                                    {specialties.map(s => (
                                        <Select.Option key={s.id} value={String(s.id)}>{s.name}</Select.Option>
                                    ))}
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