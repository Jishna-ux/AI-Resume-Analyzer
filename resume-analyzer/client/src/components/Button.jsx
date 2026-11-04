import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800 disabled:hover:bg-brand-700',
  secondary: 'bg-white text-slate-800 ring-1 ring-inset ring-slate-300 hover:bg-slate-50',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  ghost: 'text-slate-700 hover:bg-slate-100',
};
const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-sm', lg: 'px-6 py-3 text-base' };

// Use `as={Link}` to render a router link that looks like a button.
export default function Button({ as: Component = 'button', variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...props }) {
  const isButton = Component === 'button';
  return (
    <Component
      {...(isButton ? { type: props.type || 'button', disabled: disabled || loading } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Component>
  );
}
