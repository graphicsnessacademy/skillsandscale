import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Shield, Users, Lock, Save, Camera,
    Laptop, Smartphone, Globe, Clock, CheckCircle2,
    Plus, Trash2, Edit, X
} from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
    const { user } = useAuth();
    const location = useLocation();

    // 1. Initial State Logic
    const [activeTab, setActiveTab] = useState(
        location.pathname === '/admin/staff' ? 'staff' : 'profile'
    );
    const [staff, setStaff] = useState<{ _id: string; name: string; email: string; role: string; lastLogin?: string }[]>([]);
    const [loginHistory, setLoginHistory] = useState<{ device: string; browser: string; ip: string; date: Date | string }[]>([]);

    // Forms State
    const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [profileForm] = useState({
        name: user?.name || 'Master Admin',
        email: user?.email || 'admin@skillsandscale.com',
        phone: '+880 1712 345 678',
        role: user?.role === 'master-admin' ? 'System Administrator' : 'Staff Member'
    });
    const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '' });
    const [editingId, setEditingId] = useState<string | null>(null);

    // 2. Sync Tab with URL
    useEffect(() => {
        if (location.pathname === '/admin/staff') {
            // ✅ SECURITY: If not Master Admin, force them to profile tab
            if (user?.role !== 'master-admin') {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setActiveTab('profile');
            } else {
                setActiveTab('staff');
            }
        } else {
            setActiveTab('profile');
        }
    }, [location.pathname, user?.role]);

    // 3. Data Fetching
    const fetchStaff = async () => {
        try {
            const res = await api.get('/settings/staff');
            setStaff(res.data);
        } catch { console.error("Staff Sync Error"); }
    };

    const fetchLoginHistory = async () => {
        try {
            // If backend is ready, fetch. If not, use mock data below.
            const res = await api.get('/settings/login-history');
            setLoginHistory(res.data);
        } catch {
            // Fallback mock data for visual outcome
            setLoginHistory([
                { device: 'Windows PC', browser: 'Chrome', ip: '192.168.1.1', date: new Date() },
                { device: 'iPhone 13', browser: 'Safari', ip: '192.168.1.2', date: new Date(Date.now() - 86400000) }
            ]);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (activeTab === 'staff') fetchStaff();
        if (activeTab === 'profile') fetchLoginHistory();
    }, [activeTab]);

    // 4. Handlers
    const handleStaffSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/settings/staff/${editingId}`, staffForm);
                alert("✅ Profile updated.");
            } else {
                await api.post('/settings/staff', staffForm);
                alert("✅ Sub-Admin created.");
            }
            setStaffForm({ name: '', email: '', password: '' });
            setEditingId(null);
            fetchStaff();
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            alert("❌ " + (error.response?.data?.message || "Failed"));
        }
    };

    const startEdit = (member: { _id: string; name: string; email: string }) => {
        setEditingId(member._id);
        setStaffForm({ name: member.name, email: member.email, password: '' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setStaffForm({ name: '', email: '', password: '' });
    };

    const handleDeleteStaff = async (id: string) => {
        if (confirm("Permanently remove this admin?")) {
            await api.delete(`/settings/staff/${id}`);
            fetchStaff();
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passForm.newPassword !== passForm.confirmPassword) return alert("❌ Passwords do not match.");
        try {
            await api.put('/settings/password', { currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
            alert("✅ Password updated.");
            setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            alert("❌ " + (error.response?.data?.message || "Failed"));
        }
    };

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-500">

            {/* HEADER & TAB SWITCHER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em] mt-1">System Configuration</p>
                </div>

                <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <button onClick={() => setActiveTab('profile')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                        <Shield size={16} /> Profile & Security
                    </button>
                    {user?.role === 'master-admin' && (
                        <button onClick={() => setActiveTab('staff')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'staff' ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            <Users size={16} /> Staff Access
                        </button>
                    )}
                </div>
            </div>

            {/* ==========================
                PROFILE & SECURITY TAB 
            =========================== */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COL: Personal Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 text-center relative overflow-hidden group shadow-sm">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-10 group-hover:opacity-20 transition-all"></div>
                            <div className="relative z-10 mt-4">
                                <div className="w-28 h-28 mx-auto rounded-[2rem] bg-slate-100 dark:bg-slate-800 p-1 cursor-pointer relative group/avatar shadow-lg">
                                    <img src={`https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`} className="w-full h-full rounded-[1.8rem] object-cover" alt="Profile" />
                                    <div className="absolute inset-0 bg-black/40 rounded-[1.8rem] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all text-white"><Camera size={24} /></div>
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-4 tracking-tight">{profileForm.name}</h2>
                                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">{profileForm.role}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold dark:text-white mb-6">Personal Information</h3>
                            <form className="space-y-5">
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-2">Full Name</label><input type="text" value={profileForm.name} readOnly className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none dark:text-white font-bold text-sm" /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-2">Email Address</label><input type="email" value={profileForm.email} readOnly className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none dark:text-white font-bold text-sm" /></div>
                                <div><label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-2">Phone Number</label><input type="text" value={profileForm.phone} readOnly className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none dark:text-white font-bold text-sm" /></div>
                                <button disabled className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] opacity-50 cursor-not-allowed flex items-center justify-center gap-2"><Save size={14} /> Save Changes</button>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COL: Security & Activity */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold dark:text-white mb-6 flex items-center gap-2"><Lock size={20} className="text-indigo-500" /> Security Settings</h3>
                            <form onSubmit={handlePasswordUpdate} className="space-y-6">
                                <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">Current Password</label><input type="password" value={passForm.currentPassword} onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none dark:text-white font-bold" placeholder="••••••••" required /></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">New Password</label><input type="password" value={passForm.newPassword} onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none dark:text-white font-bold" placeholder="••••••••" required /></div>
                                    <div><label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest ml-1">Confirm New Password</label><input type="password" value={passForm.confirmPassword} onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-none outline-none dark:text-white font-bold" placeholder="••••••••" required /></div>
                                </div>
                                <div className="flex justify-end"><button type="submit" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">Update Security</button></div>
                            </form>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold dark:text-white mb-8 flex items-center gap-2"><Globe size={20} className="text-emerald-500" /> Recent Login Activity</h3>
                            <div className="space-y-6">
                                {loginHistory.map((log, idx) => (
                                    <div key={idx} className={`flex items-start gap-4 p-5 rounded-[1.8rem] transition-all ${idx === 0 ? 'bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                        <div className={`p-3 rounded-2xl ${idx === 0 ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                            {log.device === 'Mobile' ? <Smartphone size={24} /> : <Laptop size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">{log.device} - {log.browser} Browser</h4>
                                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wide">IP: {log.ip} • Dhaka, BD</p>
                                                </div>
                                                {idx === 0 && (
                                                    <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                                        <CheckCircle2 size={10} /> Current Session
                                                    </span>
                                                )}
                                            </div>
                                            <div className={`mt-2 flex items-center gap-2 text-[10px] font-bold ${idx === 0 ? 'text-indigo-500' : 'text-slate-400'}`}>
                                                <Clock size={12} /> {new Date(log.date).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================
                STAFF TAB (Add / Edit / Delete)
            =========================== */}
            {activeTab === 'staff' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">

                    <div className="xl:col-span-1">
                        <div className={`p-10 rounded-[2.5rem] border shadow-xl h-fit transition-all ${editingId ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black dark:text-white flex items-center gap-3">
                                    {editingId ? <><Edit className="text-indigo-500" /> Edit Profile</> : <><Plus className="text-emerald-500" /> Grant Access</>}
                                </h3>
                                {editingId && (<button onClick={cancelEdit} className="p-2 bg-white dark:bg-slate-800 rounded-full text-slate-400 hover:text-red-500 transition-colors shadow-sm"><X size={20} /></button>)}
                            </div>
                            <form onSubmit={handleStaffSubmit} className="space-y-6" autoComplete="off">
                                {/* Chrome Workaround: Invisible inputs to absorb autofill */}
                                <input type="text" style={{ display: 'none' }} aria-hidden="true" />
                                <input type="password" style={{ display: 'none' }} aria-hidden="true" />

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter full name"
                                        value={staffForm.name}
                                        onChange={e => setStaffForm({ ...staffForm, name: e.target.value })}
                                        className="w-full p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none dark:text-white font-bold"
                                        required
                                        autoComplete="off"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        value={staffForm.email}
                                        onChange={e => setStaffForm({ ...staffForm, email: e.target.value })}
                                        className="w-full p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none dark:text-white font-bold"
                                        required
                                        autoComplete="off"
                                        name="new_email_no_fill"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 block mb-2">
                                        {editingId ? 'Update Password (Optional)' : 'Temporary Password'}
                                    </label>
                                    <input
                                        type="password"
                                        placeholder={editingId ? "Leave blank to keep current" : "Set password"}
                                        value={staffForm.password}
                                        onChange={e => setStaffForm({ ...staffForm, password: e.target.value })}
                                        className="w-full p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none dark:text-white font-bold"
                                        required={!editingId}
                                        autoComplete="new-password"
                                        name="new_pass_no_fill"
                                    />
                                </div>

                                <button type="submit" className={`w-full py-4 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95 ${editingId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-500 hover:bg-emerald-600'}`}>
                                    {editingId ? 'Update Profile' : 'Create Access Signal'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="xl:col-span-2 space-y-4">
                        {staff.map((s) => (
                            <div key={s._id} className={`bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border flex justify-between items-center group transition-all duration-300 ${editingId === s._id ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-100 dark:border-slate-800 hover:shadow-xl'}`}>
                                <div className="flex items-center gap-5">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-black text-2xl shadow-sm ${s.role === 'master-admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>{s.name[0]}</div>
                                    <div>
                                        <h4 className="font-black dark:text-white text-xl leading-tight tracking-tight">{s.name}</h4>
                                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                            <span className="text-[9px] font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full uppercase tracking-widest">{s.role}</span>
                                            <span className="text-xs font-medium text-slate-400">{s.email}</span>
                                        </div>
                                    </div>
                                </div>
                                {s.role !== 'master-admin' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => startEdit(s)} className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all shadow-sm" title="Edit Profile"><Edit size={20} /></button>
                                        <button onClick={() => handleDeleteStaff(s._id)} className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl hover:bg-red-600 hover:text-white transition-all shadow-sm" title="Revoke Access"><Trash2 size={20} /></button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            )}
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 10px; }`}</style>
        </div>
    );
};

export default Settings;