import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { notiApi } from '../../services/api';
import Cookies from 'js-cookie';

function PaypalCallback() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const handler = params.get('handler');
        const testServiceRecordId = params.get('testServiceRecordId');
        const userId = Cookies.get('userId');
        // const now = new Date().toISOString();

        if (handler === 'success' && userId && testServiceRecordId) {
            navigate('/');
        } 
    }, [location, navigate]);

    return <div>Đang xử lý thanh toán...</div>;
}

export default PaypalCallback;