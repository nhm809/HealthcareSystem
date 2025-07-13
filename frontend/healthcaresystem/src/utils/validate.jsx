export const validateLogin = ({ email, password }) => {
    const errors = {};

    if (!email) {
        errors.email = 'Vui lòng nhập email.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Email không hợp lệ.';
    }

    if (!password) {
        errors.password = 'Vui lòng nhập mật khẩu.';
    }

    return errors;
};

export const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < 8) {
        errors.push('Ít nhất 8 ký tự');
    }
    if (!/[A-Z]/.test(password)) {
        errors.push('Có chữ in hoa');
    }
    if (!/[a-z]/.test(password)) {
        errors.push('Có chữ thường');
    }
    if (!/\d/.test(password)) {
        errors.push('Có số');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Có ký tự đặc biệt');
    }
    
    return errors;
};

export const validateRegister = ({ email, password, confirmPassword, phoneNumber }) => {
    const errors = validateLogin({ email, password });

    if (!phoneNumber) {
        errors.phoneNumber = 'Vui lòng nhập số điện thoại.';
    } else if (!/^\d{9,11}$/.test(phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại không hợp lệ.';
    }

    if (!confirmPassword) {
        errors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
    } else if (confirmPassword !== password) {
        errors.confirmPassword = 'Mật khẩu không khớp.';
    }

    return errors;
};
