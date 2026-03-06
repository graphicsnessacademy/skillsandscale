import { useState, useEffect } from 'react';
import api from '../../utils/api';
import {
  TrendingUp, Users, DollarSign, MessageCircle, ShieldCheck,
  Loader2, ArrowUpRight, ArrowDownRight,
  BookOpen, Activity, ChevronRight, Star,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

// ── Types ──────────────────────────────────────────────────────────────────
interface DashboardData {
  totalRevenue: number;
  activeStudents: number;
  totalCourses: number;
  totalServices: number;
  ongoingEnrollments: number;
  pendingCertificates: number;
  unreadMessages: number;
  revenueGrowth: number;
  studentGrowth: number;
  enrollmentGrowth: number;
  revenueChart: { month: string; revenue: number }[];
  trafficChart: { day: string; enrollments: number }[];
  enrollmentMix: { name: string; value: number; color: string }[];
  recentEnrollments: {
    name: string; course: string; amount: string;
    status: string; avatar: string;
  }[];
  topCourses: {
    title: string; students: number; rating: number; revenue: string;
  }[];
}

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (v: number, prefix = '') =>
  v >= 1000 ? `${prefix}${(v / 1000).toFixed(1)}k` : `${prefix}${v}`;

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; dataKey: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white text-xs rounded-xl px-4 py-3 shadow-2xl border border-slate-700">
      <p className="font-black uppercase tracking-widest mb-2 text-slate-400">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-bold">
          {p.name}: {typeof p.value === 'number' && p.value > 999
            ? `$${(p.value / 1000).toFixed(1)}k`
            : p.value}
        </p>
      ))}
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────
const KpiCard = ({ card, index }: { card: { name: string; value: string | number; icon: React.ReactNode; color: string; trend: number | null }; index: number }) => (
  <div
    className="bg-white dark:bg-slate-900 p-5 rounded-[1.75rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300"
    style={{ animationDelay: `${index * 60}ms`, animation: 'fadeSlideUp 0.5s ease both' }}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-2.5 ${card.color} text-white rounded-2xl shadow-lg`}>{card.icon}</div>
      {card.trend !== undefined && card.trend !== null && (
        <span className={`flex items-center gap-0.5 text-[10px] font-black ${card.trend >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {card.trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(card.trend)}%
        </span>
      )}
    </div>
    <h3 className="text-slate-400 text-[9px] font-black uppercase tracking-wider">{card.name}</h3>
    <p className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
      {card.value ?? '—'}
    </p>
  </div>
);

const SectionHeader = ({ icon, title, action }: { icon: React.ReactNode; title: string; action?: string }) => (
  <div className="flex items-center justify-between mb-5">
    <div className="flex items-center gap-2.5">
      <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg">{icon}</div>
      <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm">{title}</h3>
    </div>
    {action && (
      <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">
        {action} <ChevronRight size={12} />
      </button>
    )}
  </div>
);

// ── Dashboard ──────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeChart, setActiveChart] = useState<'revenue' | 'traffic'>('revenue');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setData(res.data);
      } catch (err: unknown) {
        setError('Failed to load dashboard data.');
        const error = err as Error;
        console.error('Dashboard Sync Failed:', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-[#0f172a]">
      <Loader2 className="animate-spin text-indigo-600 w-10 h-10" />
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Loading Control Center…</p>
    </div>
  );

  if (error || !data) return (
    <div className="h-screen flex flex-col items-center justify-center gap-3">
      <p className="text-rose-500 font-black uppercase tracking-widest text-sm">{error || 'No data available'}</p>
      <button onClick={() => window.location.reload()} className="text-indigo-600 text-xs font-bold underline">Retry</button>
    </div>
  );

  const kpiCards = [
    { name: 'Total Revenue', value: `$${fmt(data.totalRevenue)}`, icon: <DollarSign size={18} />, color: 'bg-emerald-500', trend: data.revenueGrowth },
    { name: 'Active Students', value: fmt(data.activeStudents), icon: <Users size={18} />, color: 'bg-blue-500', trend: data.studentGrowth },
    { name: 'Total Courses', value: data.totalCourses, icon: <BookOpen size={18} />, color: 'bg-indigo-500', trend: null },
    { name: 'Pending Certs', value: data.pendingCertificates, icon: <ShieldCheck size={18} />, color: 'bg-orange-500', trend: null },
    { name: 'Enrollments', value: data.ongoingEnrollments, icon: <TrendingUp size={18} />, color: 'bg-rose-500', trend: data.enrollmentGrowth },
    { name: 'Unread Messages', value: data.unreadMessages, icon: <MessageCircle size={18} />, color: 'bg-purple-500', trend: null },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="p-6 space-y-8 bg-slate-50 dark:bg-[#0f172a] min-h-screen">

        {/* ── Page Header ── */}
        <div className="flex items-end justify-between" style={{ animation: 'fadeSlideUp 0.4s ease both' }}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 mb-1">Admin Panel</p>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Control Center</h2>
          </div>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-2xl shadow-sm">
            <Activity size={14} className="text-emerald-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>

        {/* ── KPI Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpiCards.map((card, i) => <KpiCard key={card.name} card={card} index={i} />)}
        </div>

        {/* ── Charts Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Chart */}
          <div
            className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.5s 0.2s ease both' }}
          >
            <div className="flex items-center justify-between mb-6">
              <SectionHeader icon={<TrendingUp size={16} />} title="Analytics Overview" />
              <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                {(['revenue', 'traffic'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveChart(tab)}
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-lg transition-all ${activeChart === tab
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm'
                      : 'text-slate-400 hover:text-slate-600'
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeChart === 'revenue' ? (
              <>
                <div className="flex gap-6 mb-5">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total Revenue</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">${fmt(data.totalRevenue)}</p>
                    <p className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5">
                      <ArrowUpRight size={11} /> +{data.revenueGrowth}% vs last month
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data.revenueChart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </>
            ) : (
              <>
                <div className="flex gap-6 mb-5">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">This Week</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      {data.trafficChart.reduce((s, d) => s + d.enrollments, 0)}{' '}
                      <span className="text-base text-slate-400">enrollments</span>
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.trafficChart} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="enrollments" name="Enrollments" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </div>

          {/* Enrollment Mix Pie */}
          <div
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.5s 0.3s ease both' }}
          >
            <SectionHeader icon={<BookOpen size={16} />} title="Enrollment Mix" />
            {data.enrollmentMix.length === 0 ? (
              <div className="flex items-center justify-center h-40 text-slate-400 text-xs font-bold">No data yet</div>
            ) : (
              <>
                <div className="flex justify-center my-2">
                  <ResponsiveContainer width={180} height={180}>
                    <PieChart>
                      <Pie data={data.enrollmentMix} cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3} dataKey="value">
                        {data.enrollmentMix.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v: number | string | undefined) => `${v}%`}
                        contentStyle={{ borderRadius: 12, fontSize: 11, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2.5 mt-2">
                  {data.enrollmentMix.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400">{item.name}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-800 dark:text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Enrollments */}
          <div
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.5s 0.4s ease both' }}
          >
            <SectionHeader icon={<Users size={16} />} title="Recent Enrollments" action="View All" />
            {data.recentEnrollments.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400 text-xs font-bold">No enrollments yet</div>
            ) : (
              <div className="space-y-2">
                {data.recentEnrollments.map((enr, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-black shrink-0 shadow-md">
                      {enr.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 dark:text-white truncate">{enr.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium truncate">{enr.course}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-black text-slate-800 dark:text-white">{enr.amount}</p>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${enr.status === 'ongoing' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                        enr.status === 'completed' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                          enr.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}>
                        {enr.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Courses */}
          <div
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm"
            style={{ animation: 'fadeSlideUp 0.5s 0.5s ease both' }}
          >
            <SectionHeader icon={<TrendingUp size={16} />} title="Top Courses" action="View All" />
            {data.topCourses.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-slate-400 text-xs font-bold">No course data yet</div>
            ) : (
              <div className="space-y-2">
                {data.topCourses.map((course, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                      #{i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-800 dark:text-white truncate">{course.title}</p>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Users size={9} /> {course.students} students
                      </p>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      <p className="text-xs font-black text-emerald-600">{course.revenue}</p>
                      <p className="text-[10px] font-bold text-amber-500 flex items-center justify-end gap-0.5">
                        <Star size={9} fill="currentColor" /> {course.rating}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;