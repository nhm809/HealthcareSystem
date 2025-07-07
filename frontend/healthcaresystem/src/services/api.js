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
     sendOtpReset: (email) => api.post('/sendotp-reset', { email }),
     sendOtpRegister: (email) => api.post('/sendotp-register', { email }),
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
               `/user/change-password/${userId}`,
               {
                    oldPassword: oldPassword,
                    newPassword: newPassword
               }
          ),

     getTestServiceRecordsByMember: (memberId) => api.get(`/TestServiceRecord/member/${memberId}`),
     getServiceById: (serviceId) => api.get(`/service/${serviceId}`),

     bookTestServiceRecord: (data) =>
          api.post('/TestServiceRecord/book/', data),

     createPaypalUrl: (testServiceRecordId, appointmentId) =>
          api.post(`/Payment/create-paypal-url`, null, {
               params: {
                    testServiceRecordId,
                    appointmentId,
               }
          }),

     getWorkShifts: (date) =>
          api.get(`/TestServiceRecord/work-shifts`, {
               params: { date }
          }),

     getTestServiceRecordDetail: (testServiceRecordId, memberId) =>
          api.get(`/TestServiceRecord/${testServiceRecordId}/${memberId}`),
};

export const notiApi = {
     getNotifications: (userId) => api.get(`/Noti/getNoti/${userId}`, {
          headers: {
               'Authorization': `Bearer ${Cookies.get('token')}`
          }
     }),
     markAsRead: (notiId) => api.put(`/Noti/markAsRead/${notiId}`, {}, {
          headers: {
               'Authorization': `Bearer ${Cookies.get('token')}`
          }
     }),
     createNoti: (data) => api.post('/Noti/createNoti', data, {
          headers: {
               'Authorization': `Bearer ${Cookies.get('token')}`
          }
     }),
};

export const getInfo = async (userId) => {
     return await api.get(`/user/get/${userId}`)
}

export const getTestServiceRecordsByStatus = async () => {
     return await axios.get('/api/TestServiceRecord/status');
};

export const getTestServiceRecordsByStaff = async (staffId) => {
     return await axios.get(`/api/TestServiceRecord/staff/${staffId}`);
};

export const assignTestToStaff = async (testServiceRecordId, staffId) => {
     return await axios.put('/api/TestServiceRecord/select', null, {
          params: { testServiceRecordId, staffId }
     });
};

export const updateTestResult = async (staffId, data) => {
     return await axios.put('/api/TestServiceRecord/update-result', data, {
          params: { staffId }
     });
};

export const questionApi = {
     getAllQuestions: () => api.get('/question/getAll'),
     addQuestion: (data) => api.post('/question/add', data),
     getQuestionById: (questionId) => api.get(`/question/getQuestion/${questionId}`),
     getQuestionsByMember: (memberId) => api.get(`/question/getByMember/${memberId}`),
     getQuestionsByConsultant: (consultantId) => api.get(`/question/getByConsultant/${consultantId}`),
     updateQuestionStatus: (questionId, status) => api.put(`/question/updateStatus/${questionId}`, status, {
          headers: { 'Content-Type': 'application/json' }
     }),
};

export const messageApi = {
     getHistory: (questionId) => api.get(`/message/getHistory/${questionId}`),
     addMessage: (data) => api.post('/message/add', data),
};

export const specialtyApi = {
     getAllSpecialties: () => api.get('/specialty/getAll'),
};

export const consultantBlogApi = {
     createBlog: (data) => api.post('/ConsultantBlog', data),
     getBlogsByConsultant: (consultantId) => api.get(`/ConsultantBlog/consultant/${consultantId}`),
     updateBlog: (data) => api.put('/ConsultantBlog', data),
     getBlogById: (blogID) => api.get(`/blogs/${blogID}`),
     deleteBlog: (blogId, consultantId) => api.delete(`/ConsultantBlog`, { data: { BlogID: blogId, ConsultantId: consultantId } }),
     getDeletedBlogs: (consultantId) => api.get(`/ConsultantBlog/deleted/${consultantId}`),
     restoreBlog: (blogId, consultantId) => api.patch(`/ConsultantBlog/restore`, null, { params: { blogId, consultantId } }),
};

export const cancelTestRecord = (testServiceRecordId, userId) =>
     api.put(`/TestServiceRecord/cancel`, null, { params: { testServiceRecordId, userId } });

export const subQuestionApi = {
     answerSubQuestion: (data) => api.post('/subQuestion/answer', data),
     updateSubQuestion: (threadItemId, data) => api.put(`/subQuestion/update/${threadItemId}`, data),
};

export const manageUserApi = {
     getAllUsers: () => api.get('/manageUser/getAllUsers'),
     getUserById: (userId) => api.get(`/manageUser/getUser/${userId}`),
     updateUserStatus: (userId, isActive) => api.put(`/manageUser/updateStatus/${userId}`, { isActive }),
     updateUserAvailability: (userId, isAvailable) => api.put(`/manageUser/updateAvailability/${userId}`, { isAvailable }),
};

// Request interceptor
api.interceptors.request.use(
     async (config) => {
          const token = Cookies.get('token');
          if (token) {
               config.headers.Authorization = `Bearer ${token}`;
          }
          console.log('Request config:', {
               url: config.url,
               method: config.method,
               headers: config.headers,
               data: config.data,
               token: token ? 'Present' : 'Missing'
          });
          return config;
     },
     (err) => {
          console.error('Request error:', err);
          return Promise.reject(err);
     }
);

// Response interceptor
api.interceptors.response.use(
     (response) => {
          console.log('Response:', {
               url: response.config.url,
               status: response.status,
               data: response.data
          });
          return response;
     },
     async (error) => {
          console.error('Response error:', {
               url: error.config?.url,
               status: error.response?.status,
               data: error.response?.data,
               message: error.message,
               token: Cookies.get('token') ? 'Present' : 'Missing'
          });
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