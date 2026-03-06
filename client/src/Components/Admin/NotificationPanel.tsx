// client/src/components/Admin/NotificationPanel.tsx

import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Bell, UserPlus, Mail, Award, AlertTriangle,
    ShieldAlert, Settings, Trash2, CheckCheck, X, Loader2
} from 'lucide-react';
import api from '../../utils/api';
import type { INotification, NotificationCategory } from '../../types/notification';

// ── Category config ───────────────────────────────────────────────────────
const CATEGORY_CONFIG: Record<NotificationCategory, {
    label: string;
    dot: string;
    bg: string;
    text: string;
    border: string;
}> = {
    business: {
        label: 'Business',
        dot: 'bg-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-600 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800',
    },
    academic: {
        label: 'Academic',
        dot: 'bg-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
    },
    security: {
        label: 'Security',
        dot: 'bg-rose-500',
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        text: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
    },
};

// ── Icon by title keyword ─────────────────────────────────────────────────
const getIcon = (title: string, category: NotificationCategory) => {
    const t = title.toLowerCase();
    if (t.includes('enrollment')) return <UserPlus size={15} />;
    if (t.includes('inquiry') || t.includes('message')) return <Mail size={15} />;
    if (t.includes('certificate')) return <Award size={15} />;
    if (t.includes('seat')) return <AlertTriangle size={15} />;
    if (t.includes('admin')) return <Settings size={15} />;
    if (t.includes('login') || t.includes('failed')) return <ShieldAlert size={15} />;
    if (category === 'security') return <ShieldAlert size={15} />;
    if (category === 'academic') return <Award size={15} />;
    return <Bell size={15} />;
};

// ── Time formatter ────────────────────────────────────────────────────────
const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

// ── Tab type ──────────────────────────────────────────────────────────────
type Tab = 'all' | NotificationCategory;

// ── Main Component ────────────────────────────────────────────────────────
const NotificationPanel = () => {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [activeTab, setActiveTab] = useState<Tab>('all');
    const [loading, setLoading] = useState(false);
    const [marking, setMarking] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // ── Fetch ───────────────────────────────────────────────────────────────
    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/notifications');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 60 seconds for new notifications
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    // ── Close on outside click ──────────────────────────────────────────────
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Mark single as read + navigate ─────────────────────────────────────
    const handleClick = async (n: INotification) => {
        if (!n.isRead) {
            await api.patch(`/admin/notifications/${n._id}/read`);
            setNotifications(prev =>
                prev.map(x => x._id === n._id ? { ...x, isRead: true } : x)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
        setOpen(false);
        navigate(n.link);
    };

    // ── Mark all as read ────────────────────────────────────────────────────
    const handleMarkAllRead = async () => {
        setMarking(true);
        try {
            await api.patch('/admin/notifications/read-all');
            setNotifications(prev => prev.map(x => ({ ...x, isRead: true })));
            setUnreadCount(0);
        } finally {
            setMarking(false);
        }
    };

    // ── Delete ──────────────────────────────────────────────────────────────
    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        await api.delete(`/admin/notifications/${id}`);
        const deleted = notifications.find(n => n._id === id);
        setNotifications(prev => prev.filter(n => n._id !== id));
        if (deleted && !deleted.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
    };

    // ── Filtered list ───────────────────────────────────────────────────────
    const filtered = activeTab === 'all'
        ? notifications
        : notifications.filter(n => n.category === activeTab);

    const TABS: { key: Tab; label: string; dot?: string }[] = [
        { key: 'all', label: 'All' },
        { key: 'business', label: 'Business', dot: 'bg-emerald-500' },
        { key: 'academic', label: 'Academic', dot: 'bg-amber-500' },
        { key: 'security', label: 'Security', dot: 'bg-rose-500' },
    ];

    return (
        <div ref={panelRef} className="relative">

            {/* ── Bell Button ── */}
            <button
                onClick={() => setOpen(prev => !prev)}
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-900">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {/* ── Panel ── */}
            {open && (
                <div className="absolute right-0 top-14 w-[380px] bg-white dark:bg-slate-900 rounded-[1.75rem] border border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/60 dark:shadow-slate-900/60 overflow-hidden z-50"
                    style={{ animation: 'dropIn 0.2s cubic-bezier(0.23,1,0.32,1) both' }}
                >
                    <style>{`
            @keyframes dropIn {
              from { opacity: 0; transform: translateY(-8px) scale(0.97); }
              to   { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

                    {/* Header */}
                    <div className="px-5 pt-5 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">
                                    Notifications
                                </h3>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                    {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        disabled={marking}
                                        className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors disabled:opacity-50"
                                    >
                                        {marking
                                            ? <Loader2 size={11} className="animate-spin" />
                                            : <CheckCheck size={11} />
                                        }
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1">
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${activeTab === tab.key
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    {tab.dot && <span className={`w-1.5 h-1.5 rounded-full ${tab.dot}`} />}
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* List */}
                    <div className="overflow-y-auto max-h-[380px]">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="animate-spin text-indigo-600 w-6 h-6" />
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300">
                                    <Bell size={22} />
                                </div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No notifications</p>
                            </div>
                        ) : (
                            <div className="p-2 space-y-1">
                                {filtered.map(n => {
                                    const cfg = CATEGORY_CONFIG[n.category];
                                    return (
                                        <div
                                            key={n._id}
                                            onClick={() => handleClick(n)}
                                            className={`group relative flex items-start gap-3 p-3.5 rounded-2xl cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/60 ${!n.isRead ? 'bg-slate-50/80 dark:bg-slate-800/40' : ''
                                                }`}
                                        >
                                            {/* Unread dot */}
                                            {!n.isRead && (
                                                <span className="absolute top-4 left-2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                                            )}

                                            {/* Icon */}
                                            <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                                {getIcon(n.title, n.category)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-xs font-black truncate ${!n.isRead ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                        {n.title}
                                                    </p>
                                                    <span className={`shrink-0 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                                                    {n.message}
                                                </p>
                                                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                                                    {timeAgo(n.createdAt)}
                                                </p>
                                            </div>

                                            {/* Delete */}
                                            <button
                                                onClick={e => handleDelete(e, n._id)}
                                                className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-300 hover:text-rose-500 transition-all"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => { setOpen(false); navigate('/admin/notifications'); }}
                                className="w-full text-center text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                            >
                                View all notifications →
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;