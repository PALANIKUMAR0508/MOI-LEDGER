import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import AppLayout from '../components/AppLayout';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const { t } = useLang();
  const [showChangePass, setShowChangePass] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.newPass.length < 8) return toast.error('New password must be at least 8 characters.');
    if (passForm.newPass !== passForm.confirm) return toast.error('Passwords do not match.');
    setSaving(true);
    try {
      await axios.put(`${API_URL}/auth/change-password`, { currentPassword: passForm.current, newPassword: passForm.newPass }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Password updated successfully.');
      setShowChangePass(false);
      setPassForm({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password.');
    } finally { setSaving(false); }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-10 md:py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="font-label text-[10px] uppercase tracking-[0.4em] text-secondary mb-2 font-bold">{t.account}</p>
          <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary tracking-widest uppercase">{t.profile}</h1>
          <p className="font-serif text-on-surface-variant italic mt-2">{t.yourCredentials}</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-outline-variant/30 ambient-shadow mb-8">
          {/* Avatar banner */}
          <div className="bg-primary h-24 md:h-28 relative">
            <div className="absolute bottom-0 left-8 translate-y-1/2">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-surface border-4 border-white flex items-center justify-center shadow-lg">
                <span className="material-symbols-outlined text-primary text-3xl md:text-4xl">person</span>
              </div>
            </div>
          </div>

          <div className="pt-12 pb-8 px-8">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-primary mb-1">{user?.username}</h2>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary font-bold">{t.grandArchivist}</p>

            <div className="mt-8 space-y-5">
              {/* Username */}
              <div className="border-b border-outline-variant/20 pb-5">
                <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">{t.username}</p>
                <div className="flex items-center justify-between">
                  <p className="font-body text-base text-on-surface font-medium">{user?.username}</p>
                  <span className="material-symbols-outlined text-secondary text-base">verified</span>
                </div>
              </div>

              {/* Email */}
              <div className="border-b border-outline-variant/20 pb-5">
                <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">{t.emailAddress}</p>
                <div className="flex items-center justify-between">
                  <p className="font-body text-base text-on-surface">{user?.email}</p>
                  <span className="material-symbols-outlined text-secondary text-base">mail</span>
                </div>
              </div>

              {/* Password */}
              <div className="pb-2">
                <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1.5">{t.password}</p>
                <div className="flex items-center justify-between">
                  <p className="font-body text-on-surface text-lg tracking-[0.3em]">••••••••</p>
                  <button onClick={() => setShowChangePass(!showChangePass)}
                    className="font-label text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1.5 border border-secondary/30 px-4 py-2 hover:border-primary">
                    <span className="material-symbols-outlined text-sm">lock_reset</span>
                    {t.changePassword}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        {showChangePass && (
          <div className="bg-white border border-outline-variant/30 p-8 ambient-shadow">
            <h3 className="font-headline text-base font-bold text-primary tracking-widest uppercase mb-6 pb-4 border-b border-outline-variant">{t.changePassword}</h3>
            <form onSubmit={handleChangePassword} className="space-y-5">
              {/* Current */}
              <div>
                <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">{t.currentPassword}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-base">lock</span>
                  <input type={showCurrent ? 'text' : 'password'} value={passForm.current} onChange={e => setPassForm(f=>({...f, current: e.target.value}))}
                    placeholder="Current password" required
                    className="w-full pl-9 pr-10 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-secondary">
                    <span className="material-symbols-outlined text-base">{showCurrent ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              {/* New */}
              <div>
                <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">{t.newPassword}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-base">lock_open</span>
                  <input type={showNew ? 'text' : 'password'} value={passForm.newPass} onChange={e => setPassForm(f=>({...f, newPass: e.target.value}))}
                    placeholder="New password (min 8 chars)" required
                    className="w-full pl-9 pr-10 py-2.5 bg-surface-variant border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"/>
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-secondary">
                    <span className="material-symbols-outlined text-base">{showNew ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>
              {/* Confirm */}
              <div>
                <label className="font-label text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block mb-1.5">{t.confirmNewPassword}</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-base">lock_open</span>
                  <input type="password" value={passForm.confirm} onChange={e => setPassForm(f=>({...f, confirm: e.target.value}))}
                    placeholder="Confirm new password" required
                    className={`w-full pl-9 pr-4 py-2.5 bg-surface-variant border focus:ring-0 font-label text-sm text-on-surface transition-colors ${passForm.confirm && passForm.newPass !== passForm.confirm ? 'border-error focus:border-error' : 'border-outline-variant focus:border-secondary'}`}/>
                </div>
                {passForm.confirm && passForm.newPass !== passForm.confirm && (
                  <p className="text-error text-[10px] font-label mt-1">{t.passwordsDoNotMatch}</p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="flex-1 bg-primary text-white py-3.5 font-label font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-primary-light transition-all disabled:opacity-60">
                  {saving ? t.updating : t.updatePassword}
                </button>
                <button type="button" onClick={() => setShowChangePass(false)} className="px-6 border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all font-label text-[10px] uppercase tracking-widest">
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Account info box */}
        <div className="mt-8 bg-surface-variant/40 border border-outline-variant/20 p-6 flex items-center gap-4">
          <span className="material-symbols-outlined text-secondary text-2xl">verified_user</span>
          <div>
            <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{t.secureAccount}</p>
            <p className="font-serif text-sm text-on-surface-variant italic mt-0.5">{t.dataEncrypted}</p>
          </div>
        </div>

        {/* Logout Button - Mobile Only */}
        <div className="mt-8 md:hidden">
          <button 
            onClick={logout}
            className="w-full bg-error text-white px-8 py-3.5 font-label font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-error/90 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            {t.logOut}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
