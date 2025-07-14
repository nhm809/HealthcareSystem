import { useState, useEffect, useContext } from 'react';
import { Row, Col, Card, Tag, Input, List, Pagination, Form, Select, Upload, Button, Radio, Spin, message, Image, Divider, Typography, Space, Avatar } from 'antd';
import { PlusOutlined, ArrowLeftOutlined, MessageOutlined, HeartOutlined, UserOutlined, CalendarOutlined, EyeOutlined } from '@ant-design/icons';
import MainLayout from '@components/Layout/Layout';
import { questionApi, specialtyApi } from '@services/api';
import api from '@services/api';
import Cookies from 'js-cookie';
import AuthModal from '@components/Header/AuthModal/AuthModal';
import { ToastContext } from '../../contexts/ToastProvider';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useParams, useNavigate } from 'react-router-dom';
import SubQuestionList from './SubQuestionList';

const { Title, Text, Paragraph } = Typography;

dayjs.extend(utc);
dayjs.extend(timezone);

function Question() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
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
    // Remove all likes/heartCount logic, and use a Set to track liked questions by the current user
    const [likedQuestions, setLikedQuestions] = useState(new Set());

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
                        status: q.status,
                        gender: q.gender,
                        age: q.age,
                        memberId: q.memberId,
                        attachmentPath: q.attachmentPath,
                        consultantId: q.consultantId,
                        consultant: q.consultant,
                        heart: q.heart, // use heart field from API
                        ansCount: q.ansCount,
                        submitDate: q.submitDate ? new Date(q.submitDate) : null,
                    };
                    setSelectedQuestion(formattedQuestion);
                    // Set liked state for detail view
                    if (q.heart) setLikedQuestions(prev => new Set([...prev, q.questionId]));
                    else setLikedQuestions(prev => { const s = new Set([...prev]); s.delete(q.questionId); return s; });
                } else {
                    // Otherwise, fetch the list of all questions
                    const res = await questionApi.getAllQuestions();
                    const data = res.data.map((q) => ({
                        id: q.questionId,
                        specialtyId: q.specialtyId || q.specialty,
                        title: q.titleQuestion,
                        date: q.submitDate ? dayjs(q.submitDate).format('DD/MM/YYYY') : '',
                        content: q.content,
                        status: q.status,
                        gender: q.gender,
                        age: q.age,
                        memberId: q.memberId,
                        attachmentPath: q.attachmentPath,
                        consultantId: q.consultantId,
                        consultant: q.consultant,
                        heart: q.heart, // use heart field from API
                        ansCount: q.ansCount,
                        submitDate: q.submitDate ? new Date(q.submitDate) : null,
                    }));
                    data.sort((a, b) => (b.submitDate?.getTime() || 0) - (a.submitDate?.getTime() || 0));
                    setQuestions(data);
                    // Set liked state for all questions
                    const likedSet = new Set();
                    data.forEach(q => { if (q.heart) likedSet.add(q.id); });
                    setLikedQuestions(likedSet);
                }
            } catch (error) {
                // Chỉ hiện thông báo lỗi khi thực sự có lỗi hệ thống, không phải khi không có data
                if (error.response && error.response.status !== 404) {
                    message.error('Không thể tải dữ liệu câu hỏi');
                    console.error('Fetch error:', error);
                    navigate('/question'); // Redirect to base page on error
                } else {
                    // Nếu là lỗi 404 hoặc không có data, set data rỗng
                    setQuestions([]);
                    if (questionId && error.response?.status === 404) {
                        navigate('/question'); // Redirect nếu question không tồn tại
                    }
                }
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
        const matchSpecialty = filterSpecialty ? String(q.specialtyId) === filterSpecialty : true;
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
            
            // Sau khi tạo câu hỏi cha thành công, lấy câu hỏi mới nhất của user để tạo câu hỏi con
            try {
                console.log('Đang lấy danh sách câu hỏi của user:', userId);
                const userQuestionsRes = await questionApi.getQuestionsByMember(Number(userId));
                const userQuestions = userQuestionsRes.data || [];
                console.log('Danh sách câu hỏi của user:', userQuestions);
                
                // Lấy câu hỏi mới nhất (sắp xếp theo thời gian)
                const sortedQuestions = userQuestions.sort((a, b) => {
                    const dateA = new Date(a.submitDate || 0);
                    const dateB = new Date(b.submitDate || 0);
                    return dateB - dateA;
                });
                console.log('Danh sách câu hỏi đã sắp xếp:', sortedQuestions);
                
                const latestQuestion = sortedQuestions[0];
                console.log('Câu hỏi mới nhất:', latestQuestion);
                
                if (latestQuestion) {
                    console.log('Đang tạo câu hỏi con cho câu hỏi ID:', latestQuestion.questionId);
                    // Tạo câu hỏi con đầu tiên với nội dung từ câu hỏi cha
                    const createSubResponse = await api.post('/subQuestion/add', {
                        ThreadItemId: 0,
                        QuestionId: latestQuestion.questionId,
                        QuestionText: values.content, // Sử dụng nội dung câu hỏi cha
                        AnswerText: '',
                        SentAt: new Date().toISOString(),
                        AttachmentPath: attachmentPath || '',
                        IsAnswered: false,
                    });
                    console.log('Kết quả tạo câu hỏi con:', createSubResponse);
                } else {
                    console.log('Không tìm thấy câu hỏi mới nhất');
                }
            } catch (subQuestionError) {
                console.error('Không thể tạo câu hỏi con:', subQuestionError);
                // Vẫn hiển thị thành công vì câu hỏi cha đã được tạo
            }
            
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

    // Hàm xử lý hiển thị trạng thái câu hỏi
    const getQuestionStatus = (status) => {
        if (status === 'Da dong') {
            return { text: 'Đã đóng', color: '#ff4d4f' };
        } else {
            return { text: 'Đang mở', color: '#52c41a' };
        }
    };

    // Hàm kiểm tra câu hỏi có thể thêm câu hỏi con không
    const canAddSubQuestion = (question) => {
        return question.status !== 'Da dong' && userId == question?.memberId;
    };

    // Update toggleLike to check if user is the author
    const toggleLike = async (questionId) => {
        const currentUserId = Cookies.get('userId');
        if (!currentUserId) {
            setAuthModalOpen(true);
            return;
        }
        
        // Find the question to check if current user is the author
        const question = selectedQuestion?.id === questionId ? selectedQuestion : 
                        questions.find(q => q.id === questionId);
        
        if (!question || Number(currentUserId) !== Number(question.memberId)) {
            toast.error('Chỉ tác giả mới có thể thích câu hỏi của mình!');
            return;
        }
        
        const isLiked = likedQuestions.has(questionId);
        try {
            await questionApi.updateHeart(questionId, Number(currentUserId), !isLiked);
            setLikedQuestions(prev => {
                const newSet = new Set([...prev]);
                if (isLiked) newSet.delete(questionId);
                else newSet.add(questionId);
                return newSet;
            });
            // Update selectedQuestion if open
            if (selectedQuestion && selectedQuestion.id === questionId) {
                setSelectedQuestion(prev => ({ ...prev, heart: !isLiked }));
            }
            // Update in questions list
            setQuestions(prev => prev.map(q =>
                q.id === questionId ? { ...q, heart: !isLiked } : q
            ));
        } catch (error) {
            toast.error('Không thể cập nhật trạng thái thích. Vui lòng thử lại!');
            console.error('Toggle like error:', error);
        }
    };

    // Helper function to check if current user is the author
    const isAuthor = (question) => {
        const currentUserId = Cookies.get('userId');
        return currentUserId && Number(currentUserId) === Number(question?.memberId);
    };

    const customStyles = {
        primaryColor: '#54AA7F',
        backgroundColor: '#ffffff',
        borderColor: '#e8e8e8',
        textColor: '#333333',
        lightTextColor: '#666666',
        hoverColor: '#f5f5f5',
    };

    return (
        <MainLayout>
            <div style={{
                backgroundColor: customStyles.backgroundColor,
                minHeight: '100vh',
                padding: '24px 0'
            }}>
                                <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
                    <Row gutter={[32, 24]} justify="space-between">
                        <Col xs={24} lg={selectedQuestion ? 24 : 16}>
                            <Card 
                                style={{ 
                                    border: `1px solid ${customStyles.borderColor}`,
                                    borderRadius: 12,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                                }}
                                bodyStyle={{ padding: 24 }}
                            >
                        {selectedQuestion ? (
                                    <div style={{ maxWidth: 900, margin: '0 auto' }}>
                                <Button
                                    icon={<ArrowLeftOutlined />}
                                            type="text"
                                    onClick={() => {
                                        setSelectedQuestion(null);
                                        navigate('/question');
                                    }}
                                            style={{
                                                marginBottom: 24,
                                                padding: 0,
                                                color: customStyles.primaryColor,
                                                fontSize: 16
                                            }}
                                        >
                                            Quay lại danh sách
                                </Button>

                                        <div style={{
                                            backgroundColor: '#f8f9fa',
                                            padding: 20,
                                            borderRadius: 8,
                                            marginBottom: 24
                                        }}>
                                            <Space size="middle" style={{ marginBottom: 12 }}>
                                                <Avatar
                                                    icon={<UserOutlined />}
                                                    style={{ backgroundColor: customStyles.primaryColor }}
                                                />
                                                <div>
                                                    <Text strong>{selectedQuestion.gender}, {selectedQuestion.age} tuổi</Text>
                                                </div>
                                                <Tag
                                                    color={customStyles.primaryColor}
                                                    style={{
                                                        border: 'none',
                                                        borderRadius: 6,
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {getSpecialtyName(selectedQuestion.specialtyId)}
                                                </Tag>
                                                                                                <Tag 
                                                    color={getQuestionStatus(selectedQuestion.status).color}
                                                    style={{ 
                                                        border: 'none',
                                                        borderRadius: 6,
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {getQuestionStatus(selectedQuestion.status).text}
                                                </Tag>
                                            </Space>

                                            <Title level={3} style={{
                                                color: customStyles.textColor,
                                                margin: '16px 0',
                                                fontSize: 24
                                            }}>
                                                {selectedQuestion.title}
                                            </Title>

                                            <Paragraph style={{
                                                fontSize: 16,
                                                lineHeight: 1.6,
                                                color: customStyles.textColor,
                                                marginBottom: 16
                                            }}>
                                                {selectedQuestion.content}
                                            </Paragraph>

                                {selectedQuestion.attachmentPath && (
                                                <div style={{ marginBottom: 16 }}>
                                        <Image
                                            width={300}
                                            src={selectedQuestion.attachmentPath}
                                            alt="Ảnh câu hỏi"
                                            style={{ borderRadius: 8 }}
                                        />
                                    </div>
                                )}

                                                                                        <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 24,
                                                color: customStyles.lightTextColor,
                                                fontSize: 14
                                            }}>
                                                <Space>
                                                    <CalendarOutlined />
                                                    <span>{selectedQuestion.date}</span>
                                                </Space>
                                                <Space>
                                                    <MessageOutlined />
                                                    <span>{selectedQuestion.ansCount || 0} câu trả lời</span>
                                                </Space>
                                                {isAuthor(selectedQuestion) ? (
                                                    <Space>
                                                        <HeartOutlined 
                                                            style={{ 
                                                                cursor: 'pointer',
                                                                color: likedQuestions.has(selectedQuestion.id) ? '#ff4d4f' : customStyles.primaryColor,
                                                                fontSize: 16
                                                            }}
                                                            onClick={() => toggleLike(selectedQuestion.id)}
                                                        />
                                                        <span>
                                                            {likedQuestions.has(selectedQuestion.id) ? 'Đã thích bởi tác giả' : 'Thích'}
                                                        </span>
                                                    </Space>
                                                ) : (
                                                    selectedQuestion.heart && (
                                                        <Space>
                                                            <HeartOutlined 
                                                                style={{ 
                                                                    color: '#ff4d4f',
                                                                    fontSize: 16
                                                                }}
                                                            />
                                                            <span>Đã thích bởi tác giả</span>
                                                        </Space>
                                                    )
                                                )}
                                            </div>
                                </div>

                                        <Divider style={{ margin: '32px 0' }} />

                                {/* SubQuestionList hiển thị trao đổi chi tiết */}
                                                                        <SubQuestionList
                                            question={selectedQuestion}
                                            isConsultant={userRole === 'CS'}
                                            consultant={selectedQuestion.consultant}
                                            canAddSubQuestion={canAddSubQuestion(selectedQuestion)}
                                            onQuestionAnswered={async () => {
                                                if (selectedQuestion?.id) {
                                                    try {
                                                        const res = await questionApi.getQuestionById(selectedQuestion.id);
                                                        setSelectedQuestion({
                                                            ...selectedQuestion,
                                                            ...res.data
                                                        });
                                                    } catch { }
                                                }
                                            }}
                                        />
                            </div>
                        ) : (
                            <>
                                        <div style={{ marginBottom: 32 }}>
                                            <Title level={2} style={{
                                                color: customStyles.textColor,
                                                marginBottom: 16,
                                                textAlign: 'center'
                                            }}>
                                                Hỏi đáp với bác sĩ
                                            </Title>


                                <Input.Search
                                                placeholder="Tìm kiếm câu hỏi..."
                                                size="large"
                                                style={{
                                                    marginBottom: 24,
                                                    borderRadius: 8
                                                }}
                                    value={searchText}
                                    onChange={e => {
                                        setSearchText(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />

                                            <div style={{ marginBottom: 24 }}>
                                    {specialties.map(specialty => (
                                        <Tag    
                                            key={specialty.id}
                                            color={filterSpecialty === String(specialty.id) ? customStyles.primaryColor : undefined}
                                            style={{
                                                cursor: 'pointer',
                                                borderRadius: 6,
                                                padding: '4px 12px',
                                                marginBottom: 8
                                            }}
                                            onClick={() => {
                                                setFilterSpecialty(filterSpecialty === String(specialty.id) ? '' : String(specialty.id));
                                                setCurrentPage(1);
                                            }}
                                        >
                                            {specialty.name}
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
                                                        style={{
                                                            marginLeft: 8,
                                                            borderRadius: 6
                                                        }}
                                        >
                                            Bỏ lọc
                                        </Tag>
                                    )}
                                </div>
                                        </div>

                                {loading ? (
                                            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                                <Spin size="large" />
                                            </div>
                                ) : (
                                    <List
                                        dataSource={pagedQuestions}
                                        locale={{ emptyText: 'Không có câu hỏi nào' }}
                                        renderItem={item => (
                                            <Card
                                                key={item.id}
                                                        style={{
                                                            marginBottom: 16,
                                                            border: `1px solid ${customStyles.borderColor}`,
                                                            borderRadius: 12,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s ease',
                                                            backgroundColor: customStyles.backgroundColor
                                                        }}
                                                        bodyStyle={{ padding: 20 }}
                                                        hoverable
                                                onClick={() => {
                                                    setSelectedQuestion(item);
                                                    navigate(`/question/${item.id}`);
                                                }}
                                            >
                                                        <div style={{ marginBottom: 12 }}>
                                                            <Space size="middle">
                                                                <Avatar
                                                                    icon={<UserOutlined />}
                                                                    size="small"
                                                                    style={{ backgroundColor: customStyles.primaryColor }}
                                                                />
                                                                <Text strong>{item.gender}, {item.age} tuổi</Text>
                                                                <Tag
                                                                    color={customStyles.primaryColor}
                                                                    style={{
                                                                        border: 'none',
                                                                        borderRadius: 6,
                                                                        fontWeight: 500
                                                                    }}
                                                                >
                                                                    {getSpecialtyName(item.specialtyId)}
                                                                </Tag>
                                                            </Space>
                                                </div>

                                                        <Title level={4} style={{
                                                            color: customStyles.textColor,
                                                            margin: '12px 0',
                                                            fontSize: 18,
                                                            lineHeight: 1.4
                                                        }}>
                                                            {item.title}
                                                        </Title>

                                                        <Paragraph
                                                            ellipsis={{ rows: 2 }}
                                                            style={{
                                                                color: customStyles.lightTextColor,
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
                                                            color: customStyles.lightTextColor,
                                                            fontSize: 13
                                                        }}>
                                                                                                                        <Space size="large">
                                                                <Space>
                                                                    <CalendarOutlined />
                                                                    <span>{item.date}</span>
                                                                </Space>
                                                                <Space>
                                                                    <MessageOutlined />
                                                                    <span>{item.ansCount || 0} câu trả lời</span>
                                                                </Space>
                                                                                                                {isAuthor(item) ? (
                                                    <Space>
                                                        <HeartOutlined 
                                                            style={{ 
                                                                cursor: 'pointer',
                                                                color: likedQuestions.has(item.id) ? '#ff4d4f' : customStyles.primaryColor,
                                                                fontSize: 14
                                                            }}
                                                            onClick={e => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                toggleLike(item.id);
                                                            }}
                                                        />
                                                        <span>
                                                            {likedQuestions.has(item.id) ? 'Đã thích bởi tác giả' : 'Thích'}
                                                        </span>
                                                    </Space>
                                                ) : (
                                                    item.heart && (
                                                        <Space>
                                                            <HeartOutlined 
                                                                style={{ 
                                                                    color: '#ff4d4f',
                                                                    fontSize: 14
                                                                }}
                                                            />
                                                            <span>Đã thích bởi tác giả</span>
                                                        </Space>
                                                    )
                                                )}
                                                            </Space>

                                                            <Button
                                                                type="text"
                                                                size="small"
                                                                style={{
                                                                    color: customStyles.primaryColor,
                                                                    padding: 0
                                                                }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            navigate(`/question/${item.id}`);
                                                        }}
                                                            >
                                                                Xem chi tiết
                                                            </Button>
                                                </div>
                                            </Card>
                                        )}
                                    />
                                )}

                                        <div style={{ textAlign: 'center', marginTop: 32 }}>
                                <Pagination
                                    current={currentPage}
                                    total={filteredQuestions.length}
                                    pageSize={pageSize}
                                    onChange={page => setCurrentPage(page)}
                                                showSizeChanger={false}
                                                showQuickJumper
                                                showTotal={(total, range) =>
                                                    `${range[0]}-${range[1]} của ${total} câu hỏi`
                                                }
                                            />
                                        </div>
                            </>
                        )}
                    </Card>
                </Col>

                                                <Col xs={24} lg={8}>
                    {!selectedQuestion && (
                                <Card
                                    style={{ 
                                        border: `1px solid ${customStyles.borderColor}`,
                                        borderRadius: 12,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                        width: '380px'
                                    }}
                                    bodyStyle={{ padding: 24 }}
                                >
                                    <div style={{
                                        backgroundColor: customStyles.primaryColor,
                                        color: 'white',
                                        padding: '8px',
                                        borderRadius: 8,
                                        marginBottom: 24,
                                        textAlign: 'center'
                                    }}>
                                        <Title level={4} style={{ color: 'white', margin: 0 }}>
                                            ĐẶT CÂU HỎI
                                        </Title>

                                    </div>

                                                                        <Form layout="vertical" form={form} onFinish={handleSubmit} validateTrigger="onSubmit">
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item 
                                                    label="Tuổi" 
                                                    name="age" 
                                                    rules={[
                                                        { required: true, message: 'Vui lòng nhập tuổi' },
                                                        {
                                                            validator: (_, value) => {
                                                                const age = parseInt(value);
                                                                if (isNaN(age) || age < 1 || age > 120) {
                                                                    return Promise.reject('Tuổi phải từ 1-120');
                                                                }
                                                                return Promise.resolve();
                                                            }
                                                        }
                                                    ]}
                                                    required={false}
                                                > 
                                                    <Input
                                                        placeholder="Nhập tuổi"
                                                        size="large"
                                                        style={{ borderRadius: 6 }}
                                                        type="number"
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item 
                                                    label="Giới tính" 
                                                    name="gender" 
                                                    rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
                                                    required={false}
                                                > 
                                                    <Radio.Group style={{ width: '100%' }}>
                                                        <Radio value="Nam" style={{ marginRight: 16 }}>Nam</Radio>
                                                        <Radio value="Nữ">Nữ</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                            </Col>
                                        </Row>

                                                                                <Form.Item 
                                            label="Chuyên khoa" 
                                            name="specialty" 
                                            rules={[{ required: true, message: 'Vui lòng chọn chuyên khoa' }]}
                                            required={false}
                                        > 
                                            <Select
                                                placeholder="Chọn chuyên khoa"
                                                size="large"
                                                style={{ borderRadius: 6 }}
                                            >
                                                {specialties.map(s => (
                                                    <Select.Option key={s.id} value={String(s.id)}>{s.name}</Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item 
                                            label="Tiêu đề" 
                                            name="title" 
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập tiêu đề' },
                                                { min: 5, max: 200, message: 'Tiêu đề phải từ 5-200 ký tự' }
                                            ]}
                                            required={false}
                                        > 
                                            <Input
                                                placeholder="Tiêu đề câu hỏi"
                                                size="large"
                                                style={{ borderRadius: 6 }}
                                                maxLength={200}
                                            />
                                        </Form.Item>

                                        <Form.Item 
                                            label="Nội dung câu hỏi" 
                                            name="content" 
                                            rules={[
                                                { required: true, message: 'Vui lòng nhập nội dung câu hỏi' },
                                                { min: 10, max: 2000, message: 'Nội dung phải từ 10-2000 ký tự' }
                                            ]}
                                            required={false}
                                        > 
                                            <Input.TextArea
                                                rows={4}
                                                placeholder="Mô tả chi tiết vấn đề của bạn..."
                                                style={{ borderRadius: 6 }}
                                                maxLength={2000}
                                                showCount
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Thêm ảnh"
                                            name="image"
                                            valuePropName="fileList"
                                            getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
                                            rules={[
                                                {
                                                    validator: (_, fileList) => {
                                                        if (fileList && fileList.length > 0) {
                                                            const file = fileList[0];
                                                            const isImage = file.type.startsWith('image/');
                                                            const isLt5M = file.size / 1024 / 1024 < 5;
                                                            
                                                            if (!isImage) {
                                                                return Promise.reject('Chỉ được upload file ảnh!');
                                                            }
                                                            if (!isLt5M) {
                                                                return Promise.reject('Ảnh phải nhỏ hơn 5MB!');
                                                            }
                                                        }
                                                        return Promise.resolve();
                                                    }
                                                }
                                            ]}
                                        >
                                            <Upload
                                                listType="picture-card"
                                                maxCount={1}
                                                beforeUpload={() => false}
                                                accept="image/*"
                                                style={{ borderRadius: 6 }}
                                            >
                                        <div>
                                            <PlusOutlined />
                                            <div>Thêm ảnh</div>
                                        </div>
                                    </Upload>
                                </Form.Item>

                                <Form.Item>
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                block
                                                loading={loading}
                                                size="large"
                                                style={{
                                                    backgroundColor: customStyles.primaryColor,
                                                    borderColor: customStyles.primaryColor,
                                                    borderRadius: 6,
                                                    height: 48,
                                                    fontSize: 16,
                                                    fontWeight: 500
                                                }}
                                            >
                                                Gửi câu hỏi
                                            </Button>
                                </Form.Item>

                                        <div style={{
                                            fontSize: 12,
                                            color: customStyles.lightTextColor,
                                            textAlign: 'center',
                                            padding: '16px',
                                            backgroundColor: '#f8f9fa',
                                            borderRadius: 6
                                        }}>
                                            *
                                            Câu hỏi của bạn sẽ được hiển thị ẩn danh sau khi được kiểm duyệt
                                </div>
                            </Form>
                        </Card>
                    )}
                </Col>
            </Row>
                </div>
            </div>
            <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </MainLayout>
    );
}

export default Question;