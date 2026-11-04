import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export default function Logo({ to = '/' }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 font-bold text-ink">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 text-white">
        <FileText className="h-4 w-4" aria-hidden="true" />
      </span>
      ResumeLens
    </Link>
  );
}
