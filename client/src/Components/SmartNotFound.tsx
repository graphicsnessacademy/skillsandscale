import { useLocation, Link } from 'react-router-dom';
import NotFound from '../Pages/NotFound';
import { AlertOctagon, LayoutDashboard, ArrowLeft } from 'lucide-react';

/**
 * Smart 404 Component
 * Shows fancy NotFound page for public routes
 * Shows an OS System Error for admin routes
 */
const SmartNotFound = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    // --- ADMIN SYSTEM ERROR UI ---
    if (isAdminRoute) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] p-4">

                <div className="bg-white dark:bg-slate-900  dark:border-slate-800 rounded-[2.5rem] p-10 md:p-14 max-w-2xl w-full text-center animate-in zoom-in-95 duration-500">

                    {/* Error Icon */}
                    <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-red-100 dark:border-red-900/30">
                        <AlertOctagon size={48} className="text-red-500" />
                    </div>

                    {/* System Badge */}
                    <div className="inline-block bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-lg mb-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 font-mono">
                            System Error 404
                        </p>
                    </div>

                    {/* Content */}
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                        Directory Not Found
                    </h2>

                    <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                        The administrative path <span className="text-indigo-600 dark:text-indigo-400 font-mono bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded font-bold break-all">{location.pathname}</span> does not exist within the Business OS registry.
                    </p>

                    {/* Action Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/admin"
                            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-95"
                        >
                            <LayoutDashboard size={18} /> Return to OS
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                        >
                            <ArrowLeft size={18} /> Go Back
                        </button>
                    </div>

                </div>

                {/* Background Tech Footer */}
                <div className="absolute bottom-8 text-[10px] font-black tracking-[0.4em] text-slate-400 dark:text-slate-700 uppercase pointer-events-none">
                    SkillsandScale Admin OS • Security Catch
                </div>
            </div>
        );
    }

    // --- PUBLIC FANCY 404 UI ---
    return <NotFound />;
};

export default SmartNotFound;