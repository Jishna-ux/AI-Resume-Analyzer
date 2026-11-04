export const formatDate = (value, withTime = false) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  });

// Class names are written out in full so Tailwind can detect them.
export function scoreTone(score) {
  if (score >= 80) return { label: 'Strong', text: 'text-emerald-700', bar: 'bg-emerald-600', stroke: '#059669', badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200' };
  if (score >= 65) return { label: 'Good', text: 'text-brand-700', bar: 'bg-brand-600', stroke: '#0f8a7e', badge: 'bg-brand-50 text-brand-800 ring-brand-100' };
  if (score >= 50) return { label: 'Needs work', text: 'text-amber-700', bar: 'bg-amber-500', stroke: '#d97706', badge: 'bg-amber-50 text-amber-800 ring-amber-200' };
  return { label: 'Needs major work', text: 'text-rose-700', bar: 'bg-rose-600', stroke: '#e11d48', badge: 'bg-rose-50 text-rose-800 ring-rose-200' };
}

export function getErrorMessage(error) {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === 'ECONNABORTED') return 'The request took too long. Please try again.';
  if (error?.request) return 'Cannot reach the server. Check your internet connection and that the backend is running.';
  return error?.message || 'Something went wrong. Please try again.';
}

export const formatFileSize = (bytes) => (bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);
