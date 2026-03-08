import { useState, useEffect, useRef } from 'react';
import {
  Edit, Trash2, Plus, Clock, X, Save,
  Star, Loader2, Upload, Users
} from 'lucide-react';
import api from '../../utils/api';

interface CourseOutline {
  moduleTitle: string;
  moduleSubtitle: string;
}

interface CourseData {
  _id?: string;
  title: string;
  description: string;
  originalPrice: number;
  discount: number;
  price: string;
  duration: string;
  category: string;
  students: number;
  reviews: number;
  batchName: string;
  nextBatch: string;
  image: string;
  outline: CourseOutline[];
}

const CourseManager = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialForm: CourseData = {
    title: '', description: '',
    originalPrice: 0, discount: 0, price: '৳0',
    duration: '', category: 'Development',
    students: 0, reviews: 0, batchName: '', nextBatch: '', image: '',
    outline: [{ moduleTitle: '', moduleSubtitle: 'বিস্তারিত প্র্যাকটিক্যাল সেশন অন্তর্ভুক্ত।' }]
  };

  const [formData, setFormData] = useState<CourseData>(initialForm);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data);
    } catch { console.error("Sync Error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCourses(); }, []);

  // --- UPDATED PRICE CALCULATION LOGIC ---
  useEffect(() => {
    const orgPrice = formData.originalPrice || 0;
    const disc = formData.discount || 0;

    // Calculate final price
    const discountAmount = (orgPrice * disc) / 100;
    const finalPrice = Math.ceil(orgPrice - discountAmount);

    setFormData(prev => ({ ...prev, price: `৳${finalPrice}` }));
  }, [formData.originalPrice, formData.discount]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOutlineChange = (index: number, field: keyof CourseOutline, value: string) => {
    const newOutline = [...formData.outline];
    newOutline[index] = { ...newOutline[index], [field]: value };
    setFormData({ ...formData, outline: newOutline });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const data = new FormData();

    Object.keys(formData).forEach(key => {
      if (key !== 'outline' && key !== 'image' && key !== '_id') {
        // @ts-expect-error - key indexing is safe here
        data.append(key, formData[key].toString());
      }
    });

    data.append('outline', JSON.stringify(formData.outline));
    if (selectedFile) data.append('image', selectedFile);
    else if (!editingId) { alert("কোর্সের ছবি আপলোড করুন"); setSubmitting(false); return; }

    try {
      if (editingId) await api.put(`/courses/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
      else await api.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } });

      setIsEditorOpen(false);
      resetForm();
      fetchCourses();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      alert(error.response?.data?.message || "Failed");
    }
    finally { setSubmitting(false); }
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
    setImagePreview(null);
    setSelectedFile(null);
  };

  const deleteCourse = async (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত আপনি এই কোর্সটি মুছে ফেলতে চান?")) {
      await api.delete(`/courses/${id}`);
      fetchCourses();
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Course Registry</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and deploy your academy curriculum.</p>
        </div>
        <button onClick={() => { resetForm(); setIsEditorOpen(true); }} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all">
          <Plus size={18} /> Add New Course
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {courses.map((course) => (
          <div key={course._id} className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-3 hover:shadow-2xl transition-all duration-500">
            {/* Image Area */}
            <div className="relative h-48 overflow-hidden rounded-[1.5rem]">
              <img src={course.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                {course.category}
              </div>
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                <button onClick={() => { setEditingId(course._id!); setFormData(course); setImagePreview(course.image); setIsEditorOpen(true); }} className="p-3 bg-white text-slate-900 rounded-xl hover:scale-110 transition-transform"><Edit size={18} /></button>
                <button onClick={() => deleteCourse(course._id!)} className="p-3 bg-white text-red-600 rounded-xl hover:scale-110 transition-transform"><Trash2 size={18} /></button>
              </div>
            </div>

            {/* Info Area */}
            <div className="p-4">
              <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-2 line-clamp-1">{course.title}</h3>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-4">
                <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                <span className="flex items-center gap-1"><Users size={12} /> {course.students}</span>
                <span className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor" /> {course.reviews}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest">ব্যাচ শুরু</span>
                  <span className="text-xs font-bold dark:text-white">{course.nextBatch}</span>
                </div>
                <div className="text-right">
                  {course.discount > 0 && <span className="block text-[10px] text-slate-400 line-through">৳{course.originalPrice}</span>}
                  <span className="text-xl font-black text-indigo-600">{course.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* EDITOR MODAL */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsEditorOpen(false)}></div>

          <form onSubmit={handleSubmit} className="relative w-full max-w-5xl bg-white dark:bg-slate-900 h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">

            {/* Modal Header */}
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
              <div>
                <h2 className="text-3xl font-bold dark:text-white">{editingId ? 'কোর্স পরিবর্তন করুন' : 'নতুন কোর্স তৈরি করুন'}</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-1">কোর্স এডিটর</p>
              </div>
              <button type="button" onClick={() => setIsEditorOpen(false)} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-10 custom-scrollbar">
              {/* LEFT: Details */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">০১. কোর্সের বিবরণ</label>
                  <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none dark:text-white font-bold text-lg" placeholder="কোর্সের নাম লিখুন..." />
                  <textarea required rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none dark:text-white text-sm font-medium resize-none" placeholder="কোর্সের বিস্তারিত বর্ণনা..." />
                </div>

                {/* PRICING SECTION (Auto Calc) */}
                <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30">
                  <label className="text-[10px] font-black uppercase text-indigo-500 tracking-widest ml-1 mb-4 block">০২. প্রাইসিং (টাকা)</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">মূল্য (পূর্বের)</label>
                      <input type="number" value={formData.originalPrice} onChange={e => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) })} className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 text-center font-bold outline-none" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">ডিসকাউন্ট (%)</label>
                      <input type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: parseFloat(e.target.value) })} className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 text-center font-bold outline-none" />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold text-slate-400 uppercase mb-1 block">বর্তমান মূল্য</label>
                      <div className="w-full p-3 rounded-xl bg-indigo-600 text-white text-center font-black">{formData.price}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">সময়কাল</label><input value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 outline-none dark:text-white font-bold" placeholder="যেমন: ১২ সপ্তাহ" /></div>
                  <div><label className="text-[10px] font-black uppercase text-slate-400 ml-1 mb-2 block">ক্যাটাগরি</label><input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 outline-none dark:text-white font-bold" placeholder="Development" /></div>
                </div>
              </div>

              {/* RIGHT: Logistics & Syllabus */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">০৩. মিডিয়া এবং ব্যাচ</label>
                  <div onClick={() => fileInputRef.current?.click()} className="group w-full h-40 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors overflow-hidden relative">
                    {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <div className="text-center"><Upload className="mx-auto mb-2 text-slate-300 group-hover:text-indigo-500" /> <p className="text-[9px] font-black uppercase text-slate-400">কভার ফটো আপলোড করুন</p></div>}
                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">ব্যাচ এর নাম</label>
                      <input value={formData.batchName} onChange={e => setFormData({ ...formData, batchName: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 outline-none dark:text-white font-bold text-center" placeholder="ব্যাচ B-01" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">শুরুর তারিখ</label>
                      <input value={formData.nextBatch} onChange={e => setFormData({ ...formData, nextBatch: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 outline-none dark:text-white font-bold text-center" placeholder="যেমন: ১লা জানুয়ারি" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">ছাত্র সংখ্যা</label>
                      <input type="number" value={formData.students} onChange={e => setFormData({ ...formData, students: parseInt(e.target.value) })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 outline-none dark:text-white font-bold text-center" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">রিভিউ</label>
                      <input type="number" value={formData.reviews} onChange={e => setFormData({ ...formData, reviews: parseInt(e.target.value) })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 outline-none dark:text-white font-bold text-center" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center"><label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">০৪. কোর্স কারিকুলাম</label><button type="button" onClick={() => setFormData({ ...formData, outline: [...formData.outline, { moduleTitle: '', moduleSubtitle: '' }] })} className="text-[10px] font-bold text-indigo-500 uppercase hover:underline">+ নতুন মডিউল</button></div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.outline.map((item, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl group border border-transparent hover:border-indigo-100 dark:hover:border-slate-800">
                        <div className="text-[10px] font-black text-slate-300 mt-2">{(idx + 1).toString().padStart(2, '0')}</div>
                        <div className="flex-1 space-y-1">
                          <input required value={item.moduleTitle} onChange={e => handleOutlineChange(idx, 'moduleTitle', e.target.value)} className="w-full bg-transparent outline-none font-bold text-sm dark:text-white" placeholder="মডিউল নাম" />
                          <input value={item.moduleSubtitle} onChange={e => handleOutlineChange(idx, 'moduleSubtitle', e.target.value)} className="w-full bg-transparent outline-none text-[10px] text-slate-500" placeholder="বিস্তারিত..." />
                        </div>
                        <button type="button" onClick={() => setFormData({ ...formData, outline: formData.outline.filter((_, i) => i !== idx) })} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md flex justify-end">
              <button type="submit" disabled={submitting} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50">
                {submitting ? <Loader2 className="animate-spin" /> : <Save size={18} />} {editingId ? 'আপডেট করুন' : 'সেভ করুন'}
              </button>
            </div>
          </form>
        </div>
      )}
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 10px; } `}</style>
    </div>
  );
};

export default CourseManager;