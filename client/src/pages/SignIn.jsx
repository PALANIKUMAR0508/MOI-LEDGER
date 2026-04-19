import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function SignIn() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Trim and normalize inputs - MUST match registration
      const cleanEmail = form.email.trim().toLowerCase();
      const cleanPassword = form.password.trim();
      
      console.log('Logging in with:', { email: cleanEmail, passwordLength: cleanPassword.length });
      
      await login(cleanEmail, cleanPassword);
      toast.success('Welcome back, Archivist.');
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      toast.error(err.response?.data?.message || 'Authentication failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* BG blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[150px]"/>
        <div className="absolute top-[50%] -right-[10%] w-[40%] h-[60%] bg-accent/5 rounded-full blur-[120px]"/>
      </div>

      <main className="relative z-10 w-full max-w-md py-10">
        {/* Brand */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 border border-primary/30 bg-surface mb-6 rotate-45">
            <span className="material-symbols-outlined text-primary text-2xl -rotate-45">menu_book</span>
          </div>
          <h1 className="font-headline text-2xl font-bold tracking-[0.2em] text-primary uppercase mb-2">MOI Ledger</h1>
          <p className="text-on-surface-variant font-serif italic text-base">The Grand Ledger: Modern Archivist Edition</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-outline-variant p-8 md:p-10 royal-shadow">
          <h2 className="font-headline text-base font-bold text-primary mb-8 tracking-widest uppercase border-b border-outline-variant pb-4">Sign In</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="font-label text-[11px] font-semibold uppercase text-on-surface-variant tracking-wider block mb-1.5">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-base">mail</span>
                <input
                  type="email" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  placeholder="your@email.com" required
                  className="w-full pl-9 pr-4 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="font-label text-[11px] font-semibold uppercase text-on-surface-variant tracking-wider">Password</label>
                <a href="#" className="font-label text-[10px] font-semibold text-primary hover:text-secondary transition-colors uppercase tracking-wider">Forgot?</a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-base">lock</span>
                <input
                  type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  placeholder="Enter your password" required
                  className="w-full pl-9 pr-10 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-secondary transition-colors">
                  <span className="material-symbols-outlined text-base">{showPass ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white font-label font-bold py-3.5 tracking-[0.15em] uppercase text-xs hover:bg-primary-light transition-all shadow-md disabled:opacity-60 mt-2">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant flex flex-col items-center gap-3">
            <p className="font-label text-xs text-on-surface-variant uppercase tracking-widest">New to MOI Ledger?</p>
            <Link to="/register" className="font-label text-sm font-bold text-primary hover:text-secondary transition-colors underline underline-offset-8 decoration-primary/30 uppercase tracking-widest">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Responsive footer */}
        <footer className="mt-10 text-center">
          <p className="font-label text-[9px] uppercase tracking-[0.25em] text-on-surface-variant/50">
            © 2026 MOI The Grand Ledger. All rights reserved.
          </p>
          <div className="flex justify-center items-center gap-4 mt-4 flex-wrap">
            {['Home','Privacy','Support'].map((item, i) => (
              <span key={item} className="flex items-center gap-4">
                {i > 0 && <span className="w-1 h-1 bg-outline-variant rounded-full"/>}
                <Link to={item === 'Home' ? '/' : '/legal'} className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors">{item}</Link>
              </span>
            ))}
          </div>
        </footer>
      </main>

      {/* Decorative corner */}
      <div className="fixed bottom-0 right-0 p-10 opacity-5 hidden lg:block pointer-events-none">
        <span className="material-symbols-outlined text-primary" style={{fontSize:'140px'}}>history_edu</span>
      </div>
    </div>
  );
}
