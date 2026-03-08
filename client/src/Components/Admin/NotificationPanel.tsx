import { useState, useEffect, useRef } from 'react'; // Removed 'React'
import { useNavigate } from 'react-router-dom';
import {
    Bell,
    ShieldAlert,
    ShoppingBag,
    GraduationCap,
    Clock,
    CheckCheck,
    Circle
} from 'lucide-react'; // Removed 'CheckCircle2'
import api from '../../utils/api';

const NotificationPanel = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const panelRef = useRef<HTMLDivElement>(null);

    // 1. Fetch Logic
    const fetchNotifications = async () => {
        try {
            const res = await api.get('/admin/notifications');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (err) {
            console.error("Notification Sync Failed");
        }
    };

    // 2. Setup Auto-Polling (Check every 30s)
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // 3. Handle Outside Click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // 4. Actions
    const handleMarkRead = async (id: string, link: string) => {
        try {
            await api.put(`/admin/notifications/${id}/read`);
            setIsOpen(false);
            fetchNotifications();
            navigate(link);
        } catch (err) { console.error(err); }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put('/admin/notifications/read-all');
            fetchNotifications();
        } catch (err) { console.error(err); }
    };

    // 5. Icon Mapping
    const getMeta = (category: string) => {
        switch (category) {
            case 'business': return { icon: <ShoppingBag size={14} />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
            case 'academic': return { icon: <GraduationCap size={14} />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' };
            case 'security': return { icon: <ShieldAlert size={14} />, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' };
            default: return { icon: <Bell size={14} />, color: 'text-slate-400', bg: 'bg-slate-100 dark:bg-slate-800' };
        }
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* BELL ICON */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2.5 rounded-xl transition-all relative ${isOpen ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
                <Bell size={18} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full text-[8px] font-black text-white flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* DROPDOWN PANEL */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">

                    {/* Header */}
                    <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white">Live Signals</h3>
                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg text-[9px] font-bold">OS v2.4</span>
                        </div>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllRead} className="text-[10px] font-black text-indigo-600 hover:underline uppercase flex items-center gap-1">
                                <CheckCheck size={12} /> Mark All
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? notifications.map((n) => {
                            const meta = getMeta(n.category);
                            return (
                                <div
                                    key={n._id}
                                    onClick={() => handleMarkRead(n._id, n.link)}
                                    className={`p-4 flex gap-4 border-b border-slate-50 dark:border-slate-800/50 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 ${!n.isRead ? 'bg-indigo-50/30 dark:bg-indigo-900/5' : ''}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}>
                                        {meta.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <h4 className={`text-xs font-bold truncate ${n.isRead ? 'text-slate-500' : 'text-slate-900 dark:text-white'}`}>{n.title}</h4>
                                            {!n.isRead && <Circle size={6} className="fill-indigo-500 text-indigo-500 shrink-0 mt-1" />}
                                        </div>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{n.message}</p>
                                        <div className="flex items-center gap-2 mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                            <Clock size={10} /> {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="p-12 text-center">
                                <Bell size={32} className="mx-auto text-slate-200 dark:text-slate-800 mb-2" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Active Signals</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <button
                        onClick={() => { navigate('/admin/notifications'); setIsOpen(false); }}
                        className="w-full p-4 text-[10px] font-black uppercase text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border-t border-slate-100 dark:border-slate-800"
                    >
                        View Full Registry
                    </button>
                </div>
            )}

            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #6366f1; border-radius: 10px; }`}</style>
        </div>
    );
};

export default NotificationPanel;