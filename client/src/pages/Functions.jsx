import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import AppLayout from '../components/AppLayout';
import { API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';

const CATEGORY_IMAGES = {
  marriage:     'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  engagement:   'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&q=80',
  reception:    'https://images.unsplash.com/photo-1519167758481-83f29da8c2b0?w=600&q=80',
  nalangu:      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&q=80',
  valaikappu:   'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=600&q=80',
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

const CATEGORY_ICONS = {
  marriage:'favorite', engagement:'diamond', reception:'celebration', nalangu:'spa',
  valaikappu:'pregnant_woman', naming:'child_care', earPiercing:'face',
  birthday1st:'cake', birthday:'cake', puberty:'female', sathabhisekam:'hotel_class',
  bheemaRatha:'elderly', achievement:'emoji_events', houseWarming:'home',
  shopOpening:'store', templeEvent:'temple_hindu', other:'category',
};

export default function Functions() {
  const { t } = useLang();
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const FILTER_GROUPS = [
    { label: t.all, value: 'all' },
    { label: t.marriage, value: 'marriage' }, { label: t.engagement, value: 'engagement' },
    { label: t.birthday, value: 'birthday' }, { label: t.house, value: 'houseWarming' },
    { label: t.active, value: 'active' }, { label: t.archived, value: 'archived' },
  ];

  const load = async () => {
    try {
      const res = await axios.get(`${API_URL}/functions`);
      setFunctions(res.data);
    } catch { toast.error('Failed to load functions'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this function and all its contributions?')) return;
    try { await axios.delete(`${API_URL}/functions/${id}`); toast.success('Function removed.'); load(); }
    catch { toast.error('Could not delete'); }
  };

  const filtered = filter === 'all' ? functions
    : functions.filter(f => f.category === filter || f.status === filter);

  const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : `₹${n.toLocaleString('en-IN')}`;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.4em] text-secondary mb-2 font-bold">{t.archive}</p>
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary tracking-widest uppercase">{t.allFunctions}</h1>
            <p className="font-serif text-on-surface-variant italic mt-2">{t.completeRecord}</p>
          </div>
          <Link to="/functions/new" className="gold-gradient text-primary px-7 py-3.5 font-label font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:brightness-110 transition-all shadow-md w-fit">
            <span className="material-symbols-outlined text-sm">add</span>{t.newFunction}
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTER_GROUPS.map(f => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              className={`px-4 py-2 font-label text-[10px] font-bold uppercase tracking-widest border transition-all ${filter === f.value ? 'bg-primary text-white border-primary' : 'bg-white text-on-surface-variant border-outline-variant hover:border-secondary hover:text-secondary'}`}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="font-headline text-primary tracking-widest text-sm animate-pulse uppercase">{t.loadingArchives}</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-6">auto_stories</span>
            <h2 className="font-headline text-xl font-bold text-primary tracking-widest uppercase mb-3">{t.noFunctionsFound}</h2>
            <p className="font-serif text-on-surface-variant italic mb-8">{t.beginJourney}</p>
            <Link to="/functions/new" className="bg-primary text-white px-10 py-4 font-label font-bold text-[10px] uppercase tracking-widest hover:bg-primary-light transition-all">{t.createFirstFunction}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
            {filtered.map(fn => (
              <div key={fn._id} className="bg-white border border-outline-variant/30 group hover:border-secondary/50 transition-all duration-300 ambient-shadow flex flex-col overflow-hidden">
                {/* Image */}
                <div className="h-40 overflow-hidden relative">
                  <img src={CATEGORY_IMAGES[fn.category] || CATEGORY_IMAGES.other} alt={fn.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale-[0.2] group-hover:grayscale-0"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"/>
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-white/80 text-sm">{CATEGORY_ICONS[fn.category] || 'celebration'}</span>
                    <span className="font-label text-[9px] uppercase tracking-widest text-white/70 font-bold">{fn.category}</span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`text-[8px] font-label font-bold px-2 py-0.5 uppercase tracking-widest border ${fn.status === 'archived' ? 'border-secondary bg-black/40 text-secondary' : 'border-green-400 bg-black/40 text-green-300'}`}>
                      {fn.status}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mb-2">
                    {new Date(fn.date).toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'})}
                  </p>
                  <h3 className="font-display text-xl font-bold text-primary mb-1 leading-tight">{fn.name}</h3>
                  {fn.venue && <p className="font-serif text-sm text-on-surface-variant italic mb-3">{fn.venue}</p>}

                  <div className="grid grid-cols-2 gap-4 mt-auto pt-4 border-t border-outline-variant/10">
                    <div>
                      <p className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest mb-0.5">{t.contributions}</p>
                      <p className="font-display font-bold text-primary text-lg">{fmt(fn.totalContributions)}</p>
                    </div>
                    <div>
                      <p className="font-label text-[9px] text-on-surface-variant uppercase tracking-widest mb-0.5">{t.guests}</p>
                      <p className="font-display font-bold text-primary text-lg">{fn.guestCount}</p>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 flex gap-2">
                  <Link to={`/contributions/${fn._id}`}
                    className="flex-1 border border-primary text-primary text-[10px] font-label font-bold uppercase tracking-widest py-2.5 hover:bg-primary hover:text-white transition-all text-center">
                    {t.openLedger}
                  </Link>
                  <Link to={`/reports?fn=${fn._id}`}
                    className="px-3 border border-outline-variant/30 text-on-surface-variant hover:text-secondary hover:border-secondary transition-all flex items-center" title="Report">
                    <span className="material-symbols-outlined text-lg">description</span>
                  </Link>
                  <button onClick={() => handleDelete(fn._id)}
                    className="px-3 border border-outline-variant/30 text-on-surface-variant hover:text-error hover:border-error transition-all flex items-center" title="Delete">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
