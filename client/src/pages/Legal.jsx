import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Legal() {
  const { token } = useAuth();
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Nav */}
      <header className="bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-screen-xl mx-auto">
          <Link to={token ? '/dashboard' : '/'} className="font-headline text-xl font-bold text-primary tracking-tighter">MOI Ledger</Link>
          <Link to={token ? '/dashboard' : '/'} className="flex items-center gap-2 text-on-surface-variant hover:text-secondary transition-colors font-label text-[11px] uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">arrow_back</span>{token ? 'Dashboard' : 'Home'}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 md:px-8 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12 border-b border-outline-variant pb-8">
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-secondary mb-3 font-bold">Legal Information</p>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary tracking-wide uppercase mb-2">Terms & Copyright</h1>
          <p className="font-serif text-on-surface-variant italic">Effective Date: January 1, 2026 · Last Updated: April 2026</p>
        </div>

        <div className="prose-style space-y-10">
          {/* Copyright */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary text-xl">copyright</span>
              <h2 className="font-headline text-lg font-bold text-primary tracking-widest uppercase">Copyright Notice</h2>
            </div>
            <div className="bg-surface-variant border-l-4 border-secondary px-6 py-5 mb-4">
              <p className="font-display text-xl italic text-primary">
                © 2026 MOI The Grand Ledger. All rights reserved.
              </p>
            </div>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              All content, design, code, and materials on this platform — including but not limited to the "Aurelian Heritage" design system, UI components, written content, and branding — are the intellectual property of MOI The Grand Ledger and are protected under applicable copyright laws.
            </p>
          </section>

          {/* Terms */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary text-xl">gavel</span>
              <h2 className="font-headline text-lg font-bold text-primary tracking-widest uppercase">Terms of Service</h2>
            </div>
            <div className="space-y-4 font-body text-sm text-on-surface-variant leading-relaxed">
              <p>By using MOI Ledger, you agree to the following terms:</p>
              <ul className="space-y-2 ml-4">
                {[
                  'You may use this service to record and manage MOI (gift contributions) for personal ceremonies and events.',
                  'You are responsible for the accuracy of data entered into the system.',
                  'You shall not use this platform for fraudulent, illegal, or harmful purposes.',
                  'All data you enter is private and accessible only by you and authorized users.',
                  'We reserve the right to update these terms at any time with notice.',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-secondary font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Privacy */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary text-xl">privacy_tip</span>
              <h2 className="font-headline text-lg font-bold text-primary tracking-widest uppercase">Privacy Policy</h2>
            </div>
            <div className="space-y-3 font-body text-sm text-on-surface-variant leading-relaxed">
              <p>We take your privacy seriously. Here's what we collect and how we use it:</p>
              {[
                {title: 'Data Collected', desc: 'Account credentials (name, email, hashed password) and ceremony contribution records you enter.'},
                {title: 'Data Storage', desc: 'All data is stored in encrypted MongoDB databases with AES-256 encryption.'},
                {title: 'Data Sharing', desc: 'We do not sell, share, or transfer your personal data to third parties.'},
                {title: 'Data Deletion', desc: 'You may request deletion of your account and all associated data at any time by contacting support.'},
              ].map(({title, desc}) => (
                <div key={title} className="border-l-2 border-outline-variant pl-4">
                  <p className="font-label text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">{title}</p>
                  <p>{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <span className="material-symbols-outlined text-secondary text-xl">contact_support</span>
              <h2 className="font-headline text-lg font-bold text-primary tracking-widest uppercase">Contact & Support</h2>
            </div>
            <p className="font-body text-sm text-on-surface-variant leading-relaxed">
              For any questions, concerns, or requests regarding these terms or your data, please contact our support team. We aim to respond within 2 business days.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-surface-variant px-5 py-3 border border-outline-variant">
              <span className="material-symbols-outlined text-secondary text-sm">mail</span>
              <span className="font-label text-[11px] text-primary uppercase tracking-widest">support@moiledger.com</span>
            </div>
          </section>
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-outline-variant/30 text-center">
          <p className="font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/50">© 2026 MOI The Grand Ledger · All rights reserved</p>
        </div>
      </main>
    </div>
  );
}
