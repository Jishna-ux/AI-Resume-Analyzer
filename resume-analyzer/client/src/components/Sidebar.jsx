import { NavLink } from 'react-router-dom';
import { History, LayoutDashboard, LogOut, ShieldCheck, Upload, User, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload resume', icon: Upload },
  { to: '/history', label: 'Analysis history', icon: History },
  { to: '/profile', label: 'Profile', icon: User },
];
const adminLinks = [
  { to: '/admin', label: 'Overview', icon: ShieldCheck, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Sidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const links = user.role === 'admin' ? adminLinks : userLinks;

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center border-b border-slate-200 px-5">
        <Logo to={user.role === 'admin' ? '/admin' : '/dashboard'} />
      </div>
      <nav className="flex-1 space-y-1 p-3" aria-label="Sidebar">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-50 text-brand-800' : 'text-slate-600 hover:bg-slate-100 hover:text-ink'
              }`
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
        <p className="truncate text-xs text-slate-500">{user.email}</p>
        <button
          type="button"
          onClick={logout}
          className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
}
