import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const trxId = searchParams.get('trx');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 p-10 text-center">

        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="text-emerald-500 w-10 h-10" />
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500 mb-2">Payment Successful</p>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
          Your seat is confirmed!
        </h1>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          A confirmation email has been sent to you. Welcome to the academy.
        </p>

        {trxId && (
          <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 mb-6">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Transaction ID</p>
            <p className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400 break-all">{trxId}</p>
          </div>
        )}

        <div className="space-y-2">
          <Link
            to="/courses"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
          >
            Browse More Courses <ArrowRight size={15} />
          </Link>
          <Link
            to="/"
            className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <Home size={15} /> Return Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default PaymentSuccess;