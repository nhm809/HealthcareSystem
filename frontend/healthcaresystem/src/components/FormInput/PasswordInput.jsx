import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton, Box, Typography } from '@mui/material';
import { Visibility, VisibilityOff, CheckCircle, Cancel } from '@mui/icons-material';
import { validatePassword } from '../../utils/validate';
import './PasswordInput.css';

function PasswordInput({ 
  label, 
  value, 
  onChange, 
  error, 
  showValidation = false, 
  onValidationChange,
  confirmPassword = null,
  ...props 
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [validations, setValidations] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    const passwordErrors = validatePassword(value);
    const newValidations = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
    };
    
    // Nếu là confirm password, thêm validation khớp với password gốc
    if (confirmPassword !== null) {
      newValidations.match = value === confirmPassword;
    }
    
    setValidations(newValidations);
    
    if (onValidationChange) {
      const isValid = Object.values(newValidations).every(Boolean);
      onValidationChange(isValid);
    }
  }, [value, confirmPassword, onValidationChange]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const validationItems = [
    { key: 'length', label: 'Ít nhất 8 ký tự', rule: validations.length },
    { key: 'uppercase', label: 'Có chữ in hoa', rule: validations.uppercase },
    { key: 'lowercase', label: 'Có chữ thường', rule: validations.lowercase },
    { key: 'number', label: 'Có số', rule: validations.number },
    { key: 'special', label: 'Có ký tự đặc biệt', rule: validations.special }
  ];

  // Thêm validation cho confirm password
  if (confirmPassword !== null) {
    validationItems.push({
      key: 'match',
      label: 'Mật khẩu nhập lại khớp',
      rule: validations.match
    });
  }

  return (
    <Box className="password-input-container">
      <TextField
        label={label}
        value={value}
        onChange={onChange}
        type={showPassword ? 'text' : 'password'}
        fullWidth
        margin="normal"
        variant="outlined"
        error={!!error}
        helperText={error}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
                className="password-toggle-button"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
      
      {showValidation && value && (
        <Box className="password-validation-box">
          {validationItems.map((item) => (
            <Box key={item.key} className={`password-validation-item ${item.rule ? 'valid' : ''}`}>
              {item.rule ? (
                <CheckCircle className="password-validation-icon valid" sx={{ color: 'green' }} />
              ) : (
                <Cancel className="password-validation-icon" sx={{ color: 'red' }} />
              )}
              <Typography 
                className={`password-validation-text ${item.rule ? 'valid' : 'invalid'}`}
              >
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default PasswordInput; 