// src/pages/Blog/BlogPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './BlogPage.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Pagination } from 'antd';
import {
     faHeart,
     faBrain,
     faLungs,
     faFire,
     faBaby,
     faBone,
     faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

const categories = [
  { name: 'Tim mạch', icon: <FontAwesomeIcon icon={faHeart} />, count: 12 },
  { name: 'Thần kinh', icon: <FontAwesomeIcon icon={faBrain} />, count: 8 },
  { name: 'Hô hấp', icon: <FontAwesomeIcon icon={faLungs} />, count: 5 },
  { name: 'Dinh dưỡng', icon: <FontAwesomeIcon icon={faFire} />, count: 10 },
  { name: 'Nhi khoa', icon: <FontAwesomeIcon icon={faBaby} />, count: 9 },
  { name: 'Cơ xương khớp', icon: <FontAwesomeIcon icon={faBone} />, count: 4 },
];

const mockBlogs = [
  {
    id: 1,
    category: 'Tim mạch',
    title: 'Khám sức khỏe tổng quát cho người cao tuổi ở đâu?',
    description: 'Khám sức khỏe tổng quát giúp phát hiện sớm các bệnh lý tiềm ẩn...',
    timeAgo: '1 tháng trước',
    image: '/assets/blog1.jpg',
  },
  {
    id: 2,
    category: 'Sức khỏe tổng quát',
    title: '7 dấu hiệu cảnh báo cần khám sức khỏe định kỳ ngay',
    description: 'Có những dấu hiệu nhỏ nhưng nếu kéo dài, đó là dấu hiệu cần kiểm tra...',
    timeAgo: '2 tuần trước',
    image: '/assets/blog2.jpg',
  },
  {
    id: 3,
    category: 'Dinh dưỡng',
    title: 'Chế độ ăn lành mạnh cho người bệnh tim mạch',
    description: 'Ăn uống hợp lý giúp kiểm soát huyết áp, giảm cholesterol...',
    timeAgo: '3 tuần trước',
    image: '/assets/blog3.jpg',
  },
    {
    id: 4,
    category: 'Dinh dưỡng',
    title: 'Chế độ ăn lành mạnh cho người bệnh tim mạch',
    description: 'Ăn uống hợp lý giúp kiểm soát huyết áp, giảm cholesterol...',
    timeAgo: '3 tuần trước',
    image: '/assets/blog3.jpg',
  },
];

function BlogPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleClick = (id) => {
    navigate(`/blog/${id}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3;

  const currentBlogs = mockBlogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
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
          {categories.map((cat, index) => (
            <div className="category-item" key={index}>
              <span className="icon">{cat.icon}</span>
              <span className="name">{cat.name}</span>
              <span className="count">{cat.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="blog-content-area">
        <h2 className="blog-title">Bài viết nổi bật</h2>
        <div className="blog-list">
          {currentBlogs.map((blog) => (
            <div className="blog-item" key={blog.id} onClick={() => handleClick(blog.id)}>
              <img src={blog.image} alt={blog.title} className="blog-image" />
              <div className="blog-content">
                <span className="blog-category">{blog.category}</span>
                <h3 className="blog-heading">{blog.title}</h3>
                <p className="blog-desc">{blog.description}</p>
                <span className="blog-time">{blog.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={mockBlogs.length}
          onChange={(page) => setCurrentPage(page)}
          className="blog-pagination"
        />
      </div>
    </div>
  );
}

export default BlogPage;
