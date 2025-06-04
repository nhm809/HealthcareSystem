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

function AuthModal({ open, onClose }) {
    const [tab, setTab] = useState(0);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const { toast } = useContext(ToastContext);
    const [inputErrors, setInputErrors] = useState({});

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
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className="auth-modal-2col">
                <div className="auth-modal-left">
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

                            <a className="forget-account" href="#" onClick={(e) => e.preventDefault()}>Quên mật khẩu</a>

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
                                            const response = await authApi.googleLogin(credentialResponse.credential);

                                            if (response.data.success) {
                                                const { token, refreshToken, user } = response.data.data;
                                                
                                                // Save tokens
                                                Cookies.set('token', token);
                                                Cookies.set('refreshToken', refreshToken);
                                                Cookies.set('email', user.email);
                                                Cookies.set('userId', user.id);

                                                // Save user info
                                                const userInfo = {
                                                    email: user.email,
                                                    roleId: user.roleId,
                                                    phoneNumber: user.phoneNumber,
                                                    avatarPath: user.avatarPath
                                                };
                                                localStorage.setItem('userInfo', JSON.stringify(userInfo));

                                                toast.success('Đăng nhập thành công');
                                                onClose();
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
                                        }
                                    }}
                                    onError={() => {
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
                </div>
                <div className="auth-modal-right">
                    <img src="https://huynhgiaminh.vn/media/1031/dong-phuc-y-te-1.jpg" alt="auth-visual" className="auth-modal-img" />
                </div>
            </Box>
        </Modal>
    );
}

export default AuthModal;