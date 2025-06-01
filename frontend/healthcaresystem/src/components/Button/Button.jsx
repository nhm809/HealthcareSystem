import React from "react";
import { Button as MuiButton } from '@mui/material';

function Button({ children, onClick, variant = 'contained', ...props }) {
     return (
          <MuiButton variant={variant} onClick={onClick} fullWidth style={{ marginTop: '10px'}} {...props}>
               {children}
          </MuiButton>
     );
}

export default Button;