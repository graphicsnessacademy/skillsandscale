import { useState, useEffect } from 'react';
import {
  Mail, Trash2, Clock,
  Loader2, ArrowRight, CheckCircle2, MessageSquare
} from 'lucide-react';
import api from '../../utils/api';
import ConfirmModal from '../../Components/Admin/ConfirmModal';

interface MessageData {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  status: 'new' | 'replied';
  message: string;
  company?: string;
}

const MessageManager = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [stats, setStats] = useState({ total: 0, unread: 0 });
  const [filter, setFilter] = useState('all'); // 'all', 'new', 'replied'
  const [loading, setLoading] = useState(true);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, title: "", message: "", type: 'warning' as 'warning' | 'danger', onConfirm: () => { } });

  const fetchMessages = async () => {
    try {
      const res = await api.get('/messages');
      setMessages(res.data.data);
      setStats({
        total: res.data.data.length,
        unread: res.data.unread
      });
    } catch { console.error("Signal Lost"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await api.put(`/messages/${id}/status`, { status: newStatus });
      fetchMessages();
    } catch { alert("Status update failed"); }
  };

  const handleDelete = (id: string) => {
    setModalConfig({
      isOpen: true,
      title: "Purge Signal?",
      message: "This inquiry will be permanently deleted from the CRM.",
      type: 'danger',
      onConfirm: async () => {
        await api.delete(`/messages/${id}`);
        fetchMessages();
        setModalConfig(m => ({ ...m, isOpen: false }));
      }
    });
  };

  // Filter Logic
  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    return msg.status === filter;
  });

  if (loading) return <div className="h-screen flex items-center justify-center dark:bg-slate-950"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500">
      <ConfirmModal {...modalConfig} onCancel={() => setModalConfig({ ...modalConfig, isOpen: false })} />

      {/* HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Inquiries</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">CRM Communication Hub</p>
        </div>

        <div className="flex gap-4">
          <div className="text-right">
            <h2 className="text-3xl font-black text-indigo-600 dark:text-indigo-400 leading-none">{stats.unread}</h2>
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Pending</p>
          </div>
          <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-800"></div>
          <div className="text-right">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-none">{stats.total}</h2>
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Total</p>
          </div>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['all', 'new', 'replied'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all whitespace-nowrap ${filter === f
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg'
              : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800 hover:border-indigo-500'
              }`}
          >
            {f} Signals
          </button>
        ))}
      </div>

      {/* MESSAGE GRID */}
      <div className="grid grid-cols-1 gap-6">
        {filteredMessages.length > 0 ? filteredMessages.map((msg) => (
          <div key={msg._id} className={`bg-white dark:bg-slate-900 rounded-[2rem] border p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden ${msg.status === 'new' ? 'border-l-[6px] border-l-indigo-500 border-y-slate-100 border-r-slate-100 dark:border-y-slate-800 dark:border-r-slate-800' : 'border-slate-100 dark:border-slate-800 opacity-80 hover:opacity-100'}`}>

            {/* Status Badge */}
            <div className="absolute top-8 right-8">
              <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${msg.status === 'new' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                }`}>
                {msg.status === 'new' ? 'Awaiting Reply' : 'Resolved'}
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
              {/* Left: Avatar & Info */}
              <div className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-indigo-500/30">
                    {msg.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white leading-tight">{msg.name}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{msg.company || 'Personal'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Mail size={14} className="text-indigo-500" /> {msg.email}</div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Clock size={14} className="text-indigo-500" /> {new Date(msg.createdAt).toLocaleDateString()}</div>
                </div>
              </div>

              {/* Right: Content & Actions */}
              <div className="flex-1 flex flex-col justify-between">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6 text-sm">
                  "{msg.message}"
                </p>

                <div className="flex gap-3">
                  <a
                    href={`mailto:${msg.email}`}
                    onClick={() => handleStatusUpdate(msg._id, 'replied')}
                    className="flex-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest text-center flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
                  >
                    <ArrowRight size={14} /> Reply via Email
                  </a>

                  {msg.status === 'new' && (
                    <button
                      onClick={() => handleStatusUpdate(msg._id, 'replied')}
                      className="px-4 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-200"
                      title="Mark as Handled"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="px-4 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all border border-red-200"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )) : (
          <div className="p-20 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem]">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <MessageSquare size={32} />
            </div>
            <p className="text-slate-400 font-black uppercase tracking-[0.2em]">Inbox Zero • No Signals Found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageManager;