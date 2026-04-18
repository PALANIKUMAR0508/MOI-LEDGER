import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const { lang, toggle, t } = useLang();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { path: '/dashboard', icon: 'home', label: t.dashboard },
    { path: '/functions', icon: 'history_edu', label: t.functions },
    { path: '/contributions', icon: 'volunteer_activism', label: t.contributions },
    { path: '/reports', icon: 'description', label: t.reports },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-primary text-surface border-r border-white/10 sticky top-0 h-screen z-50 shrink-0">
      {/* Logo */}
      <div className="p-8 border-b border-white/10">
        <Link to="/dashboard" className="font-headline text-xl font-bold tracking-[0.2em] text-secondary block">MOI LEDGER</Link>
        <p className="text-white/30 text-[9px] uppercase tracking-[0.3em] mt-1 font-label">The Grand Ledger</p>
      </div>

      {/* Nav */}
      <nav className="flex-grow py-8 px-4 flex flex-col gap-1">
        {navItems.map(({ path, icon, label }) => {
          const active = pathname === path || pathname.startsWith(path + '/');
          return (
            <Link key={path} to={path}
              className={`flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all duration-200 ${active ? 'bg-secondary text-primary' : 'text-white/60 hover:text-white hover:bg-white/5'}`}>
              <span className="material-symbols-outlined text-lg">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-5 border-t border-white/10">
        <Link to="/profile" className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity group">
          <div className="w-9 h-9 rounded-full bg-secondary/20 border border-secondary/50 flex items-center justify-center shrink-0 group-hover:border-secondary transition-colors">
            <span className="material-symbols-outlined text-secondary text-base">person</span>
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary">{user?.username || 'Archivist'}</p>
            <p className="text-[9px] text-white/40 truncate max-w-[120px]">{user?.email}</p>
          </div>
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-white/40 hover:text-error text-[10px] uppercase tracking-widest transition-colors">
          <span className="material-symbols-outlined text-sm">logout</span>Sign Out
        </button>
      </div>
    </aside>
  );
}
