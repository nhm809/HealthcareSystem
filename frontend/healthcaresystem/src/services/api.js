import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create(
     {
          baseURL: 'http://localhost:5011/api',
          timeout: 10000,
          headers: {
               'Content-Type': 'application/json',
          },
     }
);

export const authApi = {
     sendOtp: (email) => api.post('/auth/send-otp', {email}),
     login: (data) => api.post('/login', data),
     register: (data) => api.post('/register', data),
};

api.interceptors.request.use(
     async (config) => {
     console.log(config);

     const token = Cookies.get('token');

     if (token) {
          config.headers.Authorization = `Bearer ${token}`;
     }

     return config;

     }, 
     (err) => {
     return Promise.reject(err);
})

export default api;