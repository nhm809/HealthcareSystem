export const validateLogin = ({ email, password }) => {
    const errors = {};

    if (!email) {
        errors.email = 'Vui lòng nhập email.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.email = 'Email không hợp lệ.';
    }

    if (!password) {
        errors.password = 'Vui lòng nhập mật khẩu.';
    } else if (password.length < 1) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
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
