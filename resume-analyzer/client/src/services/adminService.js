import api from './api';

export const fetchStatistics = () => api.get('/admin/statistics').then((res) => res.data.statistics);
export const fetchUsers = (params) => api.get('/admin/users', { params }).then((res) => res.data);
export const setUserStatus = (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }).then((res) => res.data.user);
