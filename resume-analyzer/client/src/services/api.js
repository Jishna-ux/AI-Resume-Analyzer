import axios from 'axios';

const TOKEN_KEY = 'resumelens_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 30000 });

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// An expired or invalid token on a protected call logs the user out (login attempts are excluded).
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthAttempt = /\/auth\/(login|register)/.test(error.config?.url || '');
    if (error.response?.status === 401 && !isAuthAttempt && tokenStore.get()) {
      tokenStore.clear();
      window.dispatchEvent(new Event('auth:expired'));
    }
    return Promise.reject(error);
  }
);

export default api;
