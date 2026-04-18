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
            <div className="grid grid-cols-2 gap-2">
              {GOLD_TYPES.map(gt => (
                <button key={gt} type="button" onClick={() => setForm(f=>({...f, giftDescription: gt}))}
                  className={`text-left px-3 py-2 border text-[10px] font-label transition-all ${form.giftDescription===gt ? 'border-secondary bg-secondary/10 text-secondary font-bold' : 'border-outline-variant text-on-surface-variant hover:border-secondary/50'}`}>
                  {gt}
                </button>
              ))}
            </div>
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
            <div className="grid grid-cols-2 gap-2 mb-3">
              {GIFT_TYPES_LIST.map(gt => (
                <button key={gt} type="button" onClick={() => setForm(f=>({...f, giftDescription: gt}))}
                  className={`text-left px-3 py-2 border text-[10px] font-label transition-all ${form.giftDescription===gt ? 'border-secondary bg-secondary/10 text-secondary font-bold' : 'border-outline-variant text-on-surface-variant hover:border-secondary/50'}`}>
                  {gt}
                </button>
              ))}
            </div>
            <input value={form.giftDescription.startsWith('Other') || !GIFT_TYPES_LIST.includes(form.giftDescription) ? form.giftDescription : ''} 
              onChange={e => setForm(f=>({...f, giftDescription: e.target.value}))}
              placeholder="Or type gift name..."
              className="w-full px-3 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
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

const EMPTY_FORM = { guestName:'', guestNameTamil:'', guestNameEnglish:'', village:'', villageTamil:'', guestRelation:'', amount:'', giftType:'cash', giftDescription:'', notes:'' };
const GIFT_ICON = { cash:'payments', gold:'diamond', gift:'card_giftcard', other:'category' };
const GIFT_LABEL = { cash:'Cash', gold:'Gold', gift:'Gift', other:'Other' };

export default function EntryWorkspace() {
  const { id } = useParams();
  const { lang } = useLang();
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

  const load = async () => {
    try {
      const [fnRes, cRes] = await Promise.all([
        axios.get(`${API_URL}/functions/${id}`),
        axios.get(`${API_URL}/contributions/function/${id}`),
      ]);
      setFn(fnRes.data); setContributions(cRes.data);
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
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
        {/* Breadcrumb + Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-on-surface-variant font-label text-[10px] uppercase tracking-widest mb-4">
            <Link to="/dashboard" className="hover:text-secondary transition-colors">Dashboard</Link>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-primary font-bold truncate max-w-xs">{fn?.name}</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.4em] text-secondary mb-1 font-bold">{fn?.category?.toUpperCase()} — {fn?.date ? new Date(fn.date).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}) : ''}</p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary leading-tight">{fn?.name}</h1>
              {fn?.venue && <p className="font-serif text-on-surface-variant italic mt-1 text-sm">{fn.venue}</p>}
            </div>
            <button onClick={openAdd} className="gold-gradient text-primary px-7 py-3.5 font-label font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:brightness-110 transition-all shadow-md whitespace-nowrap">
              <span className="material-symbols-outlined text-sm">add</span>Record Entry
            </button>
          </div>
        </div>

        {/* Stats — only cash, gold, gift, other + total */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label:'Total Contributions', value: fmt(fn?.totalContributions||0), icon:'account_balance_wallet' },
            { label:'Cash Total', value: fmt(cashTotal), icon:'payments' },
            { label:'Total Guests', value: contributions.length.toString(), icon:'diversity_3' },
            { label:'Non-cash Items', value: contributions.filter(c=>c.giftType!=='cash').length.toString(), icon:'card_giftcard' },
          ].map(({label,value,icon})=>(
            <div key={label} className="bg-surface-variant border border-outline-variant/20 p-5">
              <span className="material-symbols-outlined text-secondary text-xl mb-2 block">{icon}</span>
              <p className="font-display font-bold text-primary text-xl">{value}</p>
              <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant mt-1">{label}</p>
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

                  {/* Relation and Notes */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Relation / உறவு</label>
                      <input value={form.guestRelation} onChange={e=>setForm(f=>({...f,guestRelation:e.target.value}))} placeholder="Uncle, Friend..."
                        className="w-full px-3 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
                    </div>
                    <div>
                      <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">Notes</label>
                      <input value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} placeholder="Any remarks..."
                        className="w-full px-3 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
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
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-outline-variant/20">
            <div>
              <h2 className="font-headline text-base md:text-lg font-bold text-primary tracking-widest uppercase">Contribution Ledger</h2>
              <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{contributions.length} entries recorded</p>
            </div>
            <Link to={`/reports?fn=${id}`} className="font-label text-[10px] text-secondary hover:text-primary uppercase tracking-widest transition-colors flex items-center gap-1.5 font-bold">
              <span className="material-symbols-outlined text-sm">description</span>View Report
            </Link>
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
              {/* Table header */}
              <div className="hidden md:grid grid-cols-12 px-6 py-3 bg-surface-variant/50 border-b border-outline-variant/10">
                {['Guest Name','Village','Relation','Amount/Item','Type','Date'].map((h,i)=>(
                  <div key={i} className={`font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest ${i===0?'col-span-2':i===1?'col-span-2':i===2?'col-span-2':i===3?'col-span-3':i===4?'col-span-2':'col-span-1'}`}>{h}</div>
                ))}
              </div>

              {contributions.map((c, idx) => (
                <div key={c._id} className={`grid grid-cols-1 md:grid-cols-12 px-5 md:px-6 py-4 items-center border-b border-outline-variant/10 gap-2 md:gap-0 group transition-colors ${idx%2===0?'bg-white':'bg-surface-variant/10'} hover:bg-secondary/5`}>
                  {/* Mobile layout - Column style with headings */}
                  <div className="md:hidden space-y-3">
                    <div className="flex justify-between items-start pb-2 border-b border-outline-variant/20">
                      <div className="flex-1">
                        <p className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Guest Name</p>
                        <p className="font-display font-bold text-primary text-base">
                          {lang === 'ta' ? (c.guestNameTamil || c.guestName) : (c.guestNameEnglish || c.guestName)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={()=>openEdit(c)} className="p-1.5 text-secondary hover:bg-secondary/10 transition-colors">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={()=>handleDelete(c._id)} className="p-1.5 text-error/60 hover:text-error hover:bg-error/10 transition-colors">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </div>
                    
                    {c.village && (
                      <div>
                        <p className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Village</p>
                        <p className="font-label text-sm text-on-surface">
                          {lang === 'ta' ? (c.villageTamil || c.village) : c.village}
                        </p>
                      </div>
                    )}
                    
                    {c.guestRelation && (
                      <div>
                        <p className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Relation</p>
                        <p className="font-label text-sm text-on-surface">{c.guestRelation}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Amount/Item</p>
                      {c.giftType==='cash'
                        ? <p className="font-display font-bold text-primary text-lg">{fmt(c.amount)}</p>
                        : <div>
                            <p className="font-display font-bold text-primary">{c.giftDescription || GIFT_LABEL[c.giftType]}</p>
                            {c.amount > 0 && <p className="font-label text-xs text-on-surface-variant">~{fmt(c.amount)}</p>}
                          </div>
                      }
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Type</p>
                        <span className="inline-flex items-center gap-1 text-[9px] font-label font-bold uppercase tracking-wider text-secondary border border-secondary/30 px-2 py-1">
                          <span className="material-symbols-outlined text-xs">{GIFT_ICON[c.giftType]}</span>
                          {GIFT_LABEL[c.giftType]}
                        </span>
                      </div>
                      <div>
                        <p className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Date</p>
                        <p className="font-label text-[10px] text-on-surface-variant">
                          {new Date(c.recordedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short'})}
                        </p>
                      </div>
                    </div>
                    
                    {c.notes && (
                      <div>
                        <p className="font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Notes</p>
                        <p className="font-serif text-xs text-on-surface-variant italic">{c.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:block col-span-2">
                    <p className="font-display font-bold text-primary text-base">
                      {lang === 'ta' ? (c.guestNameTamil || c.guestName) : (c.guestNameEnglish || c.guestName)}
                    </p>
                    {c.notes && <p className="font-serif text-xs text-on-surface-variant italic mt-1">{c.notes}</p>}
                  </div>
                  <div className="hidden md:block col-span-2">
                    {c.village ? (
                      <p className="font-label text-sm text-on-surface">
                        {lang === 'ta' ? (c.villageTamil || c.village) : c.village}
                      </p>
                    ) : (
                      <span className="text-on-surface-variant text-xs">—</span>
                    )}
                  </div>
                  <div className="hidden md:block col-span-2 font-label text-xs text-on-surface-variant">{c.guestRelation||'—'}</div>
                  <div className="hidden md:block col-span-3">
                    {c.giftType==='cash'
                      ? <p className="font-display font-bold text-primary text-lg">{fmt(c.amount)}</p>
                      : <div>
                          <p className="font-display font-bold text-primary">{c.giftDescription || GIFT_LABEL[c.giftType]}</p>
                          {c.amount > 0 && <p className="font-label text-xs text-on-surface-variant">~{fmt(c.amount)}</p>}
                        </div>
                    }
                  </div>
                  <div className="hidden md:block col-span-2">
                    <span className="inline-flex items-center gap-1 text-[9px] font-label font-bold uppercase tracking-wider text-secondary border border-secondary/30 px-2 py-1">
                      <span className="material-symbols-outlined text-xs">{GIFT_ICON[c.giftType]}</span>
                      {GIFT_LABEL[c.giftType]}
                    </span>
                  </div>
                  <div className="hidden md:flex col-span-1 justify-between items-center">
                    <p className="font-label text-[10px] text-on-surface-variant">
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

              {/* Total + CTA row */}
              <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-5 bg-primary items-center gap-2">
                <div className="md:col-span-3 font-headline font-bold text-white text-sm uppercase tracking-widest">Grand Total</div>
                <div className="md:col-span-3 font-display font-bold text-accent text-2xl">{fmt(fn?.totalContributions||0)}</div>
                <div className="md:col-span-6 md:text-right flex items-center md:justify-end gap-4">
                  <span className="font-label text-[10px] text-white/50 uppercase tracking-wider">{contributions.length} Entries</span>
                  <Link to={`/reports?fn=${id}`} className="font-label text-[10px] text-white/70 hover:text-accent uppercase tracking-widest transition-colors inline-flex items-center gap-1.5 border border-white/20 px-4 py-2 hover:border-accent">
                    <span className="material-symbols-outlined text-sm">description</span>Generate Report
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
