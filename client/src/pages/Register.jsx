import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BLOCKED_DOMAINS = ['mailinator.com','guerrillamail.com','temp-mail.org','throwaway.email','fakeinbox.com','yopmail.com','trashmail.com','sharklasers.com','guerrillamailblock.com','grr.la','spam4.me','binkmail.com','mt2014.com','dispostable.com'];

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  if (BLOCKED_DOMAINS.includes(domain)) return false;
  return true;
}

export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const strength = form.password.length >= 12 ? 4 : form.password.length >= 8 ? 3 : form.password.length >= 5 ? 2 : form.password.length > 0 ? 1 : 0;
  const strengthColors = ['bg-outline-variant','bg-error','bg-yellow-500','gold-gradient','gold-gradient'];
  const strengthLabel = ['','Weak','Fair','Strong','Very Strong'];

  const validateEmail = (val) => {
    if (!val) { setEmailError(''); return; }
    if (!isValidEmail(val)) setEmailError('Please enter a valid email address.');
    else setEmailError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidEmail(form.email)) return toast.error('Please enter a valid email address.');
    if (form.password.length < 8) return toast.error('Password must be at least 8 characters.');
    if (form.username.length < 3) return toast.error('Username must be at least 3 characters.');
    setLoading(true);
    try {
      // Trim and normalize inputs
      const cleanUsername = form.username.trim();
      const cleanEmail = form.email.trim().toLowerCase();
      const cleanPassword = form.password.trim();
      
      console.log('Registering with:', { username: cleanUsername, email: cleanEmail, passwordLength: cleanPassword.length });
      
      await register(cleanUsername, cleanEmail, cleanPassword);
      toast.success('Welcome to the Grand Ledger.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-4 py-10">
        {/* BG blobs */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[80%] rounded-full bg-outline/10 blur-[120px]"/>
          <div className="absolute -bottom-[10%] -left-[5%] w-[40%] h-[60%] rounded-full bg-primary/8 blur-[100px]"/>
        </div>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden royal-shadow border border-outline-variant/20">
          {/* Left: Image */}
          <div className="relative hidden md:block overflow-hidden min-h-[620px]">
            <img src="/src/assets/images/Marriage.png" alt="MOI Ledger - Contribution Management" className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/90 via-primary/40 to-transparent"/>
            <div className="absolute bottom-12 left-10 right-10 z-10">
              <h1 className="font-headline text-3xl font-extrabold text-accent tracking-[0.15em] mb-3">MOI Ledger</h1>
              <p className="text-white/80 font-display italic text-base leading-relaxed max-w-sm">
                Preserving the grace of contribution. Join the modern archivists.
              </p>
            </div>
            <div className="absolute top-8 left-8 border-t border-l border-outline/40 w-10 h-10"/>
          </div>

          {/* Right: Form */}
          <div className="p-8 md:p-14 flex flex-col justify-center bg-white">
            <div className="mb-8">
              <span className="font-label text-primary font-bold tracking-[0.25em] text-[0.65rem] uppercase mb-1.5 block">The Archivist Registry</span>
              <h2 className="font-display text-3xl font-bold text-primary">Create Account</h2>
              <div className="h-1 w-10 gold-gradient mt-3 rounded-full"/>
              <p className="text-on-surface-variant font-body mt-4 text-sm">Enter the inner circle of the Grand Ledger.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Username */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-label text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">Username</label>
                  {form.username.length > 2 && (
                    <span className="flex items-center text-secondary text-[10px] font-bold font-label">
                      <span className="material-symbols-outlined text-xs mr-0.5">check_circle</span>Available
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-base">person</span>
                  <input
                    type="text" value={form.username}
                    onChange={e => setForm({...form, username: e.target.value})}
                    placeholder="your_username" required
                    className="w-full pl-9 pr-4 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="font-label text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase block mb-1.5">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-base">mail</span>
                  <input
                    type="email" value={form.email}
                    onChange={e => { setForm({...form, email: e.target.value}); validateEmail(e.target.value); }}
                    placeholder="name@example.com" required
                    className={`w-full pl-9 pr-4 py-2.5 bg-surface-variant border focus:ring-0 font-label text-sm text-on-surface transition-colors ${emailError ? 'border-error focus:border-error' : 'border-outline-variant focus:border-secondary'}`}
                  />
                  {form.email && !emailError && <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-secondary text-base">check_circle</span>}
                </div>
                {emailError && <p className="text-error text-[10px] font-label mt-1">{emailError}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-label text-[11px] font-semibold text-on-surface-variant tracking-wider uppercase">Password</label>
                  <span className="text-on-surface-variant/50 text-[10px] font-label">Min. 8 characters</span>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-base">lock</span>
                  <input
                    type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    placeholder="Create a strong password" required
                    className="w-full pl-9 pr-10 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-secondary transition-colors">
                    <span className="material-symbols-outlined text-base">{showPass ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {/* Strength bar */}
                {form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1">
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? (strength >= 3 ? 'gold-gradient' : strength === 2 ? 'bg-yellow-400' : 'bg-error') : 'bg-outline-variant'}`}/>
                      ))}
                    </div>
                    <p className="text-[10px] font-label text-on-surface-variant/60 mt-1">{strengthLabel[strength]}</p>
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="pt-2">
                <button type="submit" disabled={loading || !!emailError}
                  className="w-full gold-gradient text-white py-3.5 font-headline font-bold text-xs tracking-[0.2em] hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60">
                  {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                  <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="font-label text-xs text-on-surface-variant">
                Already a member?{' '}
                <Link to="/signin" className="text-primary font-bold hover:text-accent underline-offset-4 underline ml-1 transition-all">Sign In</Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full py-8 px-6 flex flex-col md:flex-row justify-between items-center border-t border-outline-variant/10 gap-4">
        <div className="font-label text-[10px] text-on-surface-variant/50 tracking-[0.2em] uppercase text-center">© 2026 MOI The Grand Ledger.</div>
        <div className="flex gap-6">
          {['Terms','Privacy','Support'].map(item => (
            <Link key={item} to="/legal" className="font-label text-[10px] text-on-surface-variant/50 hover:text-primary transition-colors tracking-[0.2em] uppercase">{item}</Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
