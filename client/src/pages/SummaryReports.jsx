import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import AppLayout from '../components/AppLayout';
import { API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';

const GIFT_LABEL = { cash:'Cash', gold:'Gold', gift:'Gift', other:'Other' };

export default function SummaryReports() {
  const [searchParams] = useSearchParams();
  const { t, lang } = useLang();
  const [functions, setFunctions] = useState([]);
  const [selectedFn, setSelectedFn] = useState(searchParams.get('fn') || '');
  const [fn, setFn] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const reportRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_URL}/functions`).then(r => {
      setFunctions(r.data);
      if (!searchParams.get('fn') && r.data.length > 0) setSelectedFn(r.data[0]._id);
    });
  }, []);

  useEffect(() => {
    if (!selectedFn) return;
    setLoading(true);
    Promise.all([
      axios.get(`${API_URL}/functions/${selectedFn}`),
      axios.get(`${API_URL}/contributions/function/${selectedFn}`),
    ]).then(([fnR, cR]) => { 
      setFn(fnR.data); 
      // Sort contributions in ascending order (oldest first, newest last)
      const sortedContributions = cR.data.sort((a, b) => new Date(a.recordedAt) - new Date(b.recordedAt));
      setContributions(sortedContributions);
    })
    .catch(() => toast.error('Failed to load report'))
    .finally(() => setLoading(false));
  }, [selectedFn]);

  const fmt = (n) => `₹${Number(n||0).toLocaleString('en-IN')}`;
  const cash = contributions.filter(c=>c.giftType==='cash').reduce((s,c)=>s+c.amount,0);
  const goldEstimated = contributions.filter(c=>c.giftType==='gold').reduce((s,c)=>s+c.amount,0);
  const giftEstimated = contributions.filter(c=>c.giftType==='gift').reduce((s,c)=>s+c.amount,0);
  const otherEstimated = contributions.filter(c=>c.giftType==='other').reduce((s,c)=>s+c.amount,0);
  const gold = contributions.filter(c=>c.giftType==='gold').length;
  const gifts = contributions.filter(c=>c.giftType==='gift').length;
  const others = contributions.filter(c=>c.giftType==='other').length;

  const handleExportPDF = () => {
    if (!fn) return;
    
    // Calculate estimated values
    const goldEstimated = contributions.filter(c=>c.giftType==='gold').reduce((s,c)=>s+c.amount,0);
    const giftEstimated = contributions.filter(c=>c.giftType==='gift').reduce((s,c)=>s+c.amount,0);
    const otherEstimated = contributions.filter(c=>c.giftType==='other').reduce((s,c)=>s+c.amount,0);
    
    const printContent = reportRef.current?.innerHTML;
    if (!printContent) return;
    const w = window.open('', '_blank');
    w.document.write(`
      <!DOCTYPE html><html><head>
      <title>MOI Ledger — ${fn.name}</title>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@400;500;600;700&family=Cinzel:wght@400;700&family=Lato:wght@400;600;700&display=swap" rel="stylesheet"/>
      <style>
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Montserrat',sans-serif;background:#fff;color:#2C241E;-webkit-print-color-adjust:exact;print-color-adjust:exact;font-size:0.85rem;}
        .report-header{background:#4A3728;padding:1.5rem 2rem;color:white;}
        .report-header h1{font-family:'Cinzel',serif;font-size:1.4rem;letter-spacing:0.08em;color:#E8D5A5;margin-bottom:0.4rem;font-weight:700;}
        .report-meta{font-size:0.65rem;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.6);margin-top:0.2rem;}
        .report-total-big{font-family:'Montserrat',sans-serif;font-size:1.8rem;font-weight:800;color:#C5A059;}
        .stats-bar{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #E5DCC3;}
        .stat-cell{padding:0.8rem 1.2rem;border-right:1px solid #E5DCC3;}
        .stat-cell:last-child{border-right:none;}
        .stat-value{font-family:'Montserrat',sans-serif;font-size:1.1rem;font-weight:700;color:#4A3728;}
        .stat-label{font-size:0.6rem;text-transform:uppercase;letter-spacing:0.12em;color:#6D5F52;margin-top:0.3rem;font-weight:600;}
        .table-header{display:grid;grid-template-columns:1.5rem 1.2fr 0.8fr 0.8fr 1.5fr 0.7fr 0.8fr;gap:8px;padding:0.6rem 1.2rem;background:#F5F2E0;border-bottom:1px solid #E5DCC3;}
        .table-row{display:grid;grid-template-columns:1.5rem 1.2fr 0.8fr 0.8fr 1.5fr 0.7fr 0.8fr;gap:8px;padding:0.7rem 1.2rem;border-bottom:1px solid rgba(229,220,195,0.3);align-items:center;}
        .table-row:nth-child(even){background:#FDFCF0;}
        .th{font-size:0.65rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:#6D5F52;}
        .td-name{font-family:'Montserrat',sans-serif;font-weight:700;color:#2C241E;font-size:0.85rem;word-wrap:break-word;overflow-wrap:break-word;line-height:1.3;}
        .td-village{font-family:'Montserrat',sans-serif;font-size:0.85rem;color:#2C241E;font-weight:600;word-wrap:break-word;overflow-wrap:break-word;line-height:1.3;}
        .td-relation{font-family:'Montserrat',sans-serif;font-size:0.85rem;color:#2C241E;font-weight:600;word-wrap:break-word;overflow-wrap:break-word;line-height:1.3;}
        .td-amt{font-family:'Montserrat',sans-serif;font-weight:700;color:#2C241E;font-size:0.85rem;word-wrap:break-word;overflow-wrap:break-word;line-height:1.3;}
        .td-type{font-family:'Montserrat',sans-serif;font-size:0.85rem;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#C5A059;}
        .td-small{font-family:'Montserrat',sans-serif;font-size:0.85rem;color:#2C241E;font-weight:500;}
        .table-footer{display:grid;grid-template-columns:1.5rem 1.2fr 0.8fr 0.8fr 1.5fr 0.7fr 0.8fr;gap:8px;padding:1rem 1.2rem;background:#4A3728;align-items:center;}
        .tf-label{font-family:'Montserrat',sans-serif;font-size:0.85rem;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;color:white;grid-column:1/5;}
        .tf-total{font-family:'Montserrat',sans-serif;font-size:1.1rem;font-weight:800;color:#C5A059;grid-column:5;}
        .report-footer{padding:1.2rem 1.5rem;display:flex;justify-content:space-between;align-items:center;border-top:1px solid #E5DCC3;margin-top:0.8rem;}
        .rf-brand{font-family:'Cinzel',serif;font-size:0.7rem;letter-spacing:0.12em;text-transform:uppercase;color:#4A3728;font-weight:600;}
        .rf-date{font-family:'Montserrat',sans-serif;font-weight:600;color:#6D5F52;font-size:0.65rem;text-transform:uppercase;letter-spacing:0.08em;}
        @media print{@page{size:A4;margin:1cm;}}
      </style>
      </head><body>
      <div class="report-header">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;">
          <div>
            <div style="font-size:0.65rem;letter-spacing:0.3em;text-transform:uppercase;color:#C5A059;margin-bottom:0.5rem;">Official Archival Report · MOI The Grand Ledger</div>
            <h1>${fn.name}</h1>
            <div class="report-meta">${new Date(fn.date).toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}${fn.venue ? ' · ' + fn.venue : ''}</div>
          </div>
          <div style="text-align:right;">
            <div class="report-total-big">${fmt(cash)}</div>
            <div class="report-meta">${contributions.length} Guests</div>
          </div>
        </div>
      </div>
      <div class="stats-bar">
        <div class="stat-cell"><div class="stat-value">${fmt(cash)}</div><div class="stat-label">Cash</div></div>
        <div class="stat-cell"><div class="stat-value">${gold}</div><div class="stat-label">Gold Items</div>${goldEstimated > 0 ? `<div style="font-size:0.6rem;color:#6D5F52;margin-top:0.2rem;">Est: ${fmt(goldEstimated)}</div>` : ''}</div>
        <div class="stat-cell"><div class="stat-value">${gifts}</div><div class="stat-label">Gift Items</div>${giftEstimated > 0 ? `<div style="font-size:0.6rem;color:#6D5F52;margin-top:0.2rem;">Est: ${fmt(giftEstimated)}</div>` : ''}</div>
        <div class="stat-cell"><div class="stat-value">${others}</div><div class="stat-label">Other</div>${otherEstimated > 0 ? `<div style="font-size:0.6rem;color:#6D5F52;margin-top:0.2rem;">Est: ${fmt(otherEstimated)}</div>` : ''}</div>
      </div>
      <div style="padding:1.5rem;">
        <div class="table-header">
          <div class="th">#</div><div class="th">Guest Name</div><div class="th">Village</div><div class="th">Relation</div>
          <div class="th">Amount/Item</div><div class="th">Type</div><div class="th">Date</div>
        </div>
        ${contributions.map((c,i)=>`
          <div class="table-row">
            <div class="td-small">${i+1}</div>
            <div class="td-name">${lang === 'ta' ? (c.guestNameTamil || c.guestName) : (c.guestNameEnglish || c.guestName)}</div>
            <div class="td-village">${c.village ? (lang === 'ta' ? (c.villageTamil || c.village) : c.village) : '—'}</div>
            <div class="td-relation">${c.guestRelation ? (lang === 'ta' ? (c.relationTamil || c.guestRelation) : c.guestRelation) : '—'}</div>
            <div class="td-amt">${c.giftType==='cash' ? fmt(c.amount) : `${c.giftDescription||GIFT_LABEL[c.giftType]}${c.amount > 0 ? ` <span style="font-size:0.7rem;color:#6D5F52;">(~${fmt(c.amount)})</span>` : ''}`}</div>
            <div class="td-type">${GIFT_LABEL[c.giftType]||c.giftType}</div>
            <div class="td-small">${new Date(c.recordedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</div>
          </div>
        `).join('')}
        <div class="table-footer">
          <div class="tf-label">Grand Total</div>
          <div class="tf-total">${fmt(cash)}</div>
          <div style="grid-column:6/8;text-align:right;font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.4);">${contributions.length} Guests</div>
        </div>
      </div>
      <div class="report-footer">
        <div><div class="rf-brand">MOI The Grand Ledger</div><div style="font-size:0.65rem;text-transform:uppercase;letter-spacing:0.1em;color:#6D5F52;margin-top:0.3rem;font-weight:500;">© 2026 All rights reserved</div></div>
        <div class="rf-date">Generated: ${new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</div>
      </div>
      </body></html>
    `);
    w.document.close();
    setTimeout(() => { w.focus(); w.print(); }, 600);
  };

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.4em] text-secondary mb-2 font-bold">{t.archiveBureau}</p>
            <h1 className="font-headline text-4xl font-bold text-primary tracking-widest uppercase">{t.summaryReports}</h1>
            <p className="font-serif text-on-surface-variant italic mt-2">{t.beautifullyFormatted}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => window.print()} className="flex items-center gap-2 border border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary px-5 py-2.5 font-label text-[10px] uppercase tracking-widest transition-all">
              <span className="material-symbols-outlined text-sm">print</span>{t.print}
            </button>
            <button onClick={handleExportPDF} disabled={!fn}
              className="gold-gradient text-primary px-5 py-2.5 font-label font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-sm disabled:opacity-40">
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>{t.exportPDF}
            </button>
          </div>
        </div>

        {/* Selector */}
        <div className="mb-10">
          <label className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2">{t.selectFunction}</label>
          <select value={selectedFn} onChange={e => setSelectedFn(e.target.value)}
            className="bg-white border border-outline-variant px-4 py-3 font-serif text-primary text-lg focus:border-secondary focus:ring-0 min-w-80 transition-colors">
            <option value="">{t.chooseFunction}</option>
            {functions.map(f=>(
              <option key={f._id} value={f._id}>{f.name}</option>
            ))}
          </select>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="font-headline text-primary tracking-widest text-sm animate-pulse uppercase">{t.generatingReport}</div>
          </div>
        )}

        {!loading && fn && (
          <div ref={reportRef} className="border border-outline-variant/30 ambient-shadow">
            {/* Report Header */}
            <div className="bg-primary p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-white" style={{fontSize:'18rem'}}>account_balance</span>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6">
                <div>
                  <p className="font-label text-[10px] uppercase tracking-[0.4em] text-accent mb-3 font-bold">{t.officialReport}</p>
                  <h2 className="font-headline text-4xl font-bold text-white mb-3 leading-tight">{fn.name}</h2>
                  <div className="flex flex-wrap gap-4 text-white/60 font-label text-[10px] uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">calendar_month</span>{new Date(fn.date).toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</span>
                    {fn.venue && <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">location_on</span>{fn.venue}</span>}
                    <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">category</span>{fn.category}</span>
                  </div>
                </div>
                <div className="text-right md:shrink-0">
                  <div className=" text-accent text-5xl font-bold">{fmt(cash)}</div>
                  <p className="font-label text-[10px] text-white/50 uppercase tracking-widest mt-1">{t.cashTotal}</p>
                </div>
              </div>
            </div>

            {/* Summary stats — contribution breakdown, NOT avg */}
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { label:t.cashTotal, value: fmt(cash), icon:'payments' },
                { label:t.goldItems, value: `${gold} item${gold!==1?'s':''}`, subValue: goldEstimated > 0 ? `Est: ${fmt(goldEstimated)}` : null, icon:'diamond' },
                { label:t.giftItems, value: `${gifts} item${gifts!==1?'s':''}`, subValue: giftEstimated > 0 ? `Est: ${fmt(giftEstimated)}` : null, icon:'card_giftcard' },
                { label:t.other, value: `${others} item${others!==1?'s':''}`, subValue: otherEstimated > 0 ? `Est: ${fmt(otherEstimated)}` : null, icon:'category' },
              ].map(({label,value,subValue,icon},i)=>(
                <div key={label} className={`p-6 md:p-8 border-b border-outline-variant/20 ${i<3?'border-r border-outline-variant/20':''}${i>=2?'bg-surface-variant/30':'bg-white'}`}>
                  <span className="material-symbols-outlined text-secondary text-xl mb-2 block">{icon}</span>
                  <p className="font-display text-2xl font-bold text-primary">{value}</p>
                  {subValue && <p className="font-label text-[9px] uppercase tracking-wider text-on-surface-variant mt-1">{subValue}</p>}
                  <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Contribution table */}
            <div className="bg-white p-6 md:p-8">
              <h3 className="font-headline text-base font-bold text-primary tracking-widest uppercase mb-6">{t.contributionRegister}</h3>
              
              {/* Header */}
              <div className="grid grid-cols-12 bg-surface-variant/50 px-3 md:px-5 py-3 border-b border-outline-variant/20 mb-0 gap-3">
                {[t.guestName,'Village',t.relation,t.amountItem,t.type,t.date].map((h,i)=>(
                  <div key={i} className={`font-label text-[9px] font-bold text-on-surface-variant uppercase tracking-widest ${i===0?'col-span-2 pr-3 border-r border-outline-variant/20':i===1?'col-span-2 pr-3 border-r border-outline-variant/20':i===2?'col-span-2 pr-3 border-r border-outline-variant/20':i===3?'col-span-3 pr-3 border-r border-outline-variant/20':i===4?'col-span-2 pr-3 border-r border-outline-variant/20':'col-span-1'}`}>{h}</div>
                ))}
              </div>
              
              {contributions.map((c,idx)=>(
                <div key={c._id} className={`grid grid-cols-12 px-3 md:px-5 py-3 md:py-4 items-center border-b border-outline-variant/10 gap-3 ${idx%2===0?'bg-white':'bg-surface-variant/20'}`}>
                  {/* Guest Name */}
                  <div className="col-span-2 pr-3 border-r border-outline-variant/20">
                    <p className="font-display font-bold text-primary text-sm leading-tight break-words">
                      {lang === 'ta' ? (c.guestNameTamil || c.guestName) : (c.guestNameEnglish || c.guestName)}
                    </p>
                  </div>
                  
                  {/* Village */}
                  <div className="col-span-2 pr-3 border-r border-outline-variant/20">
                    <p className="font-label font-semibold text-xs text-on-surface leading-tight break-words">
                      {c.village ? (lang === 'ta' ? (c.villageTamil || c.village) : c.village) : '—'}
                    </p>
                  </div>
                  
                  {/* Relation */}
                  <div className="col-span-2 pr-3 border-r border-outline-variant/20 font-label font-bold text-xs text-on-surface leading-tight break-words">
                    {c.guestRelation ? (lang === 'ta' ? (c.relationTamil || c.guestRelation) : c.guestRelation) : '—'}
                  </div>
                  
                  {/* Amount/Item */}
                  <div className="col-span-3 pr-3 border-r border-outline-variant/20">
                    {c.giftType==='cash'
                      ? <p className="font-display font-black text-primary text-lg leading-tight">{fmt(c.amount)}</p>
                      : <div>
                          <p className="font-display font-bold text-primary text-sm leading-tight break-words">{c.giftDescription||GIFT_LABEL[c.giftType]}</p>
                          {c.amount>0&&<p className="font-label text-xs text-on-surface-variant">~{fmt(c.amount)}</p>}
                        </div>
                    }
                  </div>
                  
                  {/* Type */}
                  <div className="col-span-2 pr-3 border-r border-outline-variant/20">
                    <span className="inline-flex items-center gap-1 font-label text-[9px] font-bold uppercase tracking-wider text-secondary border border-secondary/20 px-2 py-0.5">
                      {GIFT_LABEL[c.giftType]}
                    </span>
                  </div>
                  
                  {/* Date */}
                  <div className="col-span-1 font-label text-[10px] text-on-surface-variant leading-tight">
                    {new Date(c.recordedAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}
                  </div>
                </div>
              ))}
              
              {/* Total */}
              <div className="grid grid-cols-12 px-3 md:px-5 py-4 md:py-5 bg-primary items-center gap-1 md:gap-0">
                <div className="col-span-6 md:col-span-4 font-headline font-bold text-white text-sm uppercase tracking-widest">{t.grandTotal}</div>
                <div className="col-span-6 md:col-span-3 font-display font-bold text-accent text-base">{fmt(cash)}</div>
                <div className="col-span-12 md:col-span-5 flex items-center justify-start md:justify-end">
                  <span className="font-label text-[10px] text-white/50 uppercase tracking-wider font-semibold">{contributions.length} {t.guestsRecorded}</span>
                </div>
              </div>
            </div>

            {/* Report footer */}
            <div className="bg-surface-variant/30 p-6 flex justify-between items-center border-t border-outline-variant/20">
              <div>
                <p className="font-label text-[9px] uppercase tracking-[0.3em] text-on-surface-variant/50">{t.generatedBy}</p>
                <p className="font-headline font-bold text-primary text-sm tracking-widest uppercase">MOI The Grand Ledger</p>
              </div>
              <div className="text-right">
                <p className="font-label text-[9px] uppercase tracking-[0.3em] text-on-surface-variant/50">{t.reportDate}</p>
                <p className="font-serif text-primary italic">{new Date().toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !fn && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-6">description</span>
            <h2 className="font-headline text-xl font-bold text-primary tracking-widest uppercase mb-3">{t.selectFunctionPrompt}</h2>
            <p className="font-serif text-on-surface-variant italic">{t.chooseFunctionDesc}</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
