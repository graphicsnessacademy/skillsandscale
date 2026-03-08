import { useState, useEffect, useRef } from 'react';
import {
  Edit3,
  Trash2,
  Plus,
  Mail,
  Phone,
  X,
  Save,
  Upload,
  Loader2,
} from 'lucide-react';
import ConfirmModal from '../../Components/Admin/ConfirmModal';
import api from '../../utils/api';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  image: string;
}

const TeamManager = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState({ total: 0, developers: 0, designers: 0, marketers: 0 });
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({ name: '', role: '', image: '', email: '', phone: '' });
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: 'warning' as 'warning' | 'danger', onConfirm: () => { } });

  const fetchData = async () => {
    try {
      const res = await api.get('/team');
      setTeam(res.data.team);
      setStats(res.data.stats);
    } catch { console.error("Sync Error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('image', file);
    try {
      setUploading(true);
      const res = await api.post('/team/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, image: res.data.url });
    } catch { alert("Upload failed."); }
    finally { setUploading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) return alert("Photo required.");
    try {
      if (editingId) await api.put(`/team/${editingId}`, formData);
      else await api.post('/team', formData);
      setIsEditorOpen(false);
      fetchData();
    } catch { alert("Save failed."); }
  };

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-slate-950"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <ConfirmModal {...modalConfig} onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })} />

      {/* --- TOP ANALYTICS BAR --- */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm mb-12 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800 py-8">
        {[
          { label: 'Team Members', value: stats.total },
          { label: 'Developers', value: stats.developers },
          { label: 'Designers', value: stats.designers },
          { label: 'Marketers', value: stats.marketers },
        ].map((item, i) => (
          <div key={i} className="flex-1 text-center py-4 md:py-0">
            <h2 className="text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-1 tracking-tighter">{item.value}</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Personnel</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Staff Management Facility</p>
        </div>
        <button onClick={() => { setEditingId(null); setFormData({ name: '', role: '', image: '', email: '', phone: '' }); setIsEditorOpen(true); }} className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all flex items-center gap-2">
          <Plus size={18} /> Register Member
        </button>
      </div>

      {/* --- REFINED TEAM GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {team.map((member) => (
          <div key={member._id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-2 pb-6 hover:shadow-2xl transition-all duration-500 overflow-hidden relative">

            {/* Top Image Section */}
            <div className="relative h-64 w-full rounded-[2rem] overflow-hidden mb-6">
              <img src={member.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt="" />

              {/* Overlay Actions (Appears on Hover) */}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] flex items-center justify-center gap-3">
                <button onClick={() => { setEditingId(member._id); setFormData(member); setIsEditorOpen(true); }} className="p-4 bg-white text-slate-900 rounded-2xl hover:bg-indigo-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 shadow-xl">
                  <Edit3 size={20} />
                </button>
                <button onClick={() => setModalConfig({ isOpen: true, title: "Delete?", message: "Purge this profile?", type: 'danger', onConfirm: async () => { await api.delete(`/team/${member._id}`); fetchData(); setModalConfig(m => ({ ...m, isOpen: false })) } })} className="p-4 bg-white text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 shadow-xl delay-75">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Info Section */}
            <div className="px-6 text-center">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight line-clamp-1">{member.name}</h3>
              <div className="mt-2 inline-block px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                <p className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-widest">{member.role}</p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 border-t border-slate-50 dark:border-slate-800 pt-6">
                <a href={`mailto:${member.email}`} className="flex flex-col items-center p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Mail size={16} className="text-slate-400 mb-1" />
                  <span className="text-[9px] font-black text-slate-400 uppercase">Email</span>
                </a>
                <a href={`tel:${member.phone}`} className="flex flex-col items-center p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  <Phone size={16} className="text-slate-400 mb-1" />
                  <span className="text-[9px] font-black text-slate-400 uppercase">Call</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- CENTERED MODAL EDITOR --- */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={() => setIsEditorOpen(false)}></div>

          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">{editingId ? 'Modify Profile' : 'New Registry'}</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Personnel OS</p>
              </div>
              <button onClick={() => setIsEditorOpen(false)} className="p-3 bg-white dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-full shadow-sm"><X size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="flex flex-col items-center">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-32 h-32 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 border-4 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden group transition-all hover:border-indigo-500"
                >
                  {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <Upload className={uploading ? 'animate-bounce text-indigo-500' : 'text-slate-400'} />}
                  <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageUpload} accept="image/*" />
                </div>
                <p className="text-[9px] font-black uppercase text-slate-400 mt-3 tracking-widest">{uploading ? 'UPLOADING...' : 'PUSH TO UPLOAD'}</p>
              </div>

              <div className="space-y-4">
                <div className="group">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-bold" placeholder="E.g. Nirupom Nixon" />
                </div>
                <div className="group">
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Role</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-bold" placeholder="E.g. Lead Developer" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Email</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-bold" placeholder="mail@example.com" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Phone</label>
                    <input required type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none outline-none dark:text-white font-bold" placeholder="+880..." />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={uploading} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 active:scale-95 transition-all disabled:opacity-50">
                <Save size={18} className="inline mr-2" /> {editingId ? 'Push Update' : 'Finalize Profile'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;