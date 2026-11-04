import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ label = 'Loading...', fullScreen = false }) {
  return (
    <div role="status" className={`flex items-center justify-center gap-3 text-slate-500 ${fullScreen ? 'min-h-screen' : 'py-16'}`}>
      <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
