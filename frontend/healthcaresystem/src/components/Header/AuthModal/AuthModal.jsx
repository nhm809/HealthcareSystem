import React, { useContext, useState } from 'react';
import { Modal, Box, Typography, Tabs, Tab } from '@mui/material';
import FormInput from '../../FormInput/FormInput';
import Button from '../../Button/Button';
import { authApi } from '../../../services/api';
import './AuthModal.css';
import { ToastContext } from '../../../contexts/ToastProvider';
import Cookies from 'js-cookie';
import { StoreContext } from '../../../contexts/StoreProvider';
import { validateLogin, validateRegister } from '../../../utils/validate';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import loginBanner from '../../../assets/imgs/loginBanner.png';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function AuthModal({ open, onClose }) {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const { toast } = useContext(ToastContext);
    const [inputErrors, setInputErrors] = useState({});
    const [forgotEmail, setForgotEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError('');

        try {
            const errors = validateLogin({ email, password });
            if (Object.keys(errors).length > 0) {
                setInputErrors(errors);
                return;
            }

            setInputErrors({});
            const response = await authApi.login({ email, password });

            if (response.data.success) {
                const { token, refreshToken, email, roleId, phoneNumber, avatarPath, userId } = response.data;

                Cookies.set('token', token);
                Cookies.set('refreshToken', refreshToken);
                Cookies.set('email', email);
                Cookies.set('userId', userId);

                const userInfo = {
                    email,
                    roleId,
                    phoneNumber,
                    avatarPath
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));

                // Update user state in Header
                const headerUser = {
                    email,
                    roleId,
                    phoneNumber,
                    avatar: avatarPath
                };
                window.dispatchEvent(new CustomEvent('userLogin', { detail: headerUser }));

                toast.success('Đăng nhập thành công');
                onClose();
            }
        } catch (err) {
            console.error(err);
            setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            setInputErrors({});
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError('');

        try {
            const errors = validateRegister({ email, password, confirmPassword, phoneNumber });
            if (Object.keys(errors).length > 0) {
                setInputErrors(errors);
                return;
            }

            setInputErrors({});

            const response = await authApi.register({
                email,
                password,
                phoneNumber,
            });

            if (response.data.success) {
                setTab(0);
                setError('');
                toast.success(response.data.message);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
            setInputErrors({});
        }
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        setError('');
        setInputErrors({});
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setPhoneNumber('');
        setShowForgotPassword(false);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validate email
            if (!forgotEmail) {
                setError('Vui lòng nhập email');
                return;
            }

            const response = await authApi.sendOTP(forgotEmail);
            if (response.data.success) {
                setIsOtpSent(true);
                toast.success('OTP đã được gửi đến email của bạn');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Gửi OTP thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Validate
            if (!otp || !newPassword || !confirmNewPassword) {
                setError('Vui lòng điền đầy đủ thông tin');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                setError('Mật khẩu mới không khớp');
                return;
            }

            const response = await authApi.resetPassword({
                email: forgotEmail,
                otp,
                newPassword
            });

            if (response.data.success) {
                toast.success('Đặt lại mật khẩu thành công');
                setTab(0); // Chuyển về tab đăng nhập
                // Reset các state
                setForgotEmail('');
                setOtp('');
                setNewPassword('');
                setConfirmNewPassword('');
                setIsOtpSent(false);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setShowForgotPassword(false);
        setForgotEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
        setIsOtpSent(false);
        setError('');
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className="auth-modal-2col">
                <div className="auth-modal-left">
                    {!showForgotPassword ? (
                        <>
                            <Tabs value={tab} onChange={handleTabChange} centered>
                                <Tab label="Đăng nhập" />
                                <Tab label="Đăng ký" />
                            </Tabs>

                            {tab === 0 && (
                                <form className="auth-form" onSubmit={handleLogin} noValidate>
                                    <FormInput
                                        label="Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        error={inputErrors.email}
                                    />
                                    <FormInput
                                        label="Mật khẩu"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        error={inputErrors.password}
                                    />
                                    <Button type="submit" id="btn-style">ĐĂNG NHẬP</Button>

                                    {error && (
                                        <Typography className="error-message">{error}</Typography>
                                    )}

                                    <a className="forget-account" onClick={() => setShowForgotPassword(true)}>Quên mật khẩu</a>

                                    <div className="auth-divider">
                                        <span></span>
                                        <span className="auth-divider-text">Hoặc đăng nhập với</span>
                                        <span></span>
                                    </div>

                                    <GoogleOAuthProvider clientId="643990637416-5eu4q1ptjimm46k4v8aj3k86grjuiie9.apps.googleusercontent.com">
                                        <GoogleLogin
                                            onSuccess={async (credentialResponse) => {
                                                try {
                                                    console.log("Google Token:", credentialResponse.credential);
                                                    if (!credentialResponse.credential) {
                                                        toast.error('Không nhận được token từ Google');
                                                        return;
                                                    }

                                                    // Gửi token trực tiếp
                                                    const response = await authApi.googleLogin(credentialResponse.credential);
                                                    console.log("Backend Response:", response.data);

                                                    if (response.data.success) {
                                                        const googleUser = response.data.data;
                                                        console.log("Google User Data:", googleUser);

                                                        // Lưu thông tin user
                                                        const userInfo = {
                                                            email: googleUser.email,
                                                            roleId: "MB", // Default role cho Google users
                                                            phoneNumber: "", // Empty phone number
                                                            avatarPath: googleUser.picture
                                                        };
                                                        console.log("User Info to save:", userInfo);
                                                        localStorage.setItem('userInfo', JSON.stringify(userInfo));

                                                        // Lưu email và ID
                                                        Cookies.set('email', googleUser.email);
                                                        Cookies.set('userId', googleUser.userId); // Sử dụng userId từ backend
                                                        Cookies.set('token', googleUser.token); // Lưu JWT token

                                                        // Update user state in Header
                                                        const headerUser = {
                                                            email: googleUser.email,
                                                            roleId: "MB",
                                                            phoneNumber: "",
                                                            avatar: googleUser.picture
                                                        };
                                                        console.log("Header User:", headerUser);
                                                        window.dispatchEvent(new CustomEvent('userLogin', { detail: headerUser }));

                                                        toast.success('Đăng nhập thành công');
                                                        onClose();
                                                    }
                                                } catch (err) {
                                                    console.error('Lỗi đăng nhập Google:', err);
                                                    console.error('Response data:', err.response?.data);
                                                    console.error('Response status:', err.response?.status);
                                                    console.error('Request data:', err.config?.data);
                                                    console.error('Full error:', err);
                                                    toast.error(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
                                                }
                                            }}
                                            onError={(error) => {
                                                console.error('Google login error:', error);
                                                toast.error('Đăng nhập với Google thất bại');
                                            }}
                                        />
                                    </GoogleOAuthProvider>
                                </form>
                            )}

                            {tab === 1 && (
                                <form className="auth-form" onSubmit={handleRegister} noValidate>
                                    <FormInput
                                        label="Email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        error={inputErrors.email}
                                    />
                                    <FormInput
                                        label="Số điện thoại"
                                        value={phoneNumber}
                                        onChange={e => setPhoneNumber(e.target.value)}
                                        error={inputErrors.phoneNumber}
                                    />
                                    <FormInput
                                        label="Mật khẩu"
                                        type="password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        error={inputErrors.password}
                                    />
                                    <FormInput
                                        label="Nhập lại mật khẩu"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        error={inputErrors.confirmPassword}
                                    />
                                    <Button type="submit" id="btn-style">TIẾP TỤC</Button>
                                    {error && (
                                        <Typography className="error-message">{error}</Typography>
                                    )}
                                    <div className="auth-divider">
                                        <span></span>
                                        <span className="auth-divider-text">Hoặc đăng ký với</span>
                                        <span></span>
                                    </div>
                                    <button type="button" className="google-btn">
                                        <img src="https://images.icon-icons.com/2429/PNG/512/google_logo_icon_147282.png" alt="Google" className="google-icon" />
                                        Đăng ký với Google
                                    </button>
                                </form>
                            )}
                        </>
                    ) : (
                        <div className="forgot-password-container">
                            <Typography variant="h6" className="forgot-password-title">
                                Quên mật khẩu
                            </Typography>
                            <form className="auth-form" onSubmit={isOtpSent ? handleResetPassword : handleSendOTP}>
                                <FormInput
                                    label="Email"
                                    value={forgotEmail}
                                    onChange={e => setForgotEmail(e.target.value)}
                                    error={inputErrors.email}
                                    disabled={isOtpSent}
                                />
                                
                                {isOtpSent && (
                                    <>
                                        <FormInput
                                            label="Mã OTP"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            error={inputErrors.otp}
                                        />
                                        <FormInput
                                            label="Mật khẩu mới"
                                            type="password"
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                            error={inputErrors.newPassword}
                                        />
                                        <FormInput
                                            label="Nhập lại mật khẩu mới"
                                            type="password"
                                            value={confirmNewPassword}
                                            onChange={e => setConfirmNewPassword(e.target.value)}
                                            error={inputErrors.confirmNewPassword}
                                        />
                                    </>
                                )}
                                <Button 
                                    type="submit" 
                                    id="btn-style"
                                    disabled={isLoading}
                                >
                                    {isOtpSent ? 'ĐẶT LẠI MẬT KHẨU' : 'GỬI OTP'}
                                </Button>
                                {error && (
                                    <Typography className="error-message">{error}</Typography>
                                )}
                                <a onClick={handleBackToLogin}> <FontAwesomeIcon icon={faArrowLeft} className="back-to-login-btn"/> Quay lại đăng nhập </a>
                            </form>
                        </div>
                    )}
                </div>
                <div className="auth-modal-right">
                    <img src={loginBanner} alt="auth-visual" className="auth-modal-img" />
                </div>
            </Box>
        </Modal>
    );
}

export default AuthModal;