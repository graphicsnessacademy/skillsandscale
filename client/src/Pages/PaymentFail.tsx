import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCcw, Home } from 'lucide-react';

const REASONS: Record<string, string> = {
  not_found:    'Enrollment record not found. Please try booking again.',
  server_error: 'A server error occurred. Please contact support.',
  cancelled:    'Payment was cancelled. You can try again anytime.',
};

const PaymentFail = () => {
  const [searchParams] = useSearchParams();
  const reason = searchParams.get('reason') ?? '';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 p-10 text-center">

        <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="text-rose-500 w-10 h-10" />
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-rose-500 mb-2">Payment Failed</p>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
          Transaction Unsuccessful
        </h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          {REASONS[reason] || "We couldn't process your payment. Please try again or use a different method."}
        </p>

        <div className="space-y-2">
          <Link
            to="/courses"
            className="w-full bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCcw size={15} /> Try Again
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

export default PaymentFail;