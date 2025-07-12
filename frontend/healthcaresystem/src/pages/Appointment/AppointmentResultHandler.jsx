import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api, { notiApi } from '../../services/api';
import Cookies from 'js-cookie';

export default function AppointmentResultHandler() {
    const location = useLocation();
    const navigate = useNavigate();
    const userId = Cookies.get('userId');

    useEffect(() => {
        const run = async () => {
            const params = new URLSearchParams(location.search);
            const handler = params.get('handler');
            const appointmentId = params.get('appointmentId');

            if (!handler || !appointmentId || !userId) {
                navigate('/appointment', {
                    state: { serviceId: 2 }
                });
                return;
            }

            const keyMember = `noti_${handler}_appointment_${appointmentId}`;
            const keyConsultant = `noti_consultant_appointment_${appointmentId}`;
            const sentMember = sessionStorage.getItem(keyMember);
            const sentConsultant = sessionStorage.getItem(keyConsultant);

            if (sentMember && sentConsultant) {
                navigate('/appointment', {
                    state: { serviceId: 2 }
                });
                return;
            }

            try {
                if (!sentMember) {
                    const res = await api.get(`/Appointment/detail/${appointmentId}`);
                    if (res.data.success) {
                        const detail = res.data.data;
                        if (handler !== 'success') {
                            const notiForMember = {
                                userId: Number(userId),
                                isRead: false,
                                title: 'Thanh toán chưa hoàn tất',
                                content: `Bạn chưa hoàn tất thanh toán lịch tư vấn với ${detail.consultantName}. Vui lòng thử lại.`,
                            };
                            await notiApi.createNoti(notiForMember);
                            sessionStorage.setItem(keyMember, '1');
                            }
                    }
                }

            } catch (err) {
                console.error('Lỗi khi tạo notification:', err);
            } finally {
                navigate('/appointment', {
                    state: { serviceId: 2 }
                });
            }
        };
        run();
    }, [location, navigate, userId]);

    return <div>Đang xử lý kết quả thanh toán...</div>;
}