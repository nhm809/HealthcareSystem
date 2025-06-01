import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';

const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(60);
    const inputRefs = useRef([]);
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleChange = (index, value) => {
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Auto focus next input
            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast.error('Vui lòng nhập đầy đủ mã xác thực');
            return;
        }
        // TODO: Implement OTP verification logic here
        console.log('OTP submitted:', otpString);
    };

    const handleResendCode = () => {
        if (timeLeft === 0) {
            setTimeLeft(60);
            // TODO: Implement resend code logic here
            toast.success('Mã xác thực mới đã được gửi');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-bold text-center flex-1">Xác thực</h2>
                </div>

                <p className="text-gray-600 mb-6">
                    Vui lòng nhập mã xác thực đã được gửi đến số điện thoại của bạn
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between mb-6">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputRefs.current[index] = el)}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors mb-4"
                    >
                        Tiếp tục
                    </button>

                    <div className="text-center">
                        <p className="text-gray-600">
                            Bạn chưa nhận được mã?{' '}
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={timeLeft > 0}
                                className={`text-blue-500 ${
                                    timeLeft > 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'
                                }`}
                            >
                                Gửi lại ({timeLeft}s)
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OTPVerification;