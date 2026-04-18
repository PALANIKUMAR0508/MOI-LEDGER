import { Link, useLocation } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppLayout({ children }) {
  const { pathname } = useLocation();
  const { t } = useLang();
  
  const mobileNav = [
    { path: '/dashboard', icon: 'home', label: t.dashboard },
    { path: '/functions', icon: 'history_edu', label: t.functions },
    { path: '/contributions', icon: 'volunteer_activism', label: t.contributions },
    { path: '/reports', icon: 'description', label: t.reports },
    { path: '/profile', icon: 'person', label: t.profile },
  ];
  
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <TopBar />
        <main className="flex-grow page-enter pb-20 lg:pb-0">{children}</main>
        <footer className="hidden lg:block border-t border-outline-variant/30 py-6 px-8 bg-surface-variant/40">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50">© 2026 MOI The Grand Ledger. All rights reserved.</p>
            <Link to="/legal" className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant/30 hover:text-secondary transition-colors">Legal & Copyright</Link>
          </div>
        </footer>
      </div>
      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-primary border-t border-white/10 z-50">
        <div className="flex items-center justify-around px-1 py-1.5">
          {mobileNav.map(({ path, icon, label }) => {
            const active = pathname === path || pathname.startsWith(path + '/');
            return (
              <Link key={path} to={path}
                className={`flex flex-col items-center gap-0.5 px-2 py-1 flex-1 transition-colors ${active ? 'text-secondary' : 'text-white/50 hover:text-white'}`}>
                <span className="material-symbols-outlined text-xl">{icon}</span>
                <span className="font-label text-[8px] uppercase tracking-wider">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
