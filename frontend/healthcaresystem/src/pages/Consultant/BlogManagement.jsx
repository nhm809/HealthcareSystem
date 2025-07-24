import React, { useState, useEffect, useContext } from 'react';
import { Input, Button, Select, Form, List, Card, message, Spin, Modal, Typography, Space, Row, Col, Divider, Upload, Tabs, Popconfirm, Dropdown, Menu } from 'antd';
import { PlusOutlined, FileTextOutlined, PictureOutlined, LoadingOutlined, MoreOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import { consultantBlogApi } from '../../services/api';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { ToastContext } from '../../contexts/ToastProvider';
import './BlogManagement.css';

const { Option } = Select;
const { Title } = Typography;
const { TabPane } = Tabs;

const topicOptions = [
     'Sức khỏe',
     'STIs',
     'Tâm lý',
     'Hướng dẫn',
     'Nhi khoa',
     'Cơ xương khớp',
     'Giới tính',
];

const BlogManagement = () => {
     const [form] = Form.useForm();
     const [blogs, setBlogs] = useState([]);
     const [loading, setLoading] = useState(false);
     const [creating, setCreating] = useState(false);
     const [modalOpen, setModalOpen] = useState(false);
     const [thumbnailPreview, setThumbnailPreview] = useState('');
     const [uploading, setUploading] = useState(false);
     const [fileList, setFileList] = useState([]);
     const consultantId = Cookies.get('userId');
     const [editModalOpen, setEditModalOpen] = useState(false);
     const [editingBlog, setEditingBlog] = useState(null);
     const [editForm] = Form.useForm();
     const [editFileList, setEditFileList] = useState([]);
     const [editThumbnailPreview, setEditThumbnailPreview] = useState('');
     const [editUploading, setEditUploading] = useState(false);
     const [editLoading, setEditLoading] = useState(false);
     const [searchText, setSearchText] = useState('');
     const [searchDate, setSearchDate] = useState(null);
     const { toast } = useContext(ToastContext);
     const [activeTab, setActiveTab] = useState('active');
     const [deletedBlogs, setDeletedBlogs] = useState([]);

     const fetchBlogs = async () => {
          setLoading(true);
          try {
               const res = await consultantBlogApi.getBlogsByConsultant(consultantId);
               setBlogs(res.data);
               // Lấy blog đã xóa
               const deletedRes = await consultantBlogApi.getDeletedBlogs(consultantId);
               setDeletedBlogs(deletedRes.data);
          } catch {
               message.error('Lỗi khi tải danh sách blog');
               setBlogs([]);
               setDeletedBlogs([]);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          if (consultantId) fetchBlogs();
     }, [consultantId]);

     // Cloudinary upload
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

     const onFinish = async (values) => {
          setCreating(true);
          try {
               const payload = {
                    ...values,
                    ConsultantId: parseInt(consultantId),
               };
               const res = await consultantBlogApi.createBlog(payload);
               if (typeof res.data === 'number') {
                    toast.success('Tạo blog thành công!');
                    form.resetFields();
                    setThumbnailPreview('');
                    setFileList([]);
                    setModalOpen(false);
                    fetchBlogs();
               } else {
                    toast.error('Tạo blog thất bại!');
               }
          } catch {
               toast.error('Lỗi khi tạo blog!');
          } finally {
               setCreating(false);
          }
     };

     const openEditModal = async (blog) => {
          setEditLoading(true);
          try {
               const res = await consultantBlogApi.getBlogById(blog.blogID);
               const fullBlog = res.data;
               // Determine the correct thumbnail image
               let thumb = fullBlog.thumbnailImagePath;
               if ((!thumb || thumb === 'string') && fullBlog.images && fullBlog.images.length > 0) {
                    thumb = fullBlog.images[0].imagePath;
               }
               setEditingBlog(fullBlog);
               setEditModalOpen(true);
               setEditThumbnailPreview(thumb || '');
               setEditFileList(thumb ? [{
                    uid: '-1',
                    name: 'thumbnail.jpg',
                    status: 'done',
                    url: thumb,
               }] : []);
               editForm.setFieldsValue({
                    BlogID: fullBlog.blogID,
                    Title: fullBlog.title,
                    Description: fullBlog.description,
                    Content: fullBlog.content,
                    Topic: fullBlog.topic,
                    ThumbnailImagePath: thumb,
               });
          } catch {
               message.error('Không lấy được chi tiết blog!');
          } finally {
               setEditLoading(false);
          }
     };

     const handleEditUploadChange = async ({ fileList: newFileList }) => {
          setEditFileList(newFileList);
          if (newFileList.length > 0) {
               const file = newFileList[0].originFileObj;
               if (file) {
                    setEditUploading(true);
                    try {
                         const url = await uploadToCloudinary(file);
                         setEditThumbnailPreview(url);
                         editForm.setFieldsValue({ ThumbnailImagePath: url });
                         message.success('Tải ảnh lên thành công!');
                    } catch {
                         message.error('Tải ảnh lên thất bại!');
                    } finally {
                         setEditUploading(false);
                    }
               }
          } else {
               setEditThumbnailPreview('');
               editForm.setFieldsValue({ ThumbnailImagePath: '' });
          }
     };

     const handleEditRemove = () => {
          setEditThumbnailPreview('');
          editForm.setFieldsValue({ ThumbnailImagePath: '' });
          setEditFileList([]);
          return true;
     };

     const onEditFinish = async (values) => {
          setEditUploading(true);
          try {
               const payload = {
                    blogID: editingBlog.blogID,
                    title: values.Title,
                    description: values.Description,
                    content: values.Content,
                    topic: values.Topic,
                    thumbnailImagePath: values.ThumbnailImagePath,
               };
               await consultantBlogApi.updateBlog(payload);
               toast.success('Cập nhật blog thành công!');
               setEditModalOpen(false);
               setEditingBlog(null);
               setEditFileList([]);
               setEditThumbnailPreview('');
               fetchBlogs();
          } catch {
               toast.error('Cập nhật blog thất bại!');
          } finally {
               setEditUploading(false);
          }
     };

     const handleDeleteBlog = async (blogId) => {
          try {
               await consultantBlogApi.deleteBlog(blogId, consultantId);
               toast.success('Đã xóa blog!');
               fetchBlogs();
          } catch {
               toast.error('Xóa blog thất bại!');
          }
     };

     const handleRestoreBlog = async (blogId) => {
          try {
               await consultantBlogApi.restoreBlog(blogId, consultantId);
               toast.success('Khôi phục blog thành công!');
               fetchBlogs();
          } catch {
               toast.error('Khôi phục blog thất bại!');
          }
     };

     // Filter blogs by search text and date
     const filteredBlogs = blogs.filter(blog => {
          const matchTitle = blog.title.toLowerCase().includes(searchText.toLowerCase());
          const matchDate = searchDate ? dayjs(blog.publishDate).isSame(searchDate, 'day') : true;
          return matchTitle && matchDate;
     });

     return (
          <div className="blog-management-container">
               <div className="blog-header">
                    <Row justify="space-between" align="middle">
                         <Col>
                              <h1>Quản lý Blog</h1>
                              <p style={{ marginBottom: '10px'}}>Tạo và quản lý các bài viết chuyên môn của bạn</p>
                         </Col>
                         <Col>
                              <Button
                                   className="create-blog-btn"
                                   icon={<PlusOutlined />}
                                   size="large"
                                   onClick={() => setModalOpen(true)}
                              >
                                   Tạo blog mới
                              </Button>
                         </Col>
                    </Row>
                                   
                <Tabs activeKey={activeTab} onChange={setActiveTab} className="blog-tabs">
                         <TabPane tab="Blog hiện tại" key="active">
                              <div className="filter-section">
                                   <Row justify="end" gutter={[16, 16]}>
                                        <Col>
                                             <DatePicker
                                                  placeholder="Chọn ngày đăng"
                                                  allowClear
                                                  value={searchDate}
                                                  onChange={date => setSearchDate(date)}
                                                  style={{ width: 180 }}
                                                  format="DD/MM/YYYY"
                                             />
                                        </Col>
                                        <Col>
                                             <Input.Search
                                                  placeholder="Tìm kiếm tiêu đề blog..."
                                                  value={searchText}
                                                  onChange={(e) => setSearchText(e.target.value)}
                                                  style={{ width: 200 }}
                                             />
                                        </Col>
                                   </Row>
                              </div>
                              
                              {loading ? (
                                   <div style={{ textAlign: 'center', padding: 64 }}><Spin size="large" /></div>
                              ) : filteredBlogs.length > 0 ? (
                                   <div className="blog-grid">
                                        {filteredBlogs.map(blog => (
                                             <div key={blog.blogID} className="blog-card" onClick={() => openEditModal(blog)}>
                                                  <div className="blog-card-actions">
                                                       <Dropdown
                                                            overlay={
                                                                 <Menu>
                                                                      <Menu.Item key="edit" onClick={e => { e.domEvent.stopPropagation(); openEditModal(blog); }}>
                                                                           Cập nhật
                                                                      </Menu.Item>
                                                                      <Menu.Item key="delete">
                                                                           <Popconfirm title="Bạn chắc chắn muốn xóa blog này?" onConfirm={e => { e.stopPropagation(); handleDeleteBlog(blog.blogID); }} onCancel={e => e.stopPropagation()} okText="Xóa" cancelText="Hủy">
                                                                                <span onClick={e => e.stopPropagation()}>Xóa</span>
                                                                           </Popconfirm>
                                                                      </Menu.Item>
                                                                 </Menu>
                                                            }
                                                            trigger={["click"]}
                                                       >
                                                            <Button className="blog-action-btn" icon={<MoreOutlined />} onClick={e => e.stopPropagation()} />
                                                       </Dropdown>
                                                  </div>
                                                  <img 
                                                       className="blog-card-image" 
                                                       src={blog.thumbnailImagePath} 
                                                       alt={blog.title}
                                                  />
                                                  <div className="blog-card-content">
                                                       <div className="blog-card-topic">{blog.topic}</div>
                                                       <h3 className="blog-card-title">{blog.title}</h3>
                                                       <p className="blog-card-description">{blog.description}</p>
                                                       <div className="blog-card-meta">
                                                            <span>Ngày đăng: {blog.publishDate?.split('T')[0]}</span>
                                                       </div>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              ) : (
                                   <div className="empty-state">
                                        <div className="empty-state-icon">📝</div>
                                        <div className="empty-state-title">Chưa có blog nào</div>
                                        <div className="empty-state-description">Tạo blog đầu tiên của bạn để chia sẻ kiến thức chuyên môn</div>
                                   </div>
                              )}
                         </TabPane>
                         <TabPane tab="Blog đã xóa" key="deleted">
                              {loading ? (
                                   <div style={{ textAlign: 'center', padding: 64 }}><Spin size="large" /></div>
                              ) : deletedBlogs.length > 0 ? (
                                   <div className="blog-grid">
                                        {deletedBlogs.map(blog => (
                                             <div key={blog.blogID} className="blog-card deleted-blog-card">
                                                  <img 
                                                       className="blog-card-image" 
                                                       src={blog.thumbnailImagePath} 
                                                       alt={blog.title}
                                                  />
                                                  <div className="blog-card-content">
                                                       <div className="blog-card-topic">{blog.topic}</div>
                                                       <h3 className="blog-card-title" style={{ color: '#d9534f' }}>{blog.title}</h3>
                                                       <p className="blog-card-description">{blog.description}</p>
                                                       <div className="blog-card-meta">
                                                            <span>Ngày đăng: {blog.publishDate?.split('T')[0]}</span>
                                                            <Button 
                                                                 className="restore-btn" 
                                                                 size="small"
                                                                 onClick={(e) => {
                                                                      e.stopPropagation();
                                                                      handleRestoreBlog(blog.blogID);
                                                                 }}
                                                            >
                                                                 Khôi phục
                                                            </Button>
                                                       </div>
                                                  </div>
                                             </div>
                                        ))}
                                   </div>
                              ) : (
                                   <div className="empty-state">
                                        <div className="empty-state-icon">🗑️</div>
                                        <div className="empty-state-title">Không có blog đã xóa</div>
                                        <div className="empty-state-description">Các blog đã xóa sẽ hiển thị ở đây</div>
                                   </div>
                              )}
                         </TabPane>
                    </Tabs>
               </div>
               <Modal
                    className="blog-modal"
                    title={<span>Tạo blog mới</span>}
                    open={modalOpen}
                    onCancel={() => { setModalOpen(false); setThumbnailPreview(''); setFileList([]); form.resetFields(); }}
                    footer={null}
                    centered
                    destroyOnClose
                    width="80vw"
                    style={{ top: 32, padding: 0 }}
                    styles={{
                         body: { padding: 0, minHeight: '70vh', background: '#f8fafc', borderRadius: 16 },
                         mask: { background: 'rgba(30, 42, 80, 0.18)' }
                    }}
               >
                    <div style={{ padding: '32px 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                         <Form
                              form={form}
                              layout="vertical"
                              onFinish={onFinish}
                              style={{ marginTop: 8 }}
                         >
                              <Row gutter={48}>
                                   <Col xs={24} md={14}>
                                        <Form.Item name="Title" label={<b>Tiêu đề</b>} rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}> 
                                             <Input placeholder="Nhập tiêu đề" size="large" style={{ borderRadius: 8 }} />
                                        </Form.Item>
                                        <Form.Item name="Description" label={<b>Mô tả ngắn</b>} rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}> 
                                             <Input.TextArea placeholder="Nhập mô tả ngắn" rows={2} size="large" style={{ borderRadius: 8 }} />
                                        </Form.Item>
                                        <Form.Item name="Content" label={<b>Nội dung</b>} rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}> 
                                             <Input.TextArea placeholder="Nhập nội dung chi tiết" rows={8} size="large" style={{ borderRadius: 8 }} />
                                        </Form.Item>
                                   </Col>
                                   <Col xs={24} md={10}>
                                        <Form.Item name="Topic" label={<b>Chủ đề</b>} rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}> 
                                             <Select placeholder="Chọn chủ đề" size="large" style={{ borderRadius: 8 }}>
                                                  {topicOptions.map((topic) => (
                                                       <Option key={topic} value={topic}>{topic}</Option>
                                                  ))}
                                             </Select>
                                        </Form.Item>
                                        <Form.Item
                                             name="ThumbnailImagePath"
                                             label={<b>Ảnh đại diện bài viết</b>}
                                             rules={[{ required: true, message: 'Vui lòng tải ảnh đại diện' }]}
                                             style={{ marginBottom: 0 }}
                                        >
                                             <Upload
                                                  listType="picture-card"
                                                  maxCount={1}
                                                  showUploadList={{ showRemoveIcon: true }}
                                                  beforeUpload={() => false}
                                                  accept="image/*"
                                                  fileList={fileList}
                                                  onChange={async ({ fileList: newFileList }) => {
                                                       setFileList(newFileList);
                                                       if (newFileList.length > 0) {
                                                            const file = newFileList[0].originFileObj;
                                                            if (file) {
                                                                 setUploading(true);
                                                                 try {
                                                                      const url = await uploadToCloudinary(file);
                                                                      setThumbnailPreview(url);
                                                                      form.setFieldsValue({ ThumbnailImagePath: url });
                                                                      message.success('Tải ảnh lên thành công!');
                                                                 } catch {
                                                                      message.error('Tải ảnh lên thất bại!');
                                                                 } finally {
                                                                      setUploading(false);
                                                                 }
                                                            }
                                                       } else {
                                                            setThumbnailPreview('');
                                                            form.setFieldsValue({ ThumbnailImagePath: '' });
                                                       }
                                                  }}
                                                  onRemove={() => {
                                                       setThumbnailPreview('');
                                                       form.setFieldsValue({ ThumbnailImagePath: '' });
                                                       setFileList([]);
                                                       return true;
                                                  }}
                                                  disabled={uploading}
                                             >
                                                  {fileList.length >= 1 ? null : (
                                                       <div>
                                                            {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                                                            <div style={{ marginTop: 8 }}>Tải ảnh</div>
                                                       </div>
                                                  )}
                                             </Upload>
                                        </Form.Item>
                                        <div style={{ marginBottom: 24 }}>
                                             <div style={{ fontWeight: 500, marginBottom: 8, color: '#1a3e72' }}>Xem trước ảnh đại diện bài viết</div>
                                             <div style={{
                                                  width: '100%',
                                                  minHeight: 180,
                                                  background: '#f0f2f5',
                                                  border: '1px dashed #b2becd',
                                                  borderRadius: 10,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  overflow: 'hidden',
                                             }}>
                                                  {thumbnailPreview ? (
                                                       <img
                                                            src={thumbnailPreview}
                                                            alt="Preview"
                                                            style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain' }}
                                                            onError={e => e.target.style.display = 'none'}
                                                       />
                                                  ) : (
                                                       <div style={{ color: '#b2becd', fontSize: 32, textAlign: 'center' }}><PictureOutlined /></div>
                                                  )}
                                             </div>
                                        </div>
                                   </Col>
                              </Row>
                              <Divider style={{ margin: '24px 0' }} />
                              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                                   <Button onClick={() => { setModalOpen(false); setThumbnailPreview(''); setFileList([]); form.resetFields(); }} style={{ marginRight: 16, borderRadius: 6 }}>Hủy</Button>
                                   <Button type="primary" htmlType="submit" loading={creating} size="large" style={{ fontWeight: 600, borderRadius: 6, minWidth: 120 }}>Tạo blog</Button>
                              </Form.Item>
                         </Form>
                    </div>
               </Modal>
               <Modal
                    className="blog-modal"
                    title={<span style={{color: 'black'}}>Chỉnh sửa blog</span>}
                    open={editModalOpen}
                    onCancel={() => { setEditModalOpen(false); setEditingBlog(null); setEditFileList([]); setEditThumbnailPreview(''); }}
                    footer={null}
                    centered
                    destroyOnClose
                    width="80vw"
                    style={{ top: 32, padding: 0 }}
                    styles={{
                         body: { padding: 0, minHeight: '70vh', background: '#f8fafc', borderRadius: 16 },
                         mask: { background: 'rgba(30, 42, 80, 0.18)' }
                    }}
               >
                    {editLoading ? (
                         <div style={{ textAlign: 'center', padding: 64 }}><Spin size="large" /></div>
                    ) : (
                         <div style={{ padding: '32px 48px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                              <Form
                                   form={editForm}
                                   layout="vertical"
                                   onFinish={onEditFinish}
                                   style={{ marginTop: 8 }}
                              >
                                   <Row gutter={48}>
                                        <Col xs={24} md={14}>
                                             <Form.Item name="Title" label={<b>Tiêu đề</b>} rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}> 
                                                  <Input placeholder="Nhập tiêu đề" size="large" style={{ borderRadius: 8 }} />
                                             </Form.Item>
                                             <Form.Item name="Description" label={<b>Mô tả ngắn</b>} rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}> 
                                                  <Input.TextArea placeholder="Nhập mô tả ngắn" rows={2} size="large" style={{ borderRadius: 8 }} />
                                             </Form.Item>
                                             <Form.Item name="Content" label={<b>Nội dung</b>} rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}> 
                                                  <Input.TextArea placeholder="Nhập nội dung chi tiết" rows={8} size="large" style={{ borderRadius: 8 }} />
                                             </Form.Item>
                                        </Col>
                                        <Col xs={24} md={10}>
                                             <Form.Item name="Topic" label={<b>Chủ đề</b>} rules={[{ required: true, message: 'Vui lòng chọn chủ đề' }]}> 
                                                  <Select placeholder="Chọn chủ đề" size="large" style={{ borderRadius: 8 }}>
                                                       {topicOptions.map((topic) => (
                                                            <Option key={topic} value={topic}>{topic}</Option>
                                                       ))}
                                                  </Select>
                                             </Form.Item>
                                             <Form.Item
                                                  name="ThumbnailImagePath"
                                                  label={<b>Ảnh đại diện bài viết</b>}
                                                  rules={[{ required: true, message: 'Vui lòng tải ảnh đại diện' }]}
                                                  style={{ marginBottom: 0 }}
                                             >
                                                  <Upload
                                                       listType="picture-card"
                                                       maxCount={1}
                                                       showUploadList={{ showRemoveIcon: true }}
                                                       beforeUpload={() => false}
                                                       accept="image/*"
                                                       fileList={editFileList}
                                                       onChange={handleEditUploadChange}
                                                       onRemove={handleEditRemove}
                                                       disabled={editUploading}
                                                  >
                                                       {editFileList.length >= 1 ? null : (
                                                            <div>
                                                                 {editUploading ? <LoadingOutlined /> : <PlusOutlined />}
                                                                 <div style={{ marginTop: 8 }}>Tải ảnh</div>
                                                            </div>
                                                       )}
                                                  </Upload>
                                             </Form.Item>
                                             <div style={{ marginBottom: 24 }}>
                                                  <div style={{ fontWeight: 500, marginBottom: 8, color: '#1a3e72' }}>Xem trước ảnh đại diện bài viết</div>
                                                  <div style={{
                                                       width: '100%',
                                                       minHeight: 180,
                                                       background: '#f0f2f5',
                                                       border: '1px dashed #b2becd',
                                                       borderRadius: 10,
                                                       display: 'flex',
                                                       alignItems: 'center',
                                                       justifyContent: 'center',
                                                       overflow: 'hidden',
                                                  }}>
                                                       {editThumbnailPreview ? (
                                                            <img
                                                                 src={editThumbnailPreview}
                                                                 alt="Preview"
                                                                 style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain' }}
                                                                 onError={e => e.target.style.display = 'none'}
                                                            />
                                                       ) : (
                                                            <div style={{ color: '#b2becd', fontSize: 32, textAlign: 'center' }}><PictureOutlined /></div>
                                                       )}
                                                  </div>
                                             </div>
                                        </Col>
                                   </Row>
                                   <Divider style={{ margin: '24px 0' }} />
                                   <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                                        <Button onClick={() => { setEditModalOpen(false); setEditingBlog(null); setEditFileList([]); setEditThumbnailPreview(''); }} style={{ marginRight: 16, borderRadius: 6 }}>Hủy</Button>
                                        <Button type="primary" htmlType="submit" loading={editUploading} size="large" style={{ fontWeight: 600, borderRadius: 6, minWidth: 120 }}>Lưu thay đổi</Button>
                                   </Form.Item>
                              </Form>
                         </div>
                    )}
               </Modal>
          </div>
     );
};

export default BlogManagement;
