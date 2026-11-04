import { useId } from 'react';

export default function FormField({ label, hint, className = '', ...inputProps }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      <input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-ink shadow-sm placeholder:text-slate-400 read-only:bg-slate-50 read-only:text-slate-500"
        {...inputProps}
      />
      {hint && <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
