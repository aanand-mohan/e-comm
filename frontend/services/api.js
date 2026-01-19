import axios from 'axios';

const api = axios.create({
    baseURL: 'https://e-comm-8ozk.onrender.com'
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                const { token } = JSON.parse(userInfo);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
