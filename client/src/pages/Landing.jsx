import { Link } from 'react-router-dom';
import { useLang } from '../context/LangContext';

export default function Landing() {
  const { lang, toggle, t } = useLang();

  return (
    <div className="bg-surface text-on-surface font-serif min-h-screen">
      {/* Top Nav */}
      <header className="bg-surface/80 backdrop-blur-md fixed top-0 w-full z-50 border-b border-outline-variant/30">
        <nav className="flex justify-between items-center w-full px-6 md:px-8 py-4 md:py-5 max-w-screen-2xl mx-auto">
          <Link to="/" className="text-xl md:text-2xl font-bold text-primary tracking-tighter font-headline">MOI Ledger</Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-on-surface-variant hover:text-secondary transition-colors text-[11px] font-label uppercase tracking-widest">{t.features}</a>
            <a href="#reports" className="text-on-surface-variant hover:text-secondary transition-colors text-[11px] font-label uppercase tracking-widest">{t.howItWorks}</a>
          </div>
          <div className="flex items-center gap-3">
            {/* Language Toggle */}
            <div className="flex items-center border border-outline-variant overflow-hidden">
              <button onClick={() => toggle('en')} className={`px-3 py-1.5 text-[10px] font-label font-bold transition-all ${lang==='en' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-variant'}`}>EN</button>
              <button onClick={() => toggle('ta')} className={`px-3 py-1.5 text-[10px] font-label font-bold transition-all ${lang==='ta' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-variant'}`}>TA</button>
            </div>
            <Link to="/signin" className="bg-primary text-white px-5 py-2.5 font-label font-semibold text-[11px] uppercase tracking-widest hover:bg-primary-light transition-all shadow-md">{t.signIn}</Link>
          </div>
        </nav>
      </header>

      <main className="pt-20">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&q=80" alt="Wedding ceremony" />
            <div className="absolute inset-0 hero-gradient" />
          </div>
          <div className="relative z-10 max-w-screen-2xl mx-auto px-6 md:px-8 w-full py-24 md:py-32">
            <div className="max-w-3xl">
              <p className="font-label text-[10px] md:text-[11px] uppercase tracking-[0.4em] text-secondary mb-5 font-bold">{t.heroTagline}</p>
              <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                {t.heroTitle} <span className="text-accent italic font-display">{t.heroTitleItalic}</span>
              </h1>
              <p className="font-display text-lg md:text-2xl text-white/85 mb-10 leading-relaxed italic max-w-2xl">{t.heroSubtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signin" className="bg-secondary text-white px-8 md:px-10 py-4 md:py-5 text-sm font-headline uppercase tracking-widest hover:bg-accent transition-all shadow-xl text-center">{t.heroBtn1}</Link>
                <Link to="/register" className="border border-white/50 text-white backdrop-blur-md px-8 md:px-10 py-4 md:py-5 text-sm font-headline uppercase tracking-widest hover:bg-white hover:text-primary transition-all text-center">{t.heroBtn2}</Link>
              </div>
            </div>
          </div>
          <div className="absolute bottom-12 right-10 hidden xl:block">
            <div className="glass-panel p-7 border border-secondary/20 max-w-sm ambient-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-11 h-11 bg-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white">auto_awesome</span>
                </div>
                <div>
                  <p className="font-headline font-bold text-primary tracking-tight text-sm">{t.floatTitle}</p>
                  <p className="font-label text-[10px] uppercase tracking-widest text-secondary font-semibold">{t.floatTrust}</p>
                </div>
              </div>
              <p className="text-base text-on-surface leading-relaxed font-display italic">{t.floatQuote}</p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <div className="bg-primary py-8 md:py-10 px-6">
          <div className="max-w-screen-xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {t.stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="font-headline text-2xl md:text-3xl font-bold text-accent">{value}</p>
                <p className="font-label text-[9px] md:text-[10px] uppercase tracking-widest text-white/50 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <section id="features" className="py-24 md:py-32 bg-surface px-6 md:px-8">
          <div className="max-w-screen-xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold text-primary mb-4 tracking-widest uppercase">{t.featuresTitle}</h2>
              <div className="h-0.5 w-32 bg-secondary mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {/* Feature 1 - Translation */}
              <div className="md:col-span-8 group overflow-hidden bg-surface-variant p-8 md:p-12 border border-outline-variant/30 hover:border-secondary transition-all duration-500">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex-1">
                    <span className="material-symbols-outlined text-4xl text-secondary mb-4 block">translate</span>
                    <h3 className="font-headline text-2xl font-bold text-primary mb-3 uppercase tracking-wider">{t.f1Title}</h3>
                    <p className="text-on-surface-variant text-lg leading-relaxed font-serif italic">{t.f1Desc}</p>
                  </div>
                  <div className="flex-1 bg-white p-6 border border-outline-variant/20 rotate-1 group-hover:rotate-0 transition-transform shadow-sm w-full">
                    <div className="space-y-5">
                      <div className="border-b border-outline-variant/10 pb-4">
                        <div className="text-[10px] font-label font-bold text-secondary tracking-widest uppercase mb-1">தமிழ்</div>
                        <div className="text-xl text-primary font-serif">சிவகுமார் — <span className="font-bold">₹5,000</span></div>
                      </div>
                      <div>
                        <div className="text-[10px] font-label font-bold text-secondary tracking-widest uppercase mb-1">ENGLISH</div>
                        <div className="text-xl text-primary font-serif italic">Sivakumar — <span className="font-bold">₹5,000</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Feature 2 - Instant */}
              <div className="md:col-span-4 bg-primary p-8 md:p-12 text-white flex flex-col justify-between overflow-hidden relative min-h-[260px]">
                <div className="absolute top-0 right-0 opacity-5"><span className="material-symbols-outlined" style={{fontSize:'15rem'}}>payments</span></div>
                <div className="z-10">
                  <span className="material-symbols-outlined text-3xl text-accent mb-4 block">monitoring</span>
                  <h3 className="font-headline text-xl font-bold mb-3 uppercase tracking-widest">{t.f2Title}</h3>
                  <p className="text-white/70 text-base leading-relaxed font-serif italic">{t.f2Desc}</p>
                </div>
                <div className="z-10 mt-6 pt-6 border-t border-white/10">
                  <span className="text-3xl font-headline font-bold text-accent">{t.f2Amount}</span>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-label text-white/50 mt-2">{t.f2Label}</p>
                </div>
              </div>
              {/* Feature 3 - Elegant Reports with mock */}
              <div id="reports" className="md:col-span-5 bg-surface-container p-8 md:p-12 border border-outline-variant/30">
                <span className="material-symbols-outlined text-3xl text-primary mb-4 block">picture_as_pdf</span>
                <h3 className="font-headline text-xl font-bold text-primary mb-3 uppercase tracking-widest">{t.f3Title}</h3>
                <p className="text-on-surface-variant text-base mb-6 font-serif italic">{t.f3Desc}</p>
                {/* Real mock report */}
                <div className="bg-white border border-outline-variant/40 shadow-lg p-5 select-none">
                  <div className="flex items-start justify-between mb-3 pb-3 border-b border-outline-variant/20">
                    <div>
                      <p className="font-headline text-[9px] text-secondary uppercase tracking-widest mb-0.5">{t.elegantReportSample}</p>
                      <p className="font-display font-bold text-primary text-sm leading-tight">{t.elegantReportNames}</p>
                      <p className="font-label text-[9px] text-on-surface-variant mt-0.5">{t.elegantReportDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-accent text-lg">{t.elegantReportTotal}</p>
                      <p className="font-label text-[9px] text-on-surface-variant">{t.elegantReportGuests}</p>
                    </div>
                  </div>
                  {[
                    {name: t.elegantRow1, amt: t.elegantRow1Amt},
                    {name: t.elegantRow2, amt: t.elegantRow2Amt},
                    {name: t.elegantRow3, amt: t.elegantRow3Amt},
                  ].map((r,i)=>(
                    <div key={i} className={`flex justify-between py-2 text-xs ${i<2?'border-b border-outline-variant/10':''}`}>
                      <span className="font-serif text-on-surface">{r.name}</span>
                      <span className="font-bold text-secondary">{r.amt}</span>
                    </div>
                  ))}
                  <div className="mt-3 pt-2 border-t border-outline-variant/20 flex justify-between items-center">
                    <span className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant">{lang==='ta'?'மொத்தம்':'Total'}</span>
                    <span className="font-display font-bold text-primary">{t.elegantReportTotal}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[8px] font-label uppercase tracking-widest text-on-surface-variant/40">
                    <span className="material-symbols-outlined text-xs">verified_user</span>
                    {lang==='ta'?'MOI கிராண்ட் லெட்ஜர்':'MOI The Grand Ledger'}
                  </div>
                </div>
              </div>
              {/* Feature 4 - Secure */}
              <div className="md:col-span-7 bg-white p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-outline-variant/30">
                <div className="flex-1">
                  <h3 className="font-headline text-xl font-bold text-primary mb-3 uppercase tracking-widest">{t.f4Title}</h3>
                  <p className="text-on-surface-variant text-base leading-relaxed font-serif italic mb-6">{t.f4Desc}</p>
                  <div className="flex flex-wrap gap-3">
                    {['AES-256','2FA', lang==='ta'?'தினசரி காப்பு':'Daily Backup'].map(tag=>(
                      <div key={tag} className="bg-surface-variant px-4 py-1.5 border border-outline-variant/20 text-[10px] font-label font-bold text-secondary uppercase tracking-[0.2em]">{tag}</div>
                    ))}
                  </div>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="relative">
                    <span className="material-symbols-outlined text-surface-variant" style={{fontSize:'8rem'}}>cloud_done</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-4xl text-secondary" style={{fontVariationSettings:"'FILL' 1"}}>lock</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="py-24 md:py-32 bg-surface-variant px-6 md:px-8 relative border-y border-outline-variant/20">
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="font-headline text-3xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 tracking-tight uppercase">{t.ctaTitle}</h2>
            <p className="font-display text-lg md:text-2xl text-on-surface-variant mb-10 max-w-2xl mx-auto italic">{t.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <Link to="/register" className="bg-primary text-white px-10 md:px-14 py-5 md:py-6 font-headline uppercase tracking-widest text-sm hover:bg-primary-light transition-all shadow-xl">{t.ctaBtn1}</Link>
              <Link to="/signin" className="bg-white text-primary px-10 md:px-14 py-5 md:py-6 font-headline uppercase tracking-widest text-sm border border-outline-variant hover:bg-surface-container transition-all">{t.ctaBtn2}</Link>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-48 md:w-64 h-48 md:h-64 border-l border-t border-secondary/20 m-8 md:m-12 pointer-events-none"/>
          <div className="absolute bottom-0 right-0 w-48 md:w-64 h-48 md:h-64 border-r border-b border-secondary/20 m-8 md:m-12 pointer-events-none"/>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-outline-variant/30 py-10 md:py-16 px-6 md:px-8">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-label text-[10px] text-on-surface-variant/50 tracking-[0.2em] uppercase text-center md:text-left">
            {t.copyright.split('2026')[0]}
            <span className="font-display text-xs font-bold">2026</span>
            {t.copyright.split('2026')[1]}
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {t.footerLinks.map((item,i)=>(
              <Link key={i} to={i===0?'/legal':'#'} className="font-label text-[10px] text-on-surface-variant/50 hover:text-secondary transition-all tracking-[0.2em] uppercase">{item}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
