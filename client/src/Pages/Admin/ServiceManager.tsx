import { useState, useEffect } from 'react';
import { Edit, Trash2, X, Save, Loader2, Palette, Megaphone } from 'lucide-react';
import ConfirmModal from '../../Components/Admin/ConfirmModal';
import { IconMap, AvailableIcons } from '../../utils/IconRegistry';
import api from '../../utils/api';

interface ServiceData {
  _id: string;
  title: string;
  category: string;
  icon: string;
}

const ServiceManager = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ title: '', category: 'Design', icon: 'PenTool' });
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: 'warning' as 'warning' | 'danger', onConfirm: () => { } });

  const fetchServices = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch { console.error("API Sync Failed"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await api.put(`/services/${editingId}`, formData);
      else await api.post('/services', formData);
      setIsEditorOpen(false);
      fetchServices();
    } catch { alert("Save Failed"); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  const designItems = services.filter(s => s.category === 'Design');
  const marketingItems = services.filter(s => s.category === 'Marketing');
  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <ConfirmModal {...modalConfig} onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })} />

      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Hub</h1>
        <button onClick={() => { setEditingId(null); setFormData({ title: '', category: 'Design', icon: 'PenTool' }); setIsEditorOpen(true); }} className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold transition-transform active:scale-95">+ Add Service</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* DESIGN SECTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-indigo-600 font-black uppercase tracking-widest"><Palette /> Design Agency</div>
          <div className="grid grid-cols-1 gap-4">
            {designItems.map((s) => (
              <div key={s._id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl">{IconMap[s.icon] || IconMap['Layout']}</div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{s.title}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(s._id); setFormData(s); setIsEditorOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><Edit size={18} /></button>
                  <button onClick={() => setModalConfig({ isOpen: true, title: "Delete?", message: "Permanently remove service?", type: 'danger', onConfirm: async () => { await api.delete(`/services/${s._id}`); fetchServices(); setModalConfig(m => ({ ...m, isOpen: false })) } })} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MARKETING SECTION */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-emerald-500 font-black uppercase tracking-widest"><Megaphone /> Digital Marketing</div>
          <div className="grid grid-cols-1 gap-4">
            {marketingItems.map((s) => (
              <div key={s._id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl group shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-xl">{IconMap[s.icon] || IconMap['Search']}</div>
                  <span className="font-bold text-slate-700 dark:text-slate-200">{s.title}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(s._id); setFormData(s); setIsEditorOpen(true); }} className="p-2 text-slate-400 hover:text-indigo-600"><Edit size={18} /></button>
                  <button onClick={() => setModalConfig({ isOpen: true, title: "Delete?", message: "Permanently remove service?", type: 'danger', onConfirm: async () => { await api.delete(`/services/${s._id}`); fetchServices(); setModalConfig(m => ({ ...m, isOpen: false })) } })} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CENTERED EDITOR */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setIsEditorOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
              <h2 className="text-2xl font-bold dark:text-white">Configuration</h2>
              <button onClick={() => setIsEditorOpen(false)} className="p-2 text-slate-400 hover:text-red-500"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Service Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Division</label>
                <div className="grid grid-cols-2 gap-4">
                  <button type="button" onClick={() => setFormData({ ...formData, category: 'Design' })} className={`py-4 rounded-2xl font-black uppercase text-xs ${formData.category === 'Design' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Design</button>
                  <button type="button" onClick={() => setFormData({ ...formData, category: 'Marketing' })} className={`py-4 rounded-2xl font-black uppercase text-xs ${formData.category === 'Marketing' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>Marketing</button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block ml-1">Icon Selection</label>
                <select value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-bold">
                  {AvailableIcons.map(icon => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all">
                <Save size={20} /> {editingId ? 'Update Catalog' : 'Add to Catalog'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceManager;