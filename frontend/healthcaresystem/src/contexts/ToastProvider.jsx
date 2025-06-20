import { createContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {

  const value = {
    toast
  }

  return (

    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};