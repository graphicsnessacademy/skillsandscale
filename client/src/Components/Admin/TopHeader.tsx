// client/src/components/Admin/TopHeader.tsx

import { Search, Moon, Sun, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';


const TopHeader = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );
  const [searchVal, setSearchVal] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // ── Theme toggle ──────────────────────────────────────────────────────
  const toggleTheme = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };


  // ── Close profile dropdown on outside click ───────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Search submit ─────────────────────────────────────────────────────
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
  };

  // ── Read admin info from localStorage ────────────────────────────────
  const storedUser = localStorage.getItem('skillsandscale_user');
  const adminName = storedUser ? JSON.parse(storedUser)?.name ?? 'Admin' : 'Admin';
  const adminRole = storedUser ? JSON.parse(storedUser)?.role ?? '' : '';

  const handleLogout = () => {
    localStorage.removeItem('skillsandscale_user');
    navigate('/admin/login');
  };

  return (
    <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-8 flex items-center justify-between gap-6 transition-colors">

      {/* ── Search ── */}
      <form
        onSubmit={handleSearch}
        className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 focus-within:border-indigo-400 dark:focus-within:border-indigo-500 transition-colors"
      >
        <Search size={16} className="text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchVal}
          onChange={e => setSearchVal(e.target.value)}
          placeholder="Search students, courses..."
          className="bg-transparent border-none outline-none text-sm w-full dark:text-white placeholder:text-slate-400 font-medium"
        />
      </form>

      {/* ── Right controls ── */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <NotificationPanel />

        {/* Profile dropdown */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(prev => !prev)}
            className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="text-right hidden md:block">
              <p className="text-xs font-black text-slate-800 dark:text-white leading-tight">{adminName}</p>
              {adminRole && (
                <p className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest leading-tight">{adminRole}</p>
              )}
            </div>
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(adminName)}&background=6366f1&color=fff&bold=true`}
              className="w-9 h-9 rounded-xl border-2 border-indigo-200 dark:border-indigo-800"
              alt="Profile"
            />
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown */}
          {profileOpen && (
            <div
              className="absolute right-0 top-14 w-52 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-50"
              style={{ animation: 'dropIn 0.15s cubic-bezier(0.23,1,0.32,1) both' }}
            >
              <style>{`
                @keyframes dropIn {
                  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
                  to   { opacity: 1; transform: translateY(0) scale(1); }
                }
              `}</style>

              {/* User info */}
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-black text-slate-900 dark:text-white">{adminName}</p>
                <p className="text-[10px] text-slate-400 font-medium capitalize">{adminRole}</p>
              </div>

              {/* Menu items */}
              <div className="p-1.5">
                {[
                  { label: 'My Profile', path: '/admin/settings' },
                  { label: 'Settings', path: '/admin/settings' },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={() => { setProfileOpen(false); navigate(item.path); }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="p-1.5 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;