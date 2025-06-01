import React from 'react';
import { TextField } from '@mui/material';

function FormInput({ label, value, onChange, type = 'text', error, ...props }) {
  return (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
      type={type}
      fullWidth
      margin="normal"
      variant="outlined"
      error={!!error}
      helperText={error}
      {...props}
    />
  );
}

export default FormInput;