import { useState, useEffect } from 'react';
import { Row, Col, Card, Tag, Input, List, Pagination, Form, Select, Upload, Button, Radio, Spin, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MainLayout from '@components/Layout/Layout';
import { questionApi } from '@services/api';

function Question() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 4;

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            try {
                const res = await questionApi.getAllQuestions();
                // Chuyển đổi dữ liệu API sang format phù hợp để render
                const data = res.data.map(q => ({
                    id: q.questionId,
                    gender: q.gender || 'Ẩn', // Nếu có gender thì lấy, không thì để Ẩn
                    age: q.age || 'Ẩn',
                    topic: q.specialty,
                    title: q.titleQuestion,
                    date: q.submitDate ? new Date(q.submitDate).toLocaleDateString('vi-VN') : '',
                    content: q.content,
                    answers: q.isAnswered ? 1 : 0, // Nếu có trường số câu trả lời thì thay thế
                    likes: 0, // Nếu có trường likes thì thay thế
                }));
                setQuestions(data);
            } catch (err) {
                message.error('Không thể tải danh sách câu hỏi');
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    const pagedQuestions = questions.slice(startIdx, endIdx);

    return (
        <MainLayout>
            <Row gutter={24}>
                <Col span={14}>
                    <Card>
                        <Input.Search placeholder="Tìm kiếm từ khóa, chủ đề" style={{ marginBottom: 16 }} />
                        <div style={{ marginBottom: 16 }}>
                            <Tag>Hô hấp</Tag>
                            <Tag>Chuyên khoa sản</Tag>
                            <Tag>HPV</Tag>
                            <Tag>Lậu</Tag>
                        </div>
                        {loading ? (
                            <Spin style={{ width: '100%', margin: '32px 0' }} />
                        ) : (
                            <List
                                dataSource={pagedQuestions}
                                locale={{ emptyText: 'Không có câu hỏi nào' }}
                                renderItem={item => (
                                    <Card key={item.id} style={{ marginBottom: 16, background: '#EAF7F0' }}>
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
                            total={questions.length}
                            pageSize={pageSize}
                            onChange={page => setCurrentPage(page)}
                            style={{ textAlign: 'center', marginTop: 16 }}
                        />
                    </Card>
                </Col>
                <Col span={10}>
                    <Card>
                        <Form layout="vertical">
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
                                    {/* ... */}
                                </Select>
                            </Form.Item>
                            <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: 'Nhập tiêu đề' }]}> 
                                <Input placeholder="Tiêu đề (vd: Mọc mụn nước)" />
                            </Form.Item>
                            <Form.Item label="Nội dung câu hỏi" name="content" rules={[{ required: true, message: 'Nhập nội dung câu hỏi' }]}> 
                                <Input.TextArea rows={4} placeholder="Nội dung câu hỏi..." />
                            </Form.Item>
                            <Form.Item label="Thêm ảnh" name="image">
                                <Upload listType="picture-card" maxCount={1}>
                                    <div>
                                        <PlusOutlined />
                                        <div>Thêm ảnh</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" block>Gửi</Button>
                            </Form.Item>
                            <div style={{ fontSize: 12, color: '#888' }}>
                                * Câu hỏi của bạn sẽ được hiển thị ẩn danh sau khi được kiểm duyệt
                            </div>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </MainLayout>
    );
}

export default Question;