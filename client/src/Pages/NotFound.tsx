import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0f172a] relative flex items-center justify-center overflow-hidden p-4">

      {/* --- SUBTLE BACKGROUND GLOWS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-indigo-400/10 dark:bg-purple-600/20 rounded-full blur-[100px] md:blur-[128px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-400/10 dark:bg-indigo-600/20 rounded-full blur-[100px] md:blur-[128px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="relative z-10 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">

        {/* The 404 Typography */}
        <h1 className="py-6 text-[10rem] md:text-[15rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-300 to-slate-400 dark:from-white dark:to-slate-600 drop-shadow-sm select-none">
          404
        </h1>

        {/* Messages */}
        <div className="space-y-4 -mt-8 md:-mt-12 mb-10 px-4">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Page Not Found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base md:text-lg max-w-lg mx-auto leading-relaxed font-medium">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto px-6">
          <Link
            to="/"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#81007F] to-[#4B0081] text-white rounded-2xl font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-900/20 flex items-center justify-center gap-2"
          >
            <Home size={18} /> Return Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-2xl font-bold uppercase tracking-widest text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group backdrop-blur-sm"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Go Back
          </button>
        </div>

      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-[10px] font-black tracking-[0.3em] text-slate-400 dark:text-slate-600 uppercase text-center w-full pointer-events-none">
        SkillsandScale OS • Error Catch
      </div>

    </main>
  );
};

export default NotFound;