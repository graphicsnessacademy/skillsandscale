import { useState, useEffect, useRef } from 'react';
import { Upload, Save, Loader2, LayoutGrid, X, Image as ImageIcon, Plus } from 'lucide-react';
import api from '../../utils/api';

interface Project {
  _id: string;
  title: string;
  category: string;
  image: string;
  position: number;
}

const ProjectManager = () => {
  // We manage 6 fixed slots for a perfect Bento Grid
  const SLOTS = [1, 2, 3, 4, 5, 6];

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', category: '' });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch {
      console.error("Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  // Open the modal for a specific slot
  const handleSlotClick = (position: number) => {
    const existing = projects.find(p => p.position === position);
    setSelectedSlot(position);
    setFormData({
      title: existing?.title || '',
      category: existing?.category || ''
    });
    setPreview(existing?.image || null);
    setIsEditorOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create local preview immediately
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    setUploading(true);
    const data = new FormData();

    // 1. Append Text Data
    data.append('position', selectedSlot.toString());
    data.append('title', formData.title);
    data.append('category', formData.category);

    // 2. Append Image (Only if selected from file input)
    if (fileInputRef.current?.files?.[0]) {
      data.append('image', fileInputRef.current.files[0]);
    } else if (!preview) {
      alert("Image is required for the portfolio.");
      setUploading(false);
      return;
    }

    try {
      // Calls your updateProjectSlot controller
      await api.post('/projects', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchProjects();
      setIsEditorOpen(false);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "Upload Failed");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-slate-950"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">

      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bento Grid</h1>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-1">Portfolio Manager</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <LayoutGrid size={16} /> 6 Active Slots
        </div>
      </div>

      {/* THE GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SLOTS.map((slot) => {
          const project = projects.find(p => p.position === slot);

          return (
            <div
              key={slot}
              onClick={() => handleSlotClick(slot)}
              className="group relative h-72 bg-white dark:bg-slate-900 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl"
            >
              {project ? (
                <>
                  <img src={project.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Portfolio" />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute bottom-0 left-0 p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-1">{project.category}</p>
                    <h3 className="text-white font-bold text-xl leading-tight">{project.title}</h3>
                  </div>

                  <div className="absolute top-4 right-4 bg-white/20 text-white w-8 h-8 flex items-center justify-center rounded-full font-black text-xs backdrop-blur-md border border-white/30">
                    {slot}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 transition-colors">
                  <div className="p-4 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-colors">
                    <Plus size={32} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest mt-4">Empty Slot {slot}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsEditorOpen(false)}></div>

          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">

            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
              <div>
                <h2 className="text-2xl font-bold dark:text-white">Slot 0{selectedSlot}</h2>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Portfolio Metadata</p>
              </div>
              <button onClick={() => setIsEditorOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Image Preview / Upload */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-56 bg-slate-100 dark:bg-slate-800 rounded-3xl border-4 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-indigo-500 transition-all relative"
              >
                {preview ? (
                  <>
                    <img src={preview} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                      <p className="text-white font-bold text-xs uppercase flex items-center gap-2"><ImageIcon size={16} /> Change Cover</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400 group-hover:text-indigo-500">
                    <Upload className="mx-auto mb-3 w-10 h-10" />
                    <p className="text-[9px] font-black uppercase tracking-widest">Click to Upload</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Project Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none dark:text-white font-bold text-sm" placeholder="e.g. Fintech App" />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-2 mb-1 block">Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none dark:text-white font-bold text-sm" placeholder="e.g. UI/UX Design" />
                </div>
              </div>

              <button type="submit" disabled={uploading} className="w-full bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                {uploading ? <Loader2 className="animate-spin" /> : <Save size={18} />} {uploading ? 'Processing...' : 'Save to Slot'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;