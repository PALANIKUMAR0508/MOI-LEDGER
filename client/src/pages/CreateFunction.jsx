import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useLang } from '../context/LangContext';
import AppLayout from '../components/AppLayout';
import { API_URL } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const CATEGORIES = [
  // Marriage Side
  { group: 'marriageSide', value: 'marriage',     label: 'திருமணம் (Marriage)',               icon: 'favorite',           nameFields: ['groomName','brideName'], functionNames: { en: 'Marriage', ta: 'திருமணம்' } },
  { group: 'marriageSide', value: 'engagement',   label: 'நிச்சயதார்த்தம் (Engagement)',      icon: 'diamond',            nameFields: ['groomName','brideName'], functionNames: { en: 'Engagement', ta: 'நிச்சயதார்த்தம்' } },
  { group: 'marriageSide', value: 'reception',    label: 'ரிசப்ஷன் (Reception)',              icon: 'celebration',        nameFields: ['groomName','brideName'], functionNames: { en: 'Reception', ta: 'ரிசப்ஷன்' } },
  { group: 'marriageSide', value: 'nalangu',      label: 'நாளங்கு (Nalangu)',                 icon: 'spa',                nameFields: ['groomName','brideName'], functionNames: { en: 'Nalangu', ta: 'நாளங்கு' } },
  // Personal Functions
  { group: 'personalFunctions', value: 'valaikappu',  label: 'வளைக்காப்பு (Baby Shower)',     icon: 'pregnant_woman',     nameFields: ['motherName'], functionNames: { en: 'Baby Shower', ta: 'வளைக்காப்பு' } },
  { group: 'personalFunctions', value: 'naming',      label: 'பெயர் சூட்டும் விழா (Naming)', icon: 'child_care',         nameFields: ['babyName','parentsName'], functionNames: { en: 'Naming Ceremony', ta: 'பெயர் சூட்டும் விழா' } },
  { group: 'personalFunctions', value: 'earPiercing', label: 'காது குத்துதல் (Ear Piercing)', icon: 'face',               nameFields: ['childName','parentsName'], functionNames: { en: 'Ear Piercing', ta: 'காது குத்துதல்' } },
  { group: 'personalFunctions', value: 'birthday1st', label: 'முதல் பிறந்தநாள் (1st Birthday)',icon:'cake',              nameFields: ['childName','parentsName'], functionNames: { en: '1st Birthday', ta: 'முதல் பிறந்தநாள்' } },
  { group: 'personalFunctions', value: 'birthday',    label: 'பிறந்தநாள் (Birthday)',        icon: 'cake',               nameFields: ['honoree'], functionNames: { en: 'Birthday', ta: 'பிறந்தநாள்' } },
  { group: 'personalFunctions', value: 'puberty',     label: 'மஞ்சள் நீராட்டு (Puberty)',    icon: 'female',             nameFields: ['girlName','parentsName'], functionNames: { en: 'Puberty Ceremony', ta: 'மஞ்சள் நீராட்டு' } },
  // Milestones
  { group: 'milestones', value: 'sathabhisekam', label: 'சதாபிஷேகம் (60th Anniversary)',     icon: 'hotel_class',        nameFields: ['husbandName','wifeName'], functionNames: { en: '60th Anniversary', ta: 'சதாபிஷேகம்' } },
  { group: 'milestones', value: 'bheemaRatha',   label: 'பீமரத சாந்தி (70th Birthday)',      icon: 'elderly',            nameFields: ['honoree'], functionNames: { en: '70th Birthday', ta: 'பீமரத சாந்தி' } },
  { group: 'milestones', value: 'achievement',   label: 'கல்வி சாதனை (Achievement)',         icon: 'emoji_events',       nameFields: ['honoree'], functionNames: { en: 'Achievement', ta: 'கல்வி சாதனை' } },
  // House & Business
  { group: 'houseBusiness', value: 'houseWarming', label: 'கிரகப்பிரவேசம் (House Warming)', icon: 'home',             nameFields: ['ownerName'], functionNames: { en: 'House Warming', ta: 'கிரகப்பிரவேசம்' } },
  { group: 'houseBusiness', value: 'shopOpening',  label: 'கடை திறப்பு (Shop Opening)',    icon: 'store',              nameFields: ['ownerName','shopName'], functionNames: { en: 'Shop Opening', ta: 'கடை திறப்பு' } },
  // Religious
  { group: 'religious', value: 'templeEvent',    label: 'கும்பாபிஷேகம் (Temple Event)',      icon: 'temple_hindu',       nameFields: ['templeName'], functionNames: { en: 'Temple Event', ta: 'கும்பாபிஷேகம்' } },
  { group: 'religious', value: 'annaprashan',    label: 'அன்னப்பிராசனம் (First Rice)',       icon: 'restaurant',         nameFields: ['childName','parentsName'], functionNames: { en: 'First Rice Ceremony', ta: 'அன்னப்பிராசனம்' } },
  { group: 'religious', value: 'upanayana',      label: 'உபநயனம் (Thread Ceremony)',         icon: 'person_add',         nameFields: ['childName','parentsName'], functionNames: { en: 'Thread Ceremony', ta: 'உபநயனம்' } },
  // Other
  { group: 'other', value: 'other',             label: 'மற்றவை (Other Function)',            icon: 'category',           nameFields: ['honoree'], functionNames: { en: 'Other Function', ta: 'மற்ற விழா' } },
];

const NAME_LABELS = {
  groomName:   'Groom Name / மணமகன் பெயர்',
  brideName:   'Bride Name / மணமகள் பெயர்',
  honoree:     'Honoree Name / கொண்டாடப்படுபவர் பெயர்',
  motherName:  "Mother's Name / தாயின் பெயர்",
  babyName:    "Baby's Name / குழந்தையின் பெயர்",
  childName:   "Child's Name / குழந்தையின் பெயர்",
  parentsName: "Parent's Name / பெற்றோர் பெயர்",
  girlName:    "Girl's Name / பெண்ணின் பெயர்",
  husbandName: "Husband's Name / கணவர் பெயர்",
  wifeName:    "Wife's Name / மனைவியின் பெயர்",
  ownerName:   "Owner's Name / உரிமையாளர் பெயர்",
  shopName:    "Shop Name / கடையின் பெயர்",
  templeName:  "Temple Name / கோயில் பெயர்",
};

export default function CreateFunction() {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('marriageSide');
  const [form, setForm] = useState({ name: '', category: '', date: '', venue: '', nameFields: {} });

  const GROUPS = [...new Set(CATEGORIES.map(c => c.group))];
  const selectedCat = CATEGORIES.find(c => c.value === form.category);
  const groupCategories = CATEGORIES.filter(c => c.group === selectedGroup);

  const update = (k, v) => setForm(f => ({...f, [k]: v}));
  const updateName = (k, v) => setForm(f => ({...f, nameFields: {...f.nameFields, [k]: v}}));

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    // Reset category when group changes
    setForm(f => ({...f, category: '', name: '', nameFields: {}}));
  };

  const handleCategoryChange = (val) => {
    const cat = CATEGORIES.find(c => c.value === val);
    // Auto-fill function name based on category and language
    const autoName = cat?.functionNames?.[lang] || '';
    setForm(f => ({...f, category: val, name: autoName, nameFields: {}}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.date) return toast.error('Function name and date are required.');
    setLoading(true);
    try {
      const payload = {
        name: form.name, category: form.category, date: form.date, venue: form.venue,
        groomName: form.nameFields.groomName || '',
        brideName: form.nameFields.brideName || '',
        honoree: form.nameFields.honoree || form.nameFields.motherName || form.nameFields.babyName ||
                 form.nameFields.childName || form.nameFields.girlName || form.nameFields.husbandName ||
                 form.nameFields.ownerName || form.nameFields.templeName || '',
      };
      const res = await axios.post(`${API_URL}/functions`, payload);
      toast.success('Function registered to the Grand Ledger.');
      navigate(`/contributions/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create function');
    } finally { setLoading(false); }
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-6 md:px-10 py-10 md:py-12">
        {/* Header */}
        <div className="mb-10 border-b border-outline-variant pb-8">
          <div className="flex items-center gap-3 text-secondary font-label text-[10px] uppercase tracking-[0.3em] mb-4">
            <span className="h-px w-8 bg-secondary inline-block"/>
            <span>{t.newArchivistEntry}</span>
          </div>
          <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-primary tracking-tight mb-2">{t.createNewFunction}</h1>
          <p className="font-serif text-lg text-on-surface-variant italic">{t.documentingCeremonies}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <form className="lg:col-span-8 space-y-8" onSubmit={handleSubmit}>
            {/* Function Name */}
            <div>
              <label className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] block mb-2">{t.functionName} *</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="The Grand Union of..." required
                className="input-underline font-serif text-xl italic"/>
            </div>

            {/* Category - Two Step Selection */}
            <div>
              <label className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] block mb-3">{t.category} / வகை *</label>
              
              {/* Step 1: Select Category Group */}
              <div className="mb-4">
                <p className="font-label text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">Step 1: Select Category Group</p>
                <select 
                  value={selectedGroup} 
                  onChange={(e) => handleGroupChange(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-outline-variant focus:border-secondary focus:ring-0 font-label text-sm text-on-surface transition-colors"
                >
                  {GROUPS.map(group => (
                    <option key={group} value={group}>{t[group]}</option>
                  ))}
                </select>
              </div>

              {/* Step 2: Select Specific Category */}
              <div>
                <p className="font-label text-[9px] font-bold text-on-surface-variant/60 uppercase tracking-widest mb-2">Step 2: Select Function Type</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {groupCategories.map(cat => (
                    <button 
                      key={cat.value} 
                      type="button" 
                      onClick={() => handleCategoryChange(cat.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 border text-left transition-all ${form.category === cat.value ? 'border-secondary bg-secondary/10 text-secondary' : 'border-outline-variant text-on-surface-variant hover:border-secondary/50 hover:bg-surface-variant'}`}
                    >
                      <span className="material-symbols-outlined text-base shrink-0">{cat.icon}</span>
                      <span className="font-label text-[10px] leading-tight">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Date + Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] block mb-2">{t.functionDate} *</label>
                <input type="date" value={form.date} onChange={e => update('date', e.target.value)} required className="input-underline font-serif text-lg"/>
              </div>
              <div>
                <label className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] block mb-2">{t.venue} / இடம்</label>
                <input value={form.venue} onChange={e => update('venue', e.target.value)} placeholder="Hall, city..." className="input-underline font-serif text-lg italic"/>
              </div>
            </div>

            {/* Dynamic Name Fields */}
            {selectedCat && selectedCat.nameFields.length > 0 && (
              <div className="pt-6 border-t border-outline-variant/20">
                <p className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] mb-4">{t.personDetails}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCat.nameFields.map(field => (
                    <div key={field} className="relative">
                      <label className="font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em] block mb-2">{NAME_LABELS[field]}</label>
                      <input value={form.nameFields[field] || ''} onChange={e => updateName(field, e.target.value)}
                        placeholder={`Enter ${NAME_LABELS[field].split('/')[0].trim()}`}
                        className="input-underline font-serif text-lg italic"/>
                      <div className="absolute -left-3 top-8 w-0.5 h-5 bg-secondary"/>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <button type="submit" disabled={loading}
                className="sm:w-auto bg-primary text-white px-10 py-4 font-label text-xs font-bold uppercase tracking-[0.2em] hover:bg-primary-light transition-all flex items-center justify-center gap-3 group disabled:opacity-60 shadow-md">
                {loading ? t.registering : t.registerFunction}
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
              <button type="button" onClick={() => navigate('/dashboard')}
                className="font-label text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant hover:text-primary transition-all px-4 py-4">
                {t.cancel}
              </button>
            </div>
          </form>

          {/* Sidebar tips */}
          <div className="lg:col-span-4 space-y-6">
            {/* Selected category preview */}
            {selectedCat && (
              <div className="bg-primary/5 border border-secondary/20 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="material-symbols-outlined text-secondary text-2xl">{selectedCat.icon}</span>
                  <div>
                    <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant">{t.selected}</p>
                    <p className="font-display font-bold text-primary text-sm leading-tight">{selectedCat.label}</p>
                  </div>
                </div>
                <p className="font-label text-[10px] text-on-surface-variant leading-relaxed">
                  {selectedCat.nameFields.length} {t.nameFieldsRequired}
                </p>
              </div>
            )}

            <div className="bg-white p-6 border border-outline-variant/30 shadow-sm">
              <h3 className="font-headline text-sm font-bold text-primary tracking-widest uppercase mb-5">{t.archivistGuide}</h3>
              <div className="space-y-4">
                {[
                  {icon:'info', text:t.guideCategory},
                  {icon:'calendar_month', text:t.guideDate},
                  {icon:'people', text:t.guidePerson},
                  {icon:'location_on', text:t.guideVenue},
                ].map(({icon, text}) => (
                  <div key={text} className="flex gap-3">
                    <span className="material-symbols-outlined text-secondary text-base mt-0.5 shrink-0">{icon}</span>
                    <p className="font-label text-xs text-on-surface-variant leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
