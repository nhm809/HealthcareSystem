import React, { useContext, useState } from 'react';
import { Modal, Box, Typography, Tabs, Tab } from '@mui/material';
import FormInput from '../../FormInput/FormInput';
import Button from '../../Button/Button';
import { authApi } from '../../../services/api';
import './AuthModal.css';
import { ToastContext } from '../../../contexts/ToastProvider';
import Cookies from 'js-cookie';

function AuthModal({ open, onClose }) {
    const [tab, setTab] = useState(0); // 0: Login, 1: Register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const { toast } = useContext(ToastContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = {
                data: {
                    success: true,
                    token: 'mocked-access-token-123',
                    refreshToken: 'mocked-refresh-token-456',
                    // các trường khác nếu cần
                }
            };

            // const response = await authApi.login({ email, password });
            if (response.data.success) {
                toast.success('Đăng nhập thành công');
                onClose();
                //   setTimeout(() => {
                //       window.location.reload();
                //   }, 5000);
                console.log(response);
                const { id, token, refreshToken } = response.data;
                Cookies.set('token', token);
                Cookies.set('refreshToken', refreshToken);

            }
        } catch (err) {
            console.error(err);
            toast.error(err.response.data.message);
            setError('Login failed. Please check your credentials.');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        try {
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
            toast.error(err.response.data.message);
            setError('Registration failed. Please try again.');
        }
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
        setError('');
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
                        <form className="auth-form" onSubmit={handleLogin}>
                            <FormInput label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <FormInput label="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            <Button type="submit" id="btn-style">
                                ĐĂNG NHẬP
                            </Button>

                            {error && (
                                <Typography className="error-message">{error}</Typography>
                            )}

                            <a className="forget-account" href="#">Quên mật khẩu</a>

                            <div className="auth-divider">
                                <span></span>
                                <span className="auth-divider-text">Hoặc đăng nhập với</span>
                                <span></span>
                            </div>
                            <button type="button" className="google-btn">
                                <img src="https://images.icon-icons.com/2429/PNG/512/google_logo_icon_147282.png" alt="Google" className="google-icon" />
                                Đăng nhập với Google
                            </button>
                        </form>
                    )}

                    {tab === 1 && (
                        <form className="auth-form" onSubmit={handleRegister}>
                            <FormInput label="Email" value={email} onChange={e => setEmail(e.target.value)} />
                            <FormInput label="Số điện thoại" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                            <FormInput label="Mật khẩu" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                            <FormInput label="Nhập lại mật khẩu" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
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
                    <img src="https://nqs.1cdn.vn/2025/05/26/statictttc.kinhtedothi.vn-zoom-1000-uploaded-luonghaiyen-2025_05_26-_jack2_txeh.jpg" alt="auth-visual" className="auth-modal-img" />
                </div>
            </Box>
        </Modal>
    );
}

export default AuthModal;