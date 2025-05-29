import axios from 'axios';

const api = axios.create(
     {
          baseURL: 'http://localhost:5000/api',
          headers: {
               'Content-Type': 'application/json',
          },
     }
);

export const authApi = {
     sendOtp: (email) => api.post('/auth/send-otp', {email}),
     login: (data) => api.post('/auth/login', data),
     register: (data) => api.post('/auth/register', data),
};

export default api;