import { useState } from 'react';
import { Mail, Phone, Check, Loader2, Send } from 'lucide-react';
import api from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', company: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!captchaChecked) {
      alert("Please verify that you're not a robot!");
      return;
    }

    setLoading(true);
    try {
      await api.post('/messages/send', formData);
      setSent(true);
      setFormData({ name: '', email: '', company: '', message: '' });
      setCaptchaChecked(false);
      setTimeout(() => setSent(false), 5000);
    } catch {
      alert("Failed to send signal. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-40 pb-16 bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="max-w-6xl mx-auto bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">

            {/* --- LEFT SECTION: INFO --- */}
            <div className="flex-1 pt-8">
              <span className="text-blue-600 dark:text-blue-500 font-extrabold tracking-widest text-sm uppercase mb-4 block">
                Contact Us
              </span>
              <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight font-hind-siliguri">
                আজই যোগাযোগ করুন
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 leading-relaxed max-w-md font-noto-sans-bengali">
                আমরা আপনার প্রশ্ন এবং মতামত শুনতে ভালোবাসি - এবং সাহায্য করতে সর্বদা প্রস্তুত! আমাদের সাথে যোগাযোগের কিছু উপায় এখানে দেওয়া হলো।
              </p>

              {/* Info Cards */}
              <div className="flex flex-col gap-5 mb-12">
                {/* Email Card */}
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-transform hover:-translate-y-1 duration-300">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Mail size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide font-hind-siliguri">ইমেইল</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white font-noto-sans-bengali">
                      <a href="mailto:contact@skillsandscale.com"> contact@skillsandscale.com</a></span>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 transition-transform hover:-translate-y-1 duration-300">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Phone size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide font-hind-siliguri">ফোন</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white font-noto-sans-bengali"> <a href="tel: +8801771-276083">(+880) 1771-276083</a></span>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 font-hind-siliguri">আমাদের সোশ্যাল মিডিয়া:</span>
                <div className="flex gap-3">

                  {/* Twitter / X */}
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>

                  {/* Facebook */}
                  <a href="#" className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 flex items-center justify-center hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-300">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>

                </div>
              </div>
            </div>

            {/* --- RIGHT SECTION: FORM --- */}
            <div className="flex-1 bg-gray-50 dark:bg-gray-800 p-8 md:p-10 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden">
              {sent && (
                <div className="absolute inset-0 z-20 bg-blue-600 flex flex-col items-center justify-center text-white animate-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <Check size={40} />
                  </div>
                  <h3 className="text-2xl font-bold font-hind-siliguri">মেসেজ পাঠানো হয়েছে!</h3>
                  <p className="text-blue-100 font-bold mt-2 font-noto-sans-bengali">আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Your name"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Your email address"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Company (optional)</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Company name"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Leave us a message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all h-32 resize-none"
                  ></textarea>
                </div>

                {/* ReCAPTCHA Mock */}
                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-3 flex justify-between items-center w-full max-w-[300px]">
                  <div className="flex items-center gap-3">
                    <div
                      onClick={() => setCaptchaChecked(!captchaChecked)}
                      className="w-6 h-6 border-2 border-gray-300 dark:border-gray-500 rounded flex items-center justify-center bg-white cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <Check size={14} className={`text-blue-600 transition-opacity ${captchaChecked ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">I'm not a robot</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="captcha" className="w-8 opacity-70" />
                    <span className="text-[9px] text-gray-500">reCAPTCHA</span>
                    <span className="text-[8px] text-gray-400">Privacy - Terms</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 mt-2 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;