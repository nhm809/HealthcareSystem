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
     sendOtpReset: (email) => api.post('/sendotp-reset', {email}),
     sendOtpRegister: (email) => api.post('/sendotp-register', {email}),
     login: (data) => api.post('/login', data),
     register: (data) => api.post('/register', data),
     googleLogin: (credential) => api.post('/google-login', { IdToken: credential }),
     refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
     updateUserInfo: (userId, data) => api.put(`/user/update/${userId}`, data, {
          headers: {
               'Content-Type': 'application/json',
          },
     }),
     changePassword: (userId, oldPassword, newPassword) =>
          api.post(
               `/user/change-password/${userId}?newPassword=${encodeURIComponent(newPassword)}`,
               oldPassword,
               {
                    headers: {
                         'Content-Type': 'text/plain'
                    },
                    transformRequest: [(data) => data]
               }
          ),

     bookTestServiceRecord: (data) => 
          api.post('/TestServiceRecord/book/', data),
};
     
export const getInfo = async (userId) => {
     return await api.get(`/user/get/${userId}`)
}

// Request interceptor
api.interceptors.request.use(
     async (config) => {
          const token = Cookies.get('token');
          if (token) {
               config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
     }, 
     (err) => {
          return Promise.reject(err);
     }
);

// Response interceptor
api.interceptors.response.use(
     (response) => response,
     async (error) => {
          const originalRequest = error.config;
          // If error is 401 and we haven't tried to refresh token yet
          if (error.response?.status === 401 && !originalRequest._retry) {
               originalRequest._retry = true;
               try {
                    const refreshToken = Cookies.get('refreshToken');
                    if (!refreshToken) {
                         // No refresh token, logout user
                         localStorage.removeItem('userInfo');
                         Cookies.remove('token');
                         Cookies.remove('refreshToken');
                         return Promise.reject(error);
                    }
                    // Try to refresh token
                    const response = await authApi.refreshToken(refreshToken);
                    const { token, refreshToken: newRefreshToken } = response.data;
                    // Update tokens
                    Cookies.set('token', token);
                    Cookies.set('refreshToken', newRefreshToken);
                    // Update authorization header
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    // Retry the original request
                    return api(originalRequest);
               } catch (refreshError) {
                    // If refresh token fails, logout user
                    localStorage.removeItem('userInfo');
                    Cookies.remove('token');
                    Cookies.remove('refreshToken');
                    return Promise.reject(refreshError);
               }
          }
          return Promise.reject(error);
     }
);

export default api;