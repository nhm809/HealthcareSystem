import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { notiApi } from '../../services/api';
import Cookies from 'js-cookie';

export default function AppointmentResultHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const notiSentRef = useRef({});
    const userId = Cookies.get('userId');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const handler = params.get('handler');
        const appointmentId = params.get('appointmentId');

        if (!handler || !appointmentId || !userId) {
            navigate('/appointment');
            return;
        }

        const key = `noti_${handler}_appointment_${appointmentId}`;
        const sentAlready = sessionStorage.getItem(key) || notiSentRef.current[key];
        if (sentAlready) {
            navigate('/appointment');
            return;
        }

        notiSentRef.current[key] = true;
        sessionStorage.setItem(key, '1');

        const notiData = {
            userId: Number(userId),
            isRead: false,
            title: handler === 'success'
            ? 'Đặt lịch tư vấn thành công'
            : 'Thanh toán chưa hoàn tất',
            content: handler === 'success'
            ? `Bạn đã đặt lịch tư vấn thành công. Mã lịch hẹn: ${appointmentId}`
            : `Bạn chưa hoàn tất thanh toán lịch tư vấn (Mã: ${appointmentId}). Vui lòng thử lại.`,
        };

        notiApi.createNoti(notiData)
            .finally(() => {
                navigate('/appointment');
            });
    }, [location, navigate, userId]);

    return <div>Đang xử lý kết quả thanh toán...</div>;
}