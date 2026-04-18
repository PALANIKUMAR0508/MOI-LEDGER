import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import AppLayout from '../components/AppLayout';
import { API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Category-appropriate images
const CATEGORY_IMAGES = {
  marriage:     'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  engagement:   'https://images.unsplash.com/photo-1543269664-56d93c1b41a6?w=600&q=80',
  reception:    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  nalangu:      'https://images.unsplash.com/photo-1561049501-e1f96bdd98fd?w=600&q=80',
  valaikappu:   'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=600&q=80',
  naming:       'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&q=80',
  earPiercing:  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  birthday1st:  'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
  birthday:     'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80',
  puberty:      'https://images.unsplash.com/photo-1561049501-e1f96bdd98fd?w=600&q=80',
  sathabhisekam:'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  bheemaRatha:  'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
  achievement:  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80',
  houseWarming: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80',
  shopOpening:  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
  templeEvent:  'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80',
  other:        'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80',
};

function getCategoryImage(category) {
  return CATEGORY_IMAGES[category] || CATEGORY_IMAGES.other;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLang();
  const [functions, setFunctions] = useState([]);
  const [stats, setStats] = useState({ totalFunctions: 0, totalContributions: 0, totalGuests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [fnRes, statsRes] = await Promise.all([
          axios.get(`${API_URL}/functions`),
          axios.get(`${API_URL}/functions/stats/overview`),
        ]);
        setFunctions(fnRes.data);
        setStats(statsRes.data);
      } catch { toast.error('Could not load dashboard'); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const fmt = (n) => n >= 1000000 ? `₹${(n/1000000).toFixed(1)}M` : n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n}`;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-12">
        {/* Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 mb-16 md:mb-20 items-end">
          <div className="lg:col-span-8">
            <h2 className="font-headline text-xs font-bold text-secondary tracking-[0.4em] uppercase mb-3 md:mb-4">{t.executiveOverview}</h2>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-primary leading-[1.1]">
              {t.preservingLegacy} <span className="italic font-display text-secondary">{t.legacyItalic}</span> {t.ofGiving}
            </h1>
          </div>
          <div className="lg:col-span-4 lg:border-l lg:border-outline-variant/30 lg:pl-10">
            <p className="text-on-surface-variant text-sm leading-relaxed mb-6 font-body">
              {t.welcomeBack} <strong className="text-primary">{user?.username}</strong>. {t.ledgerUpToDate}
            </p>
            <Link to="/functions/new" className="gold-gradient text-primary px-7 py-3.5 font-label font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:brightness-110 transition-all shadow-md w-fit">
              <span className="material-symbols-outlined text-sm">add_circle</span>{t.addNewFunction}
            </Link>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-8 mb-16">
          {/* CTA Card */}
          <div className="md:col-span-2 lg:col-span-3 bg-primary p-8 md:p-10 flex flex-col justify-between min-h-[300px] relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 opacity-5 group-hover:scale-110 transition-transform duration-1000">
              <span className="material-symbols-outlined text-white" style={{fontSize:'28rem'}}>auto_stories</span>
            </div>
            <div className="z-10">
              <span className="border border-secondary/40 text-secondary text-[10px] font-label font-bold px-4 py-1.5 uppercase tracking-[0.3em]">{t.actionCenter}</span>
              <h3 className="text-white font-headline text-3xl md:text-4xl mt-8 font-bold leading-tight">{t.initializeNewCeremony} <br/>{t.newCeremony}</h3>
            </div>
            <div className="z-10">
              <p className="text-white/60 mb-6 max-w-xs text-xs leading-relaxed font-label">{t.createDedicatedSpace}</p>
              <Link to="/functions/new" className="bg-secondary text-primary px-7 py-3 font-label font-bold text-[10px] uppercase tracking-widest inline-flex items-center gap-2 hover:bg-accent transition-all">
                {t.createNewFunction}<span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
          {/* Stats */}
          {[
            { icon: 'account_balance_wallet', label: t.totalLedger, value: loading ? '...' : fmt(stats.totalContributions) },
            { icon: 'diversity_3', label: t.contributors, value: loading ? '...' : stats.totalGuests.toLocaleString() },
            { icon: 'event_available', label: t.functions, value: loading ? '...' : stats.totalFunctions },
          ].map(({ icon, label, value }) => (
            <div key={label} className="md:col-span-2 lg:col-span-1 bg-surface-variant p-8 border border-outline-variant/30 flex flex-col justify-between group hover:border-secondary transition-all duration-300">
              <span className="material-symbols-outlined text-secondary text-2xl">{icon}</span>
              <div>
                <p className="text-on-surface-variant text-[10px] font-label font-bold uppercase tracking-[0.2em] mb-1">{label}</p>
                <p className="font-display text-2xl md:text-3xl font-bold text-primary">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Saved Functions */}
        <div className="flex justify-between items-end mb-8 pb-4 border-b border-outline-variant/30">
          <div>
            <h2 className="font-headline text-xl md:text-2xl font-bold text-primary tracking-widest">{t.savedFunctions}</h2>
            <p className="text-on-surface-variant text-xs mt-1 uppercase tracking-widest font-label">{t.reviewRecords}</p>
          </div>
          <Link to="/functions" className="text-secondary font-label font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:text-primary transition-colors">
            {t.viewAll}<span className="material-symbols-outlined text-sm">open_in_new</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {functions.slice(0, 4).map(fn => (
            <div key={fn._id} className="bg-surface-variant border border-outline-variant/20 group hover:border-secondary/50 transition-all duration-500 overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-2/5 h-44 sm:h-auto overflow-hidden">
                <img
                  src={getCategoryImage(fn.category)}
                  alt={fn.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.2] group-hover:grayscale-0"
                />
              </div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-label font-bold text-on-surface-variant uppercase tracking-widest">
                      {new Date(fn.date).toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})}
                    </span>
                    <span className={`border text-[8px] font-label font-bold px-2 py-0.5 uppercase tracking-widest ${fn.status==='archived' ? 'border-secondary text-secondary' : 'border-green-500 text-green-600'}`}>
                      {fn.status}
                    </span>
                  </div>
                  <h4 className="font-display text-xl font-bold text-primary mb-4 leading-tight">{fn.name}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] text-on-surface-variant uppercase font-label font-bold tracking-widest mb-1">{t.contributions}</p>
                      <p className="font-bold text-primary font-display text-lg">{fmt(fn.totalContributions)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-on-surface-variant uppercase font-label font-bold tracking-widest mb-1">{t.guests}</p>
                      <p className="font-bold text-primary font-display text-lg">{fn.guestCount}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex gap-3">
                  <Link to={`/contributions/${fn._id}`} className="flex-1 border border-primary text-primary text-[10px] font-label font-bold uppercase tracking-widest py-2.5 hover:bg-primary hover:text-white transition-all text-center">
                    {t.viewDetails}
                  </Link>
                  <Link to={`/reports?fn=${fn._id}`} className="px-3 border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary transition-all flex items-center">
                    <span className="material-symbols-outlined text-lg">share</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <Link to="/functions/new" className="bg-surface border-2 border-dashed border-outline-variant/50 flex flex-col items-center justify-center p-10 text-center group hover:border-secondary transition-all min-h-[200px]">
            <div className="w-14 h-14 rounded-full border border-outline-variant/30 flex items-center justify-center mb-5 text-outline-variant group-hover:text-secondary group-hover:border-secondary transition-all">
              <span className="material-symbols-outlined text-3xl">note_add</span>
            </div>
            <h4 className="font-headline text-primary font-bold tracking-widest text-sm">{t.newFunctionCard}</h4>
            <p className="text-[10px] text-on-surface-variant mt-2 max-w-[200px] uppercase tracking-widest leading-loose font-label">{t.startNewRecord}</p>
            <span className="mt-6 text-secondary text-[10px] font-label font-bold uppercase tracking-[0.3em] border-b border-secondary hover:text-primary hover:border-primary transition-all">{t.createRecord}</span>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
}
