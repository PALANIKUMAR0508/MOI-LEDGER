import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import AppLayout from '../components/AppLayout';
import { API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Contributions() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [functions, setFunctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API_URL}/functions`);
        setFunctions(res.data);
        // If there are functions, redirect to the first one
        if (res.data.length > 0) {
          navigate(`/contributions/${res.data[0]._id}`, { replace: true });
        }
      } catch { 
        toast.error('Failed to load functions'); 
      } finally { 
        setLoading(false); 
      }
    };
    load();
  }, [navigate]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="font-headline text-primary tracking-widest text-sm animate-pulse uppercase">{t.loadingArchives}</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10 md:py-12">
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-6">volunteer_activism</span>
          <h2 className="font-headline text-xl font-bold text-primary tracking-widest uppercase mb-3">{t.noFunctionsFound}</h2>
          <p className="font-serif text-on-surface-variant italic mb-8 max-w-md">
            {t.beginJourney}
          </p>
          <button 
            onClick={() => navigate('/functions/new')}
            className="bg-primary text-white px-10 py-4 font-label font-bold text-[10px] uppercase tracking-widest hover:bg-primary-light transition-all shadow-md"
          >
            {t.createFirstFunction}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
