import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './BlogDetail.css';
import MainLayout from '../../components/Layout/Layout';

function BlogDetail() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5011/api/blogs/${id}`);
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

  if (loading) return <div>Đang tải...</div>;
  if (!blog) return <div>Không tìm thấy bài viết</div>;

  return (

    <MainLayout>
      <div className="blog-detail">
        <div className="blog-detail-header">
          <ArrowLeftOutlined onClick={goBack} className="back-icon" />
          <h1>{blog.title}</h1>
          <div className="meta">
            <span>{blog.consultantName}</span> | <span>{blog.publishDate}</span> | <span>{blog.topic}</span>
          </div>
        </div>
        <img className="blog-detail-image" src={blog.images[0].imagePath} alt={blog.title} />
        <div className="blog-detail-content">
          {blog.content.split('\n').map((p, index) => (
            <p key={index}>{p.trim()}</p>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

export default BlogDetail;
