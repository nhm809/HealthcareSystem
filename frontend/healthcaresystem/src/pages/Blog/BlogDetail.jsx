import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import './BlogDetail.css';

const mockBlogData = {
  id: 1,
  title: 'COVID kéo dài có thể làm gia tăng lo âu và trầm cảm ở trẻ em',
  author: 'Phương Tuấn',
  date: '22/05/2025',
  category: 'Nhi khoa',
  image: '/assets/blog_detail.jpg',
  content: `
    Hậu quả tinh thần của đại dịch COVID-19 đang trở thành một chủ đề nóng trong y tế cộng đồng...
    
    COVID kéo dài - không chỉ là những triệu chứng thể chất...

    Các chuyên gia nhận thấy trẻ em mắc COVID-19 có biểu hiện lo âu, trầm cảm kéo dài...
  `
};

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="blog-detail">
      <div className="blog-detail-header">
        <ArrowLeftOutlined onClick={() => navigate('/blog')} className="back-icon" />
        <h1>{mockBlogData.title}</h1>
        <div className="meta">
          <span>{mockBlogData.author}</span> | <span>{mockBlogData.date}</span> | <span>{mockBlogData.category}</span>
        </div>
      </div>
      <img className="blog-detail-image" src={mockBlogData.image} alt={mockBlogData.title} />
      <div className="blog-detail-content">
        {mockBlogData.content.split('\n').map((p, index) => (
          <p key={index}>{p.trim()}</p>
        ))}
      </div>
    </div>
  );
}

export default BlogDetail;
