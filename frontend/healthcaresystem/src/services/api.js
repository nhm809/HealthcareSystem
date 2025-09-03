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

     // OTP for registration
     sendOtpRegisterVerify: (userId) => api.post(`/otp/sendOtpByUserId/${userId}`),
     verifyOtpRegister: (userId, code) => api.post('/otp/verify', { UserId: userId, Code: code }),
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
     return await api.put('/TestServiceRecord/update-result', data, {
          params: { staffId }
     });
};

export const adminApi = {
     getUserStats: () => api.get('/manageUser/countUsers'),
     getRecentUsers: () => api.get('/manageUser/getTenLatestUsers'),
     setUserStatus: (userId, isAvailable) =>
          api.put(`/manageUser/setStatusUser/${userId}/${isAvailable}`),
     getUsersPerPage: (page, pageSize, search, role, isAvailable) =>
          api.get(`/manageUser/loadUserPerPage/${page}/${pageSize}`, {
               params: { search, role, isAvailable },
          }),
     getPageCount: (pageSize, search, role, isAvailable) =>
          api.get(`/manageUser/countPage`, {
          params: { pageSize, search, role, isAvailable },
          }),
     getUserDetail: (userId) =>
          api.get(`/user/get/${userId}`),
     updateUser: (data) => api.put('/manageUser/updateUser', data),
};

export const dashboardApi = {
     getRevenue: (data) => api.post('/Dashboard/revenue', data),
};

export const invoiceApi = {
     searchByDate: (data) => api.post('/Invoice/search-by-date', data),
};

export const feedbackApi = {
     getServiceSummary: () => api.get('/feedback/service-summary'),
     getFeedbacksByService: (serviceId, pageNumber = 1, pageSize = 10) =>
         api.get(`/feedback/service/${serviceId}`, { params: { pageNumber, pageSize } }),
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
     updateHeart: (questionId, memberId, heart) => api.post('/question/updateHeart', { questionId, memberId, heart }),
};

export const messageApi = {
     getHistory: (questionId) => api.get(`/message/getHistory/${questionId}`),
     addMessage: (data) => api.post('/message/add', data),
};

export const specialtyApi = {
     getAllSpecialties: () => api.get('/specialty/getAll'),
     getSpecialtyById: (id) => api.get(`/specialty/getById/${id}`),
     getSpecialtiesByUserId: (userId) => api.get(`/specialty/getByUserID/${userId}`),
     updateSpecialty: (data) => api.put('/specialty/update', data),
     createSpecialty: (data) => api.post('/specialty/create', data),
     deleteSpecialty: (id) => api.delete(`/specialty/delete/${id}`),
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
     getSubQuestions: (questionId) => api.get(`/subQuestion/getByQuestionId/${questionId}`),
     addSubQuestion: (data) => api.post('/subQuestion/add', data),
     answerSubQuestion: (data) => api.post('/subQuestion/answer', data),
     updateSubQuestion: (threadItemId, data) => api.put(`/subQuestion/update/${threadItemId}`, data),
};

export const manageUserApi = {
     getAllUsers: () => api.get('/manageUser/getAllUsers'),
     getUserById: (userId) => api.get(`/manageUser/getUser/${userId}`),
     updateUserStatus: (userId, isActive) => api.put(`/manageUser/updateStatus/${userId}`, { isActive }),
     updateUserAvailability: (userId, isAvailable) => api.put(`/manageUser/updateAvailability/${userId}`, { isAvailable }),
     updateUserRole: (userId, roleId) => api.put('/manageUser/updateUser', { userId, roleId }),
     updateUserAvailabilityToggle: (userId, isAvailable) => api.put('/manageUser/updateUser', { userId, isAvailable }),
     addSpecialty: (userId, specialtyId) => api.post('/manageUser/addSpecialty', { userId, specialtyId }),
     deleteSpecialty: (userId, specialtyId) => api.delete('/manageUser/deleteSpecialty', { data: { userId, specialtyId } }),
     getUserSchedule: (userId) => api.get(`/WeeklySchedule/user/${userId}`),
     addWorkSchedule: (data) => api.post('/WeeklySchedule', data),
     deleteWorkSchedule: (weeklyScheduleId) => api.delete(`/WeeklySchedule/${weeklyScheduleId}`),
};

export const getWeeklySchedule = (userId, offset = 0) =>
     api.get(`/schedule/week/${userId}`, { params: { offset } });

export const weeklyOverrideScheduleApi = {
     createOverrideSchedule: (data) => api.post('/WeeklyOverrideSchedule', data),
     getOverrideSchedules: (params) => api.get('/WeeklyOverrideSchedule', { params }),
     updateOverrideStatus: (data) => api.put('/WeeklyOverrideSchedule/status', data),
     deleteOverrideSchedule: (id) => api.delete(`/WeeklyOverrideSchedule/${id}`),
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

export const deleteService = (serviceId) => api.delete(`/Service/${serviceId}`);

// Chatbot API Service
export const chatbotApi = {
     sendMessage: async (message, conversationId = null) => {
          const formData = new FormData();
          formData.append("query", message);
          formData.append("bot_id", "ccb891955c7ea686cc5c639b");
          if (conversationId) {
               formData.append("conversation_id", conversationId);
          }
          formData.append("model_name", "gemini-2.5-flash-preview-05-20");
          formData.append("api_key", "AIzaSyBYV6lbfpPQCNEtoea79n0JPqIXchg66rg");
          // Do NOT append 'attachs' if there are no files

          try {
               const response = await fetch('https://ai.ftes.vn/api/ai/rag_agent_template/stream', {
                    method: 'POST',
                    headers: {
                         'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NzYxMjEyZmNkYzNhMTkxNzM4MDliNCJ9.y3FIXE0_aGPlT_mpRRsHgYHyQGTC0rOFKW1kRc9s4sk'
                    },
                    body: formData
               });

               if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
               }

               return response;
          } catch (error) {
               console.error('Chatbot API error:', error);
               throw error;
          }
     },

     // Parse streaming response
     parseStreamingResponse: async function* (response) {
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          try {
               while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    
                    // Keep the last incomplete line in buffer
                    buffer = lines.pop() || '';

                    for (const line of lines) {
                         if (line.trim()) {
                              try {
                                   const data = JSON.parse(line.trim());
                                   yield data;
                              } catch (e) {
                                   console.warn('Failed to parse line:', line, e);
                              }
                         }
                    }
               }

               // Process any remaining data in buffer
               if (buffer.trim()) {
                    try {
                         const data = JSON.parse(buffer.trim());
                         yield data;
                    } catch (e) {
                         console.warn('Failed to parse final buffer:', buffer, e);
                    }
               }
          } finally {
               reader?.releaseLock();
          }
     }
};

export default api;
