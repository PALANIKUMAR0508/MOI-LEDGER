import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

export default function TopBar() {
  const [search, setSearch] = useState('');
  const { lang, toggle, t } = useLang();
  return (
    <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant/50 sticky top-0 z-40">
      <div className="flex justify-between items-center px-6 md:px-8 py-4 gap-4">
        <div className="lg:hidden font-headline text-lg font-bold text-primary tracking-widest">MOI</div>
        <div className="hidden md:flex flex-grow max-w-md">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t.searchArchives}
              className="w-full pl-9 pr-4 py-2 bg-surface-variant/60 border border-outline-variant/40 text-xs font-label focus:border-secondary focus:ring-0 text-on-surface placeholder:text-on-surface-variant/40 transition-colors"/>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Language Toggle - Mobile & Desktop */}
          <div className="flex items-center border border-outline-variant overflow-hidden">
            <button 
              onClick={() => toggle('en')} 
              className={`px-2 py-1 text-[9px] font-bold transition-all ${lang==='en' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-variant'}`}
            >
              EN
            </button>
            <button 
              onClick={() => toggle('ta')} 
              className={`px-2 py-1 text-[9px] font-bold transition-all ${lang==='ta' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-variant'}`}
            >
              TA
            </button>
          </div>
          <button className="p-2 text-on-surface-variant hover:text-secondary transition-colors">
            <span className="material-symbols-outlined text-xl">notifications</span>
          </button>
          <div className="h-6 w-px bg-outline-variant mx-1 hidden sm:block"/>
          <Link to="/functions/new" className="gold-gradient text-primary px-4 py-2 text-[10px] font-label font-bold uppercase tracking-widest flex items-center gap-1.5 hover:brightness-110 transition-all shadow-sm">
            <span className="material-symbols-outlined text-sm">add</span>
            <span className="hidden sm:inline">{t.newFunction}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
