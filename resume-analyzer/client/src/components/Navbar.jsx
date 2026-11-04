import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { homeFor } from './ProtectedRoute';
import Button from './Button';
import Logo from './Logo';

export default function Navbar() {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Logo />
        <div className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <a href="#how-it-works" className="hover:text-ink">How it works</a>
          <a href="#features" className="hover:text-ink">Features</a>
          <a href="#categories" className="hover:text-ink">Categories</a>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <Button as={Link} to={homeFor(user)} size="sm">Go to dashboard</Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" size="sm">Log in</Button>
              <Button as={Link} to="/register" size="sm">Sign up</Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
