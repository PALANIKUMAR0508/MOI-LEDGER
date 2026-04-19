import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AppLayout from '../components/AppLayout';
import { API_URL } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { transliterateToTamil, debounce } from '../utils/transliterate';
import toast from 'react-hot-toast';

const GOLD_TYPES = ['மோதிரம் (Ring)','வளையல் (Bangles)','தாலி (Chain)','கொலுசு (Anklet)','ஜிமிக்கி (Earring)','நகை செட் (Set)','தங்கக் காசு (Coin)','மூக்குத்தி (Nose ring)','Other Gold'];
const GIFT_TYPES_LIST = ['Silk Saree / பட்டுப்புடவை','Cash Envelope / பணத்தட்டு','Household Items','Electronics','Clothing / ஆடை','Sweets / இனிப்பு','Fruits & Flowers','Other Gift'];

function GiftTypeForm({ form, setForm }) {
  const t = form.giftType;
  return (
    <>
      {t === 'cash' && (
        <div>
          <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Amount (₹) *</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-base">currency_rupee</span>
            <input type="number" min="1" value={form.amount} onChange={e => setForm(f=>({...f, amount: e.target.value}))}
              placeholder="Enter amount" required
              className="w-full pl-9 pr-4 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
          </div>
        </div>
      )}
      {t === 'gold' && (
        <>
          <div>
            <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Gold Item Type *</label>
            <select 
              value={form.giftDescription} 
              onChange={e => setForm(f=>({...f, giftDescription: e.target.value}))}
              required
              className="w-full px-3 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors">
              <option value="">— Select Gold Type —</option>
              {GOLD_TYPES.map(gt => (
                <option key={gt} value={gt}>{gt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Estimated Value (₹)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-base">currency_rupee</span>
              <input type="number" min="0" value={form.amount} onChange={e => setForm(f=>({...f, amount: e.target.value}))}
                placeholder="Estimated value (optional)"
                className="w-full pl-9 pr-4 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
            </div>
          </div>
        </>
      )}
      {t === 'gift' && (
        <>
          <div>
            <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Gift Name / Type *</label>
            <select 
              value={GIFT_TYPES_LIST.includes(form.giftDescription) ? form.giftDescription : 'custom'} 
              onChange={e => {
                if (e.target.value !== 'custom') {
                  setForm(f=>({...f, giftDescription: e.target.value}));
                } else {
                  setForm(f=>({...f, giftDescription: ''}));
                }
              }}
              required={!form.giftDescription}
              className="w-full px-3 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors mb-3">
              <option value="">— Select Gift Type —</option>
              {GIFT_TYPES_LIST.map(gt => (
                <option key={gt} value={gt}>{gt}</option>
              ))}
              <option value="custom">— Custom / Other —</option>
            </select>
            {(!GIFT_TYPES_LIST.includes(form.giftDescription) || form.giftDescription === '') && (
              <input 
                value={form.giftDescription} 
                onChange={e => setForm(f=>({...f, giftDescription: e.target.value}))}
                placeholder="Type custom gift name..."
                required
                className="w-full px-3 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
            )}
          </div>
          <div>
            <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Estimated Value (₹)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-base">currency_rupee</span>
              <input type="number" min="0" value={form.amount} onChange={e => setForm(f=>({...f, amount: e.target.value}))} placeholder="Estimated value (optional)"
                className="w-full pl-9 pr-4 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
            </div>
          </div>
        </>
      )}
      {t === 'other' && (
        <>
          <div>
            <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Describe the Contribution *</label>
            <input value={form.giftDescription} onChange={e => setForm(f=>({...f, giftDescription: e.target.value}))}
              placeholder="e.g. Blessing, Prayers, Food arrangements..." required
              className="w-full px-3 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
          </div>
          <div>
            <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Amount (₹) if applicable</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-base">currency_rupee</span>
              <input type="number" min="0" value={form.amount} onChange={e => setForm(f=>({...f, amount: e.target.value}))} placeholder="0"
                className="w-full pl-9 pr-4 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
            </div>
          </div>
        </>
      )}
    </>
  );
}

const EMPTY_FORM = { guestName:'', guestNameTamil:'', guestNameEnglish:'', village:'', villageTamil:'', guestRelation:'', relationTamil:'', amount:'', giftType:'cash', giftDescription:'', notes:'' };
const GIFT_ICON = { cash:'payments', gold:'diamond', gift:'card_giftcard', other:'category' };
const GIFT_LABEL = { cash:'Cash', gold:'Gold', gift:'Gift', other:'Other' };

export default function EntryWorkspace() {
  const { id } = useParams();
  const { lang, t } = useLang();
  const [fn, setFn] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);

  // Debounced transliteration function
  const debouncedTransliterate = useCallback(
    debounce(async (englishText) => {
      if (englishText.trim()) {
        const tamilText = await transliterateToTamil(englishText);
        setForm(f => ({ ...f, guestNameTamil: tamilText }));
      } else {
        setForm(f => ({ ...f, guestNameTamil: '' }));
      }
    }, 500),
    []
  );

  // Debounced transliteration for village
  const debouncedTransliterateVillage = useCallback(
    debounce(async (englishText) => {
      if (englishText.trim()) {
        const tamilText = await transliterateToTamil(englishText);
        setForm(f => ({ ...f, villageTamil: tamilText }));
      } else {
        setForm(f => ({ ...f, villageTamil: '' }));
      }
    }, 500),
    []
  );

  // Debounced transliteration for relation
  const debouncedTransliterateRelation = useCallback(
    debounce(async (englishText) => {
      if (englishText.trim()) {
        const tamilText = await transliterateToTamil(englishText);
        setForm(f => ({ ...f, relationTamil: tamilText }));
      } else {
        setForm(f => ({ ...f, relationTamil: '' }));
      }
    }, 500),
    []
  );

  const load = async () => {
    try {
      const [fnRes, cRes] = await Promise.all([
        axios.get(`${API_URL}/functions/${id}`),
        axios.get(`${API_URL}/contributions/function/${id}`),
      ]);
      setFn(fnRes.data); 
      // Sort contributions in ascending order (oldest first, newest last)
      const sortedContributions = cRes.data.sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));
      setContributions(sortedContributions);
    } catch { toast.error('Could not load function data'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [id]);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (c) => {
    setForm({ 
      guestName: c.guestName, 
      guestNameTamil: c.guestNameTamil||'', 
      guestNameEnglish: c.guestNameEnglish||'', 
      village: c.village||'',
      villageTamil: c.villageTamil||'',
      guestRelation: c.guestRelation||'', 
      relationTamil: c.relationTamil||'',
      amount: c.amount, 
      giftType: c.giftType, 
      giftDescription: c.giftDescription||'', 
      notes: c.notes||'' 
    });
    setEditId(c._id); setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const isGold = form.giftType === 'gold', isOther = form.giftType === 'other', isGift = form.giftType === 'gift';
    if (!form.guestNameEnglish) return toast.error('Guest name is required.');
    if (form.giftType === 'cash' && !form.amount) return toast.error('Amount is required for cash.');
    if ((isGold || isGift || isOther) && !form.giftDescription) return toast.error('Please describe the contribution.');
    setSaving(true);
    try {
      const payload = {
        ...form,
        guestName: form.guestNameEnglish,
        functionId: id,
        amount: Number(form.amount)||0
      };
      if (editId) {
        await axios.put(`${API_URL}/contributions/${editId}`, payload);
        toast.success('Entry updated.');
      } else {
        await axios.post(`${API_URL}/contributions`, payload);
        toast.success('Entry recorded to the ledger.');
      }
      setForm(EMPTY_FORM); setShowForm(false); setEditId(null); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save entry'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (cId) => {
    if (!confirm('Remove this entry from the ledger?')) return;
    try { await axios.delete(`${API_URL}/contributions/${cId}`); toast.success('Entry removed.'); load(); }
    catch { toast.error('Could not delete'); }
  };

  const cashTotal = contributions.filter(c=>c.giftType==='cash').reduce((s,c)=>s+c.amount,0);
  const fmt = (n) => `₹${Number(n||0).toLocaleString('en-IN')}`;

  if (loading) return <AppLayout><div className="flex items-center justify-center h-96"><div className="font-headline text-primary tracking-widest text-sm animate-pulse uppercase">Loading Archive...</div></div></AppLayout>;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-10">
        {/* Breadcrumb + Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 text-on-surface-variant font-label text-[10px] uppercase tracking-widest mb-3 md:mb-4 overflow-x-auto">
            <Link to="/dashboard" className="hover:text-secondary transition-colors whitespace-nowrap">Dashboard</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary font-bold truncate">{fn?.name}</span>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <p className="font-label text-[9px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-secondary mb-1 font-bold">{fn?.category?.toUpperCase()} — {fn?.date ? new Date(fn.date).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}) : ''}</p>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight break-words">{fn?.name}</h1>
              {fn?.venue && <p className="font-serif text-on-surface-variant italic mt-1 text-sm">{fn.venue}</p>}
            </div>
            <button onClick={openAdd} className="gold-gradient text-primary px-6 md:px-7 py-3 md:py-3.5 font-label font-bold text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md w-full md:w-auto md:self-start">
              <span className="material-symbols-outlined text-sm">add</span>Record Entry
            </button>
          </div>
        </div>

        {/* Stats — only cash, gold, gift, other + total */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
          {[
            { label:'Total Contributions', value: fmt(fn?.totalContributions||0), icon:'account_balance_wallet' },
            { label:'Cash Total', value: fmt(cashTotal), icon:'payments' },
            { label:'Total Guests', value: contributions.length.toString(), icon:'diversity_3' },
            { label:'Non-cash Items', value: contributions.filter(c=>c.giftType!=='cash').length.toString(), icon:'card_giftcard' },
          ].map(({label,value,icon})=>(
            <div key={label} className="bg-surface-variant border border-outline-variant/20 p-4 md:p-5">
              <span className="material-symbols-outlined text-secondary text-lg md:text-xl mb-2 block">{icon}</span>
              <p className="font-display font-bold text-primary text-lg md:text-xl break-words">{value}</p>
              <p className="font-label text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mt-1 leading-tight">{label}</p>
            </div>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-primary/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-outline-variant w-full max-w-lg p-8 md:p-10 ambient-shadow max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="font-headline text-lg font-bold text-primary tracking-widest uppercase">{editId ? 'Edit Entry' : 'Record Entry'}</h2>
                  <p className="font-serif text-on-surface-variant italic text-sm mt-0.5">Add to the sacred ledger</p>
                </div>
                <button onClick={()=>{setShowForm(false);setEditId(null);}} className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                {/* Guest Name + Village */}
                <div className="space-y-4">
                  {/* Guest Name - English and Tamil in one row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Guest Name (English) *</label>
                      <input 
                        value={form.guestNameEnglish} 
                        onChange={e=>{
                          const englishName = e.target.value;
                          setForm(f=>({
                            ...f,
                            guestNameEnglish: englishName,
                            guestName: englishName
                          }));
                          // Auto-transliterate to Tamil
                          debouncedTransliterate(englishName);
                        }} 
                        placeholder="Type name in English"
                        required
                        className="w-full px-3 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
                    </div>
                    <div>
                      <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">விருந்தினர் பெயர் (Auto)</label>
                      <div className="w-full px-3 py-2.5 bg-surface-variant/50 border border-outline-variant/50 font-label text-sm text-on-surface min-h-[42px] flex items-center">
                        {form.guestNameTamil || <span className="italic text-xs text-on-surface-variant">Auto-generated...</span>}
                      </div>
                    </div>
                  </div>

                  {/* Village - English and Tamil in one row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Village (English)</label>
                      <input 
                        value={form.village} 
                        onChange={e=>{
                          const englishVillage = e.target.value;
                          setForm(f=>({
                            ...f,
                            village: englishVillage
                          }));
                          // Auto-transliterate to Tamil
                          debouncedTransliterateVillage(englishVillage);
                        }} 
                        placeholder="Type village name"
                        className="w-full px-3 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
                    </div>
                    <div>
                      <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">ஊர் (Auto)</label>
                      <div className="w-full px-3 py-2.5 bg-surface-variant/50 border border-outline-variant/50 font-label text-sm text-on-surface min-h-[42px] flex items-center">
                        {form.villageTamil || <span className="italic text-xs text-on-surface-variant">Auto-generated...</span>}
                      </div>
                    </div>
                  </div>

                  {/* Relation - English and Tamil in one row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Relation (English)</label>
                      <input 
                        value={form.guestRelation} 
                        onChange={e=>{
                          const englishRelation = e.target.value;
                          setForm(f=>({
                            ...f,
                            guestRelation: englishRelation
                          }));
                          // Auto-transliterate to Tamil
                          debouncedTransliterateRelation(englishRelation);
                        }} 
                        placeholder="Uncle, Friend..."
                        className="w-full px-3 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
                    </div>
                    <div>
                      <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">உறவு (Auto)</label>
                      <div className="w-full px-3 py-2.5 bg-surface-variant/50 border border-outline-variant/50 font-label text-sm text-on-surface min-h-[42px] flex items-center">
                        {form.relationTamil || <span className="italic text-xs text-on-surface-variant">Auto-generated...</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gift Type tabs */}
                <div>
                  <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-2">Contribution Type</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.keys(GIFT_ICON).map(type => (
                      <button key={type} type="button" onClick={()=>setForm(f=>({...f,giftType:type,giftDescription:'',amount:''}))}
                        className={`py-3 border text-[10px] font-label font-bold uppercase tracking-wider transition-all flex flex-col items-center gap-1 ${form.giftType===type ? 'border-secondary bg-secondary/10 text-secondary' : 'border-outline-variant text-on-surface-variant hover:border-secondary/50'}`}>
                        <span className="material-symbols-outlined text-lg">{GIFT_ICON[type]}</span>
                        {GIFT_LABEL[type]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic fields by gift type */}
                <GiftTypeForm form={form} setForm={setForm}/>

                <div className="flex gap-3 pt-3">
                  <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-3.5 font-label font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary-light transition-all disabled:opacity-60">
                    {saving ? 'Saving...' : editId ? 'Save Changes' : 'Inscribe Entry'}
                  </button>
                  <button type="button" onClick={()=>{setShowForm(false);setEditId(null);}} className="px-6 border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all font-label text-[10px] uppercase tracking-widest">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Contribution Ledger */}
        <div className="bg-white border border-outline-variant/30 ambient-shadow">
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 lg:p-8 border-b border-outline-variant/20 gap-4">
            <div>
              <h2 className="font-headline text-sm md:text-base lg:text-lg font-bold text-primary tracking-widest uppercase">Contribution Ledger</h2>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{contributions.length} entries recorded</p>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button 
                onClick={openAdd}
                className="font-label text-[9px] md:text-[10px] text-white bg-secondary hover:bg-secondary/90 uppercase tracking-widest transition-colors flex items-center gap-1.5 font-bold px-3 md:px-4 py-2 shadow-sm">
                <span className="material-symbols-outlined text-sm">add</span><span className="hidden sm:inline">Add</span>
              </button>
              <Link to={`/reports?fn=${id}`} className="font-label text-[9px] md:text-[10px] text-secondary hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1.5 font-bold border border-secondary hover:border-primary px-3 md:px-4 py-2">
                <span className="material-symbols-outlined text-sm">description</span><span className="hidden sm:inline">Report</span>
              </Link>
            </div>
          </div>

          {contributions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <span className="material-symbols-outlined text-5xl text-outline-variant mb-4">menu_book</span>
              <p className="font-headline text-sm text-primary tracking-widest uppercase">The Ledger Awaits</p>
              <p className="font-serif text-on-surface-variant italic mt-2">No entries yet. Begin recording contributions.</p>
              <button onClick={openAdd} className="mt-6 gold-gradient text-primary px-7 py-3 font-label font-bold text-[10px] uppercase tracking-widest">
                Record First Entry
              </button>
            </div>
          ) : (
            <>
              {/* Desktop Table View - Hidden on mobile */}
              <div className="hidden md:block overflow-hidden">
                {/* Table header - Fixed */}
                <div className="grid grid-cols-12 px-3 md:px-6 py-3 bg-surface-variant/50 border-b border-outline-variant/10 gap-3">
                  {[t.guestName, t.village, t.relation, t.amountItem, t.type, t.date].map((h,i)=>(
                    <div key={i} className={`font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest ${i===0?'col-span-2 pr-3 border-r border-outline-variant/20':i===1?'col-span-2 pr-3 border-r border-outline-variant/20':i===2?'col-span-2 pr-3 border-r border-outline-variant/20':i===3?'col-span-3 pr-3 border-r border-outline-variant/20':i===4?'col-span-2 pr-3 border-r border-outline-variant/20':'col-span-1'}`}>{h}</div>
                  ))}
                </div>

                {/* Table body - Scrollable when more than 6 rows */}
                <div className={contributions.length > 6 ? 'overflow-y-auto' : ''} style={{maxHeight: contributions.length > 6 ? '360px' : 'none'}}>
                  {contributions.map((c, idx) => (
                <div key={c._id} className={`grid grid-cols-12 px-6 py-4 items-center border-b border-outline-variant/10 gap-3 group transition-colors ${idx%2===0?'bg-white':'bg-surface-variant/10'} hover:bg-secondary/5`}>
                  {/* Guest Name */}
                  <div className="col-span-2 pr-3 border-r border-outline-variant/20">
                    <p className="font-display font-bold text-primary text-sm leading-tight break-words">
                      {lang === 'ta' ? (c.guestNameTamil || c.guestName) : (c.guestNameEnglish || c.guestName)}
                    </p>
                  </div>
                  
                  {/* Village */}
                  <div className="col-span-2 pr-3 border-r border-outline-variant/20">
                    {c.village ? (
                      <p className="font-label font-semibold text-xs text-on-surface leading-tight break-words">
                        {lang === 'ta' ? (c.villageTamil || c.village) : c.village}
                      </p>
                    ) : (
                      <span className="text-on-surface-variant text-xs">—</span>
                    )}
                  </div>
                  
                  {/* Relation */}
                  <div className="col-span-2 pr-3 border-r border-outline-variant/20 font-label font-bold text-xs text-on-surface leading-tight break-words">
                    {c.guestRelation ? (lang === 'ta' ? (c.relationTamil || c.guestRelation) : c.guestRelation) : '—'}
                  </div>
                  
                  {/* Amount/Item */}
                  <div className="col-span-3 pr-3 border-r border-outline-variant/20">
                    {c.giftType==='cash'
                      ? <p className="font-display font-bold text-primary text-lg leading-tight">{fmt(c.amount)}</p>
                      : <div>
                          <p className="font-display font-bold text-primary text-sm leading-tight break-words">{c.giftDescription || GIFT_LABEL[c.giftType]}</p>
                          {c.amount > 0 && <p className="font-label text-xs text-on-surface-variant">~{fmt(c.amount)}</p>}
                        </div>
                    }
                  </div>
                  
                  {/* Type */}
                  <div className="col-span-2 pr-3 border-r border-outline-variant/20">
                    <span className="inline-flex items-center gap-1 text-[9px] font-label font-bold uppercase tracking-wider text-secondary border border-secondary/30 px-2 py-1">
                      <span className="material-symbols-outlined text-xs">{GIFT_ICON[c.giftType]}</span>
                      {GIFT_LABEL[c.giftType]}
                    </span>
                  </div>
                  
                  {/* Date + Actions */}
                  <div className="col-span-1 flex flex-col justify-between items-start gap-1">
                    <p className="font-label font-semibold text-[10px] text-on-surface-variant leading-tight">
                      {new Date(c.recordedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}
                    </p>
                    <div className="flex gap-1">
                      <button onClick={()=>openEdit(c)} className="p-1 text-secondary hover:bg-secondary/10 transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button onClick={()=>handleDelete(c._id)} className="p-1 text-error/50 hover:text-error hover:bg-error/10 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
                </div>
              </div>

              {/* Mobile Card View - Visible only on mobile */}
              <div className="md:hidden">
                <div className={contributions.length > 4 ? 'overflow-y-auto' : ''} style={{maxHeight: contributions.length > 4 ? '500px' : 'none'}}>
                  {contributions.map((c, idx) => (
                    <div key={c._id} className={`p-4 border-b border-outline-variant/10 ${idx%2===0?'bg-white':'bg-surface-variant/10'}`}>
                      {/* Header: Name + Actions */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-display font-bold text-primary text-base leading-tight break-words mb-1">
                            {lang === 'ta' ? (c.guestNameTamil || c.guestName) : (c.guestNameEnglish || c.guestName)}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[9px] font-label font-bold uppercase tracking-wider text-secondary border border-secondary/30 px-2 py-0.5">
                              <span className="material-symbols-outlined text-xs">{GIFT_ICON[c.giftType]}</span>
                              {GIFT_LABEL[c.giftType]}
                            </span>
                            <span className="font-label text-[10px] text-on-surface-variant">
                              {new Date(c.recordedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button onClick={()=>openEdit(c)} className="p-1.5 text-secondary hover:bg-secondary/10 transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-base">edit</span>
                          </button>
                          <button onClick={()=>handleDelete(c._id)} className="p-1.5 text-error/50 hover:text-error hover:bg-error/10 transition-colors" title="Delete">
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="space-y-2">
                        {/* Village & Relation */}
                        <div className="grid grid-cols-2 gap-3">
                          {c.village && (
                            <div>
                              <p className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">{t.village}</p>
                              <p className="font-label font-semibold text-xs text-on-surface break-words">
                                {lang === 'ta' ? (c.villageTamil || c.village) : c.village}
                              </p>
                            </div>
                          )}
                          {c.guestRelation && (
                            <div>
                              <p className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">{t.relation}</p>
                              <p className="font-label font-bold text-xs text-on-surface break-words">
                                {lang === 'ta' ? (c.relationTamil || c.guestRelation) : c.guestRelation}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Amount/Item */}
                        <div className="pt-2 border-t border-outline-variant/20">
                          <p className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">{t.amountItem}</p>
                          {c.giftType==='cash'
                            ? <p className="font-display font-bold text-primary text-xl">{fmt(c.amount)}</p>
                            : <div>
                                <p className="font-display font-bold text-primary text-sm break-words">{c.giftDescription || GIFT_LABEL[c.giftType]}</p>
                                {c.amount > 0 && <p className="font-label text-xs text-on-surface-variant mt-0.5">~{fmt(c.amount)}</p>}
                              </div>
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total row - Fixed at bottom */}
              <div className="grid grid-cols-1 md:grid-cols-12 px-4 md:px-6 py-4 md:py-5 bg-primary items-center gap-2 md:gap-0">
                <div className="md:col-span-6 lg:col-span-4 font-headline font-bold text-white text-sm md:text-base uppercase tracking-widest">Grand Total</div>
                <div className="md:col-span-6 lg:col-span-3 font-display font-bold text-accent text-xl md:text-2xl">{fmt(cashTotal)}</div>
                <div className="md:col-span-12 lg:col-span-5 flex items-center justify-start lg:justify-end">
                  <span className="font-label text-[10px] text-white/50 uppercase tracking-wider font-semibold">{contributions.length} Entries</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
