import axios from 'axios';

const api = axios.create({
    baseURL:"http://localhost:3007/",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname !== '/login') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
};

export default api;