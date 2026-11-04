import api from './api';

export const registerUser = (data) => api.post('/auth/register', data).then((res) => res.data);
export const loginUser = (data) => api.post('/auth/login', data).then((res) => res.data);
export const fetchCurrentUser = () => api.get('/auth/me').then((res) => res.data.user);
export const updateProfile = (data) => api.put('/users/profile', data).then((res) => res.data);
