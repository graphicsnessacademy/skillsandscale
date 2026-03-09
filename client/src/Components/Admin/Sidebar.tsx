import React, { useState } from 'react'; // 1. Added React import
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users2, BookOpen, Briefcase, UserSquare2,
  GraduationCap, Mail, Bell, ShieldCheck, Settings, LogOut,
  ChevronRight, FolderKanban
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from './ConfirmModal';

// 2. Updated Interface using React.ReactNode (More stable than JSX namespace)
interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  isComingSoon?: boolean;
  masterOnly?: boolean;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const Sidebar = () => {
  const { user, logout } = useAuth();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const menuGroups: MenuGroup[] = [
    {
      title: "Main",
      items: [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={18} /> },
        { name: 'CRM', path: '#', icon: <Users2 size={18} />, isComingSoon: true },
      ]
    },
    {
      title: "Academy & Agency",
      items: [
        { name: 'Courses', path: '/admin/courses', icon: <BookOpen size={18} /> },
        { name: 'Projects', path: '/admin/projects', icon: <FolderKanban size={18} /> },
        { name: 'Services', path: '/admin/services', icon: <Briefcase size={18} /> },
        { name: 'Team', path: '/admin/team', icon: <UserSquare2 size={18} /> },
        { name: 'Students', path: '/admin/students', icon: <GraduationCap size={18} /> },
      ]
    },
    {
      title: "Communication",
      items: [
        { name: 'Messages', path: '/admin/messages', icon: <Mail size={18} /> },
        { name: 'Notifications', path: '/admin/notifications', icon: <Bell size={18} /> },
      ]
    },
    {
      title: "System",
      items: [
        { name: 'Sub-Admins', path: '/admin/staff', icon: <ShieldCheck size={18} />, masterOnly: true },
      ]
    }
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0f172a] text-slate-400 border-r border-slate-800 z-50 flex flex-col font-sans">
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        title="Terminate Session?"
        message="Are you sure you want to log out?"
        onConfirm={logout}
        onCancel={() => setLogoutModalOpen(false)}
        type="danger"
      />

      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
            <img
              src="/favicon.svg"
              alt="SkillsandScale Logo"
              className="w-5 h-5 object-contain"
            />
          </div>
          <div>
            <h2 className="text-white font-bold leading-tight tracking-tight">SkillsandScale</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Business OS</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-8 overflow-y-auto custom-scrollbar">
        {menuGroups.map((group, groupIdx) => {
          const visibleItems = group.items.filter(item => !item.masterOnly || user?.role === 'master-admin');
          if (visibleItems.length === 0) return null;

          return (
            <div key={groupIdx} className="space-y-2">
              <h3 className="px-4 text-[10px] font-black uppercase text-slate-600 tracking-widest">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  if (item.masterOnly && user?.role !== 'master-admin') return null;

                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === '/admin'}
                      onClick={(e) => item.isComingSoon && e.preventDefault()}
                      className={({ isActive }) => `
                        flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 group
                        ${isActive && item.path !== '#'
                          ? 'bg-indigo-600/10 text-indigo-400 font-semibold'
                          : 'hover:bg-slate-800/50 hover:text-slate-200'}
                        ${item.isComingSoon ? 'cursor-not-allowed opacity-40' : ''}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="transition-colors duration-200">{item.icon}</span>
                        <span className="text-sm">{item.name}</span>
                      </div>

                      {item.isComingSoon ? (
                        <span className="text-[8px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-bold border border-slate-700 uppercase tracking-tighter">Soon</span>
                      ) : (
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-4 bg-[#020617]/50 border-t border-slate-800 space-y-1">
        <NavLink
          to="/admin/settings"
          className={({ isActive }) => `
            flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl transition-all
            ${isActive ? 'bg-slate-800 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}
          `}
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        <button
          onClick={() => setLogoutModalOpen(true)}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium rounded-xl text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}</style>
    </aside>
  );
};

export default Sidebar;