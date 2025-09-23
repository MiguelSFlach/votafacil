// frontend/src/services/api.js
import axios from 'axios';

const api = axios.create({
  // MÁGICA: Ele vai usar a variável de ambiente VITE_API_URL quando estiver online na Vercel,
  // ou vai usar 'http://localhost:5000/api' quando você estiver desenvolvendo na sua máquina.
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor para adicionar o token (código existente, sem alterações)
api.interceptors.request.use(
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

export default api;