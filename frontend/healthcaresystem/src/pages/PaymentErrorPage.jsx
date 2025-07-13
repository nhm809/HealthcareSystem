import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

function PaymentErrorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const message = decodeURIComponent(params.get("message") || "Thanh toán thất bại");

  useEffect(() => {
    toast.error('Thanh toán thất bại.'); // Hiển thị toast
    navigate("/"); // Quay về trang chủ sau 2s

    return () => clearTimeout(timeout);
  }, [message, navigate]);

  return null; // Không cần hiển thị gì trên trang này
}

export default PaymentErrorPage;
