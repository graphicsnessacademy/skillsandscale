import { useState, useEffect } from 'react';
import { ShieldCheck, Loader2, CheckCircle2, Mail, Calendar, X, Send, Eye } from 'lucide-react';
import ConfirmModal from '../../Components/Admin/ConfirmModal';
import api from '../../utils/api';

interface Enrollment {
  _id: string;
  status: string;
  paymentInfo: { verificationStatus: string; method?: string; mobile?: string; trxId?: string; transactionId?: string; screenshotUrl?: string };
  certification: { isCertified: boolean; serialNumber?: string; issueDate?: string };
  personalInfo: { fullName: string; email: string; phone: string; address?: string };
  amount: number;
  courseId: { title: string };
  createdAt: string;
  receiptSent: boolean;
}

const StudentManager = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { } });
  const [receiptPopup, setReceiptPopup] = useState<{
    isOpen: boolean; html: string; enrollmentId: string; isSending: boolean;
  }>({ isOpen: false, html: '', enrollmentId: '', isSending: false });

  const fetchData = async () => {
    try {
      const res = await api.get('/students/enrollments');
      setEnrollments(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const triggerAction = (title: string, message: string, action: () => Promise<void>) => {
    setConfirm({
      isOpen: true, title, message,
      onConfirm: async () => {
        try {
          await action();
          setConfirm(prev => ({ ...prev, isOpen: false }));
          await fetchData();
        } catch {
          setConfirm(prev => ({ ...prev, isOpen: false }));
        }
      },
    });
  };

  const updateVerificationStatus = async (id: string, status: string) => {
    await api.put(`/students/${id}/verification-status`, { status });
    fetchData();
  };

  const handleReceiptClick = async (id: string) => {
    try {
      const enrollment = enrollments.find(e => e._id === id);
      if (!enrollment) return;
      if (enrollment.paymentInfo.verificationStatus !== 'Verified') {
        alert('Receipts can only be generated for verified payments.');
        return;
      }
      const res = await api.put(`/students/${id}/receipt-preview`);
      setReceiptPopup({ isOpen: true, html: res.data.receiptHTML, enrollmentId: id, isSending: false });
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      alert('❌ ' + (err.response?.data?.message || 'Failed to generate receipt'));
    }
  };

  const sendReceiptEmail = async () => {
    try {
      setReceiptPopup(prev => ({ ...prev, isSending: true }));
      await api.put(`/students/${receiptPopup.enrollmentId}/send-receipt`);
      setReceiptPopup({ isOpen: false, html: '', enrollmentId: '', isSending: false });
      fetchData();
      alert('✅ Receipt email sent successfully!');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      alert('❌ Failed to send receipt: ' + (err.response?.data?.message || err.message));
      setReceiptPopup(prev => ({ ...prev, isSending: false }));
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/students/${id}/status`, { status });
      await fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const toggleCertification = async (id: string) => {
    try {
      await api.put(`/students/${id}/issue-cert`);
      fetchData();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Failed to issue certificate');
    }
  };

  const updateDate = async (id: string, date: string) => {
    await api.put(`/students/${id}/issue-date`, { issueDate: date });
    fetchData();
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-indigo-600" size={48} />
    </div>
  );

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <ConfirmModal
        isOpen={confirm.isOpen}
        title={confirm.title}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={() => setConfirm(prev => ({ ...prev, isOpen: false }))}
      />

      {/* ── Receipt Preview Popup ── */}
      {receiptPopup.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                  <Eye size={16} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Preview</p>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">Receipt Email</h3>
                </div>
              </div>
              <button
                onClick={() => setReceiptPopup({ isOpen: false, html: '', enrollmentId: '', isSending: false })}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            {/* Preview */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <iframe
                  srcDoc={receiptPopup.html}
                  className="w-full border-0"
                  style={{ height: '600px' }}
                  title="Receipt Preview"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-white dark:bg-slate-900">
              <p className="text-[10px] text-slate-400 font-medium">
                This email will be sent to the student's registered email address.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setReceiptPopup({ isOpen: false, html: '', enrollmentId: '', isSending: false })}
                  disabled={receiptPopup.isSending}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendReceiptEmail}
                  disabled={receiptPopup.isSending}
                  className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-60 shadow-lg shadow-emerald-500/20"
                >
                  {receiptPopup.isSending
                    ? <><Loader2 size={14} className="animate-spin" /> Sending…</>
                    : <><Send size={14} /> Send Email</>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">Academic Registry</h1>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-6">Learner Identity</th>
              <th className="px-6 py-6">Payment Proof</th>
              <th className="px-6 py-6">Verification</th>
              <th className="px-6 py-6 text-center">Receipt</th>
              <th className="px-6 py-6">Course Status</th>
              <th className="px-6 py-6">Certification</th>
              <th className="px-6 py-6 text-right">Serial Number</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {enrollments.map((item) => {
              const verificationStatus = item.paymentInfo.verificationStatus;
              const isVerified = verificationStatus === 'verified';
              const isNotVerified = verificationStatus === 'not_verified';
              const isPending = verificationStatus === 'pending';
              const isReceiptSent = item.receiptSent;
              const courseStatus = item.status;
              const isCertified = item.certification.isCertified;
              const hasSerialNumber = !!item.certification.serialNumber;
              const isReceiptActive = isNotVerified || isVerified;
              const isCourseStatusActive = isVerified && isReceiptSent;
              const isCertificationActive = isCourseStatusActive && courseStatus === 'completed';

              return (
                <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">

                  {/* 1. Learner Identity */}
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{item.personalInfo.fullName}</p>
                    <p className="text-[9px] text-slate-500 font-bold">{item.personalInfo.email}</p>
                    <p className="text-[9px] text-slate-400 font-medium">{item.personalInfo.phone}</p>
                  </td>

                  {/* 2. Payment Proof */}
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 text-[9px] font-black uppercase rounded">
                        {item.paymentInfo.method}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-600 dark:text-slate-400">
                        {item.paymentInfo.transactionId}
                      </span>
                    </div>
                    <a href={item.paymentInfo.screenshotUrl} target="_blank" rel="noopener noreferrer"
                      className="text-[9px] text-blue-500 hover:text-blue-600 font-bold uppercase underline">
                      View Screenshot
                    </a>
                  </td>

                  {/* 3. Verification */}
                  <td className="px-6 py-6">
                    <select
                      value={verificationStatus}
                      onChange={(e) => {
                        const newStatus = e.target.value;
                        if (newStatus !== verificationStatus) {
                          triggerAction(
                            'Change Verification Status?',
                            `Change status to ${newStatus.toUpperCase()}? This will generate a serial number.`,
                            () => updateVerificationStatus(item._id, newStatus)
                          );
                        }
                      }}
                      className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase outline-none cursor-pointer ${isPending ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                        isVerified ? 'bg-emerald-500 text-white' :
                          'bg-red-500 text-white'
                        }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="verified">Verified</option>
                      <option value="not_verified">Not Verified</option>
                    </select>
                  </td>

                  {/* 4. Receipt */}
                  <td className="px-6 py-6 text-center">
                    <button
                      disabled={!isReceiptActive}
                      onClick={() => handleReceiptClick(item._id)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase w-full transition-all ${!isReceiptActive ? 'opacity-20 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400' :
                        isReceiptSent ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                          'bg-black text-white hover:bg-slate-800'
                        }`}
                    >
                      {isReceiptSent
                        ? <><CheckCircle2 size={12} /> Sent</>
                        : <><Mail size={12} /> Send</>
                      }
                    </button>
                  </td>

                  {/* 5. Course Status */}
                  <td className="px-6 py-6">
                    <select
                      disabled={!isCourseStatusActive}
                      value={courseStatus}
                      onChange={(e) => {
                        const val = e.target.value;
                        triggerAction(
                          'Update Course Status?',
                          `Change status to ${val.toUpperCase()}?`,
                          () => updateStatus(item._id, val)
                        );
                      }}
                      className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase outline-none transition-all ${!isCourseStatusActive ? 'opacity-20 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400' :
                        courseStatus === 'completed' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          courseStatus === 'ongoing' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-slate-100 dark:bg-slate-800 dark:text-white'
                        }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  {/* 6. Certification */}
                  <td className="px-6 py-6">
                    <button
                      disabled={!isCertificationActive}
                      onClick={() => triggerAction(
                        isCertified ? 'Revoke Certificate?' : 'Issue Certificate?',
                        isCertified ? 'Revoke this certificate?' : 'Issue certificate to this student?',
                        () => toggleCertification(item._id)
                      )}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${!isCertificationActive ? 'opacity-20 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400' :
                        isCertified ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                          'bg-indigo-600 text-white hover:bg-indigo-700'
                        }`}
                    >
                      {isCertified
                        ? <><CheckCircle2 size={12} /> Issued</>
                        : <><ShieldCheck size={12} /> Issue</>
                      }
                    </button>
                  </td>

                  {/* 7. Serial + Date */}
                  <td className="px-6 py-6 text-right">
                    {hasSerialNumber ? (
                      <div className="flex flex-col items-end gap-2">
                        <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400">
                          {item.certification.serialNumber}
                        </span>
                        {isCertified ? (
                          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-lg">
                            <Calendar size={12} className="text-slate-400" />
                            <input
                              type="date"
                              className="bg-transparent text-[10px] font-bold outline-none dark:text-white"
                              value={item.certification.issueDate ? new Date(item.certification.issueDate).toISOString().split('T')[0] : ''}
                              onChange={(e) => updateDate(item._id, e.target.value)}
                            />
                          </div>
                        ) : (
                          <span className="text-[9px] text-slate-400 italic">Date: Not Set</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-300 dark:text-slate-600 italic">No Serial</span>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManager;