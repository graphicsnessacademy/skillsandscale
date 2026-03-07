import { Link } from 'react-router-dom';
import { TrendingUp, Palette, Megaphone, Users, CheckCircle } from 'lucide-react';
import PromoImage from '../assets/Image/man.png';

const HeroCard = () => {
  return (
    <>
      <style>{`


  /* --- CUSTOM SOFT FLOAT ANIMATIONS --- */
        @keyframes softFloat {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes softFloatReverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-1.5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }

        @keyframes dashFloat {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        @keyframes barHeight1 {
          0% { height: 45%; }
          25% { height: 60%; }
          50% { height: 35%; }
          75% { height: 55%; }
          100% { height: 45%; }
        }

        @keyframes barHeight2 {
          0% { height: 65%; }
          25% { height: 50%; }
          50% { height: 75%; }
          75% { height: 60%; }
          100% { height: 65%; }
        }

        @keyframes barHeight3 {
          0% { height: 95%; }
          25% { height: 85%; }
          50% { height: 95%; }
          75% { height: 80%; }
          100% { height: 95%; }
        }

        @keyframes barHeight4 {
          0% { height: 55%; }
          25% { height: 40%; }
          50% { height: 65%; }
          75% { height: 50%; }
          100% { height: 55%; }
        }

        .animate-soft {
          animation: softFloat 7s ease-in-out infinite;
        }

        .animate-soft-reverse {
          animation: softFloatReverse 8s ease-in-out infinite;
        }

        .animate-dash {
          animation: dashFloat 10s ease-in-out infinite;
        }

        .animate-bar-1 {
          animation: barHeight1 3s ease-in-out infinite;
        }

        .animate-bar-2 {
          animation: barHeight2 3.5s ease-in-out infinite;
        }

        .animate-bar-3 {
          animation: barHeight3 4s ease-in-out infinite;
        }

        .animate-bar-4 {
          animation: barHeight4 3.2s ease-in-out infinite;
        }


        .image-container {
          top: 55%; 
          left: 50%;
          transform: translate(-50%, -52%); 
          width: 580px; /* Increased size slightly */
          pointer-events: none;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image-container img {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 20px 30px rgba(0,0,0,0.15));
        }

        .image-mask {
          mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black 85%, transparent 100%);
        }
      `}</style>

      {/* Main Wrapper: Increased mobile height to fit the larger scale */}
      <div className="hero-visual-wrapper relative flex justify-center items-center h-[480px] xs:h-[520px] sm:h-[600px] md:h-[500px] w-full overflow-visible">

        {/* THE SCALER: Increased mobile scale from 0.55 to 0.75 for a larger look */}
        <div className="visual-scaler relative w-[500px] h-[500px] origin-center scale-[0.75] xs:scale-[0.85] sm:scale-[0.9] md:scale-100 transition-all duration-500">

          {/* --- MAN IMAGE --- */}
          <div className="image-container absolute z-30 image-mask">
            <img src={PromoImage} alt="Skills and Scale Promo" />
          </div>

          {/* --- MAIN DASHBOARD --- */}
          <div className="main-dashboard absolute inset-10 bg-white dark:bg-gray-800 rounded-[40px] border border-slate-100 dark:border-gray-700 p-8 shadow-[0_40px_100px_rgba(0,0,0,0.1)] dark:shadow-black/40 flex flex-col justify-between overflow-hidden z-10 animate-dash">
            <div className="card-inner-grid absolute inset-0 opacity-[0.10] bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <div className="dash-top flex justify-between items-center relative z-10">
              <div className="browser-dots flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
              </div>
              <div className="dash-tag bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[9px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                Dashboard
              </div>
            </div>

            <div className="dash-chart flex items-end justify-between gap-3 h-80 mt-6 relative z-10 overflow-hidden rounded-lg">
              <div className="relative z-20 bar w-full bg-fuchsia-100 dark:bg-gray-700 rounded-t-xl h-[45%] animate-bar-1"></div>
              <div className="relative z-20 bar w-full bg-fuchsia-100 dark:bg-gray-700 rounded-t-xl h-[65%] animate-bar-2"></div>
              <div className="relative z-20 bar w-full bg-gradient-to-t from-brand-magenta to-brand-violet rounded-t-xl h-[95%] shadow-lg shadow-brand-magenta/30 flex justify-center group animate-bar-3">
                <div className="percentage-tag absolute -top-10 bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold">+124%</div>
                <TrendingUp className="text-white/60 mt-3 w-5 h-5" />
              </div>
              <div className="relative z-20 bar w-full bg-fuchsia-100 dark:bg-gray-700 rounded-t-xl h-[55%] animate-bar-4"></div>
            </div>
          </div>

          {/* --- SATELLITES: Pushed further out (more negative values) to reduce crowding --- */}

          {/* Creative - Pushed further left */}
          <div className="sat absolute top-20 -left-16 bg-white/80 dark:bg-gray-800 p-4 rounded-[22px] shadow-xl border border-slate-50 dark:border-gray-700 flex flex-col items-center gap-2 z-20 animate-soft">
            <div className="sat-icon bg-pink-50 dark:bg-pink-900/30 text-pink-500 p-2.5 rounded-xl">
              <Palette size={20} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-[10px] text-slate-500 dark:text-gray-400/70">Creative</span>
          </div>

          {/* Hire Badge - Pushed further right */}
          <div className="absolute top-0 -right-16 z-20 animate-soft-reverse">
            <Link to="/contact" className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2 pl-2 pr-5 rounded-full border-4 border-white dark:border-gray-900 shadow-xl">
              <div className="bg-blue-600 text-white p-2 rounded-full"><Users size={16} /></div>
              <div className="flex flex-col leading-none">
                <small className="text-[8px] opacity-60 font-bold uppercase">Status</small>
                <strong className="text-xs font-bold">Hire Agency</strong>
              </div>
            </Link>
          </div>

          {/* Strategy - Pushed further right/down */}
          <div className="sat absolute bottom-16 -right-14 bg-white/80 dark:bg-gray-800/80 p-4 rounded-[22px] shadow-xl border border-slate-50 dark:border-gray-700 flex flex-col items-center gap-2 z-30 backdrop-blur-md animate-soft-reverse">
            <div className="sat-icon bg-orange-50 dark:bg-orange-900/30 text-orange-500 p-2.5 rounded-xl">
              <Megaphone size={20} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-[10px] text-slate-500 dark:text-gray-400">Strategy</span>
          </div>

          {/* Projects - Pushed further left/down */}
          <div className="sat absolute bottom-0 -left-20 bg-white/80 dark:bg-gray-800/80 px-5 py-3 rounded-[22px] shadow-xl border border-slate-50 dark:border-gray-700 flex flex-col items-start gap-2 z-50 backdrop-blur-md animate-soft">
            <div className="flex items-center gap-2 text-emerald-500">
              <CheckCircle size={16} fill="currentColor" className="text-emerald-100 dark:text-emerald-900" />
              <strong className="text-slate-800 dark:text-white font-bold text-sm">320+ Projects</strong>
            </div>
            <div className="flex items-center pl-2">
              <img src="https://i.pravatar.cc/100?u=a" className="w-7 h-7 rounded-full border-2 border-white -ml-2" />
              <img src="https://i.pravatar.cc/100?u=b" className="w-7 h-7 rounded-full border-2 border-white -ml-2" />
              <div className="w-7 h-7 rounded-full border-2 border-white -ml-2 bg-slate-100 flex items-center justify-center text-[9px] font-bold">+42</div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default HeroCard;