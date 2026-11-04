import api from './api';

// Upload + AI analysis can be slow, so these calls get a longer timeout than the default.
export const uploadResume = (file, onProgress) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api
    .post('/resumes/upload', formData, {
      timeout: 120000,
      onUploadProgress: (event) => event.total && onProgress?.(Math.round((event.loaded / event.total) * 100)),
    })
    .then((res) => res.data.resume);
};

export const requestAnalysis = (resumeId) => api.post(`/analysis/${resumeId}`, null, { timeout: 120000 }).then((res) => res.data.analysis);
export const fetchAnalysis = (id) => api.get(`/analysis/${id}`).then((res) => res.data.analysis);
export const fetchHistory = () => api.get('/analysis/history').then((res) => res.data.analyses);
export const deleteAnalysis = (id) => api.delete(`/analysis/${id}`).then((res) => res.data);
