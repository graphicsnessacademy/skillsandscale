import { useState } from 'react';
import { X, Upload, Loader2, CheckCircle, CreditCard } from 'lucide-react';
import api from '../utils/api';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: { _id: string; title: string; price: string; image: string; nextBatch?: string };
}

const MOBILE_NUMBERS: Record<string, string> = {
  Bkash: '015750 78261 (Merchant)',
  Nagad: '015750 78261 (Merchant)',
};

const BookingModal = ({ isOpen, onClose, course }: BookingModalProps) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    batchNumber: course?.nextBatch || 'Batch-01',
    transactionId: '',
    paymentMethod: 'Bkash',
  });

  if (!isOpen || !course) return null;

  const isOnline = formData.paymentMethod === 'SSLCommerz';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ── Online payment via SSLCommerz ──
      if (isOnline) {
        const res = await api.post('/payment/init', {
          courseId: course._id,
          personalInfo: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          },
          courseInfo: { batchNumber: formData.batchNumber },
        });
        window.location.replace(res.data.url);
        return;
      }

      // ── Manual payment (Bkash / Nagad) ──
      if (!file) {
        setError('Please upload your payment screenshot.');
        setLoading(false);
        return;
      }

      const data = new FormData();
      data.append('courseId', course._id);
      data.append('receipt', file);
      data.append('fullName', formData.fullName);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      data.append('address', formData.address);
      data.append('batchNumber', formData.batchNumber);
      data.append('transactionId', formData.transactionId);
      data.append('paymentMethod', formData.paymentMethod);

      await api.post('/courses/book', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setStep(2);

    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error?.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      if (!isOnline) setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              {step === 1 ? 'Enrollment' : 'Confirmed'}
            </p>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">
              {step === 1 ? 'Secure Your Seat' : 'Booking Received'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">

          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Course info */}
              <div className="flex items-center gap-4 bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                <img src={course.image} alt={course.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div>
                  <p className="text-xs font-black text-slate-800 dark:text-white">{course.title}</p>
                  <p className="text-indigo-600 font-black text-xl">{course.price}</p>
                </div>
              </div>

              {/* Personal info */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Full Name', name: 'fullName', placeholder: 'John Doe', type: 'text' },
                  { label: 'Phone', name: 'phone', placeholder: '017...', type: 'tel' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{f.label}</label>
                    <input
                      required name={f.name} type={f.type}
                      onChange={handleChange} placeholder={f.placeholder}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white text-sm font-semibold"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email</label>
                <input
                  required name="email" type="email"
                  onChange={handleChange} placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white text-sm font-semibold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Address</label>
                <input
                  required name="address"
                  onChange={handleChange} placeholder="Full address"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white text-sm font-semibold"
                />
              </div>

              {/* Payment */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Payment Method</p>

                <select
                  name="paymentMethod"
                  onChange={handleChange}
                  value={formData.paymentMethod}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white text-sm font-bold cursor-pointer mb-3"
                >
                  <option value="Bkash">Bkash (Personal / Merchant)</option>
                  <option value="Nagad">Nagad (Personal / Merchant)</option>
                  <option value="SSLCommerz">Pay Online (SSLCommerz)</option>
                </select>

                {/* Manual payment instructions */}
                {!isOnline && (
                  <>
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 mb-3 flex gap-3">
                      <CreditCard size={18} className="text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-800 dark:text-amber-200">
                        <p className="font-black mb-1">Instructions</p>
                        <p>1. Send <strong>{course.price}</strong> to{' '}
                          <span className="font-mono bg-white dark:bg-black px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-bold">
                            {MOBILE_NUMBERS[formData.paymentMethod]}
                          </span>
                        </p>
                        <p className="mt-0.5">2. Enter your TrxID below and upload the screenshot.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction ID</label>
                        <input
                          required name="transactionId"
                          onChange={handleChange} placeholder="TRX..."
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white text-sm font-bold uppercase tracking-widest"
                        />
                      </div>

                      <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-5 text-center hover:border-indigo-400 transition-colors cursor-pointer group">
                        <input
                          type="file" accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-indigo-500 transition-colors">
                          {file
                            ? <CheckCircle className="text-emerald-500" size={28} />
                            : <Upload size={22} />
                          }
                          <span className="text-[11px] font-black uppercase tracking-widest">
                            {file ? file.name : 'Upload Payment Screenshot'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-900/20 px-4 py-2.5 rounded-xl">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Processing…</>
                  : isOnline ? 'Pay Now Securely' : 'Confirm Booking'
                }
              </button>
            </form>

          ) : (
            // ── Success state (manual only) ──
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle size={40} className="text-emerald-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Booking Received!</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                Your payment details have been submitted. We'll verify and send a confirmation email shortly.
              </p>
              <button
                onClick={onClose}
                className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;