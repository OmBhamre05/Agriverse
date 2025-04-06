import axios from 'axios';
import { toast } from 'sonner';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 30000,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
