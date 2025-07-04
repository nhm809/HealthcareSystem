import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { notiApi } from '../../services/api';
import Cookies from 'js-cookie';

export default function AppointmentResultHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const notiSentRef = useRef({});
    const userId = Cookies.get('userId');

    useEffect(() => {
        const run = async () => {
            const params = new URLSearchParams(location.search);
            const handler = params.get('handler');
            const appointmentId = params.get('appointmentId');

            if (!handler || !appointmentId || !userId) {
                navigate('/appointment');
                return;
            }

            const keyMember = `noti_${handler}_appointment_${appointmentId}`;
            const keyConsultant = `noti_consultant_appointment_${appointmentId}`;
            const sentMember = sessionStorage.getItem(keyMember);
            const sentConsultant = sessionStorage.getItem(keyConsultant);

            if (sentMember && sentConsultant) {
                navigate('/appointment');
                return;
            }

            try {
                if (!sentMember) {
                    const notiForMember = {
                        userId: Number(userId),
                        isRead: false,
                        title: handler === 'success'
                            ? 'Đặt lịch tư vấn thành công'
                            : 'Thanh toán chưa hoàn tất',
                        content: handler === 'success'
                            ? `Bạn đã đặt lịch tư vấn thành công. Mã lịch hẹn: ${appointmentId}`
                            : `Bạn chưa hoàn tất thanh toán lịch tư vấn (Mã: ${appointmentId}). Vui lòng thử lại.`,
                    };
                    await notiApi.createNoti(notiForMember);
                    sessionStorage.setItem(keyMember, '1');
                }

                if (!sentConsultant) {
                    const res = await api.get(`/Appointment/detail/${appointmentId}`);
                    if (res.data.success) {
                        const detail = res.data.data;
                        const notiForConsultant = {
                            userId: detail.consultantId,
                            isRead: false,
                            title: 'Lịch hẹn mới',
                            content: `Bạn có một lịch hẹn mới với ${detail.memberName} vào lúc ${dayjs(detail.startTime).format('HH:mm DD/MM/YYYY')}.`,
                        };
                        await notiApi.createNoti(notiForConsultant);
                        sessionStorage.setItem(keyConsultant, '1');
                    }
                }
            } catch (err) {
                console.error('Lỗi khi tạo notification:', err);
            } finally {
                navigate('/appointment');
            }
        };

        run();
    }, [location, navigate, userId]);

    return <div>Đang xử lý kết quả thanh toán...</div>;
}