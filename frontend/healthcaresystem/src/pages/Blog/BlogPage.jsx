// src/pages/Blog/BlogPage.jsx
import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, useSearchParams  } from 'react-router-dom';
import './BlogPage.css';
import MainLayout from '../../components/Layout/Layout';
import api from '../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination } from 'antd';
import axios from 'axios';
import {
     faHeart,
     faBrain,
     faLungs,
     faFire,
     faBaby,
     faBone,
     faMagnifyingGlass,
     faLayerGroup,
     faVenus
} from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';

const iconMap = {
  'Sức khỏe': faHeart,
  'STIs': faBrain,
  'Tâm lý': faLungs,
  'Hướng dẫn': faFire,
  'Nhi khoa': faBaby,
  'Cơ xương khớp': faBone,
  'Giới tính': faVenus,
};

function BlogPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  const topicFromUrl = searchParams.get('Topic') || 'Tất cả';

  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [selectedTopic, setSelectedTopic] = useState(topicFromUrl);
  const [topicCounts, setTopicCounts] = useState({});

  const pageSize = 3;

  // Gọi API khi selectedTopic thay đổi
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const url =
          selectedTopic === 'Tất cả'
            ? '/blogs'
            : `/blogs/topic/${encodeURIComponent(selectedTopic)}`;
        const res = await api.get(url);
        setBlogs(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy blog:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [selectedTopic]);

  // Gọi 1 lần để đếm số lượng blog theo topic
  useEffect(() => {
    const fetchAllCounts = async () => {
      try {
        const res = await api.get('/blogs');
        const counts = res.data.reduce((acc, blog) => {
          acc[blog.topic] = (acc[blog.topic] || 0) + 1;
          return acc;
        }, {});
        setTopicCounts(counts);
      } catch (error) {
        console.error('Lỗi khi đếm topic:', error);
      }
    };
    fetchAllCounts();
  }, []);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentBlogs = filteredBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSearchParams({ page, topic: selectedTopic });
  };

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setCurrentPage(1);
    setSearchParams({ page: 1, topic })
  }

  const handleClick = (id) => {
    navigate(`/blog/${id}`, {
      state: {
        from: location.pathname + location.search,
      },
    });
  };

  return (
    <MainLayout>
      <div className="blog-page">
        {/* Sidebar trái */}
        <div className="blog-sidebar">
          <div className="search-box">
            <FontAwesomeIcon icon={faMagnifyingGlass} className='search-icon'/>
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-list">
            <h4>Chuyên mục</h4>
            <div
              className={`category-item ${selectedTopic === 'Tất cả' ? 'active' : ''}`}
              onClick={() => handleTopicClick('Tất cả')}
            >
              <span className='icon'><FontAwesomeIcon icon={faLayerGroup} /></span>
              <span className='name'>Tất cả</span>
              <span className='count'>{Object.values(topicCounts).reduce((a, b) => a + b, 0)}</span>
            </div>
            {Object.entries(topicCounts).map(([topic, count]) => (
              <div
                key={topic}
                className={`category-item ${selectedTopic === topic ? 'active' : ''}`}
                onClick={() => handleTopicClick(topic)}
              >
                <span className='icon'>
                  <FontAwesomeIcon icon={iconMap[topic]} />
                </span>
                <span className='name'>{topic}</span>
                <span className='count'>{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="blog-content-area">
          <h2 className="blog-title">Bài viết nổi bật</h2>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <>
              <div className='blog-list'>
                {currentBlogs.length > 0 ? (
                  currentBlogs.map((blog) => (
                    <div className='blog-item' key={blog.blogID} onClick={() => handleClick(blog.blogID)}>
                      <img src={blog.thumbnailImagePath} alt={blog.title} className='blog-image' />
                      <div className='blog-content'>
                        <span className='blog-category'>{blog.topic}</span>
                        <h3 className='blog-heading'>{blog.title}</h3>
                        <span className='blog-time'>{blog.publishDate ? dayjs(blog.publishDate).format('DD/MM/YYYY') : '-'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Không có bài viết nào.</p>
                )}
              </div>
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredBlogs.length}
                onChange={handlePageChange}
                className="blog-pagination"
              />
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default BlogPage;
