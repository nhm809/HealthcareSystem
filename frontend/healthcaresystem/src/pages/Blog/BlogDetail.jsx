import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import './BlogDetail.css';
import MainLayout from '../../components/Layout/Layout';
import dayjs from 'dayjs';
import api from '../../services/api';

function BlogDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('blogFontSize');
    return saved ? parseInt(saved) : 16;
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết blog:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const goBack = () => {
    if (location.state?.from) {
      navigate(location.state.from); // quay lại đúng trang trước
    } else {
      navigate('/blog'); // fallback nếu không có state
    }
  };

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 2, 24); // Max 24px
    setFontSize(newSize);
    localStorage.setItem('blogFontSize', newSize.toString());
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 2, 12); // Min 12px
    setFontSize(newSize);
    localStorage.setItem('blogFontSize', newSize.toString());
  };

  const resetFontSize = () => {
    setFontSize(16);
    localStorage.setItem('blogFontSize', '16');
  };

  if (loading) return <div>Đang tải...</div>;
  if (!blog) return <div>Không tìm thấy bài viết</div>;

  return (

    <MainLayout>
      <div className="blog-detail">
        <div className="blog-detail-header">
          <div className="header-top">
            <ArrowLeftOutlined onClick={goBack} className="back-icon" />
            <div className="font-size-controls">
              <span className="font-size-label">Kích thước chữ:</span>
              <button onClick={decreaseFontSize} className="font-btn" title="Giảm kích thước chữ">
                <MinusOutlined />
              </button>
              <span className="font-size-display">{fontSize}</span>
              <button onClick={increaseFontSize} className="font-btn" title="Tăng kích thước chữ">
                <PlusOutlined />
              </button>
              <button onClick={resetFontSize} className="font-btn reset-btn" title="Kích thước mặc định">
                Mặc định
              </button>
            </div>
          </div>
          <h1>{blog.title}</h1>
          <div className="meta">
            <span>{blog.consultantName}</span> | <span>{blog.publishDate ? dayjs(blog.publishDate).format('DD/MM/YYYY') : '-'}</span> | <span>{blog.topic}</span>
          </div>
        </div>
        {blog.description && (
          <div className="blog-description" style={{ fontSize: `${fontSize}px` }}>
            <p>{blog.description}</p>
          </div>
        )}
        <img className="blog-detail-image" src={blog.images[0].imagePath} alt={blog.title} />
        <div className="blog-detail-content" style={{ fontSize: `${fontSize}px` }}>
          {blog.content.split('\n').map((p, index) => (
            <p key={index}>{p.trim()}</p>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default BlogDetail;
