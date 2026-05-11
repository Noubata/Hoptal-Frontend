import axios from 'axios';

const api = axios.create({
  baseURL: 'https://hoptal-dpi.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('hoptal_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log("401 on URL:", error.config.url);
      console.log("Token at time of request:", localStorage.getItem('hoptal_token'));
      // comment out the logout for now:
      // localStorage.clear();
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;