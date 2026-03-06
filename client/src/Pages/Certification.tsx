import { useState } from 'react';
import { CheckCircle, Award, GraduationCap, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface VerifiedDataProps {
  data?: {
    course?: { title: string } | string;
    courseName?: { title: string } | string;
    studentName?: { name: string } | string;
    name?: { name: string } | string;
    date?: string;
    issueDate?: string;
    serialNumber?: string;
  };
  courseTitle?: string;
  studentName?: string;
  issueDate?: string;
  serial?: string;
}

const Certification = () => {
  const [serial, setSerial] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState<null | 'success' | 'error'>(null);
  const [loading, setLoading] = useState(false);
  const [verifiedData, setVerifiedData] = useState<VerifiedDataProps | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setVerifiedData(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/students/verify`, {
        params: { serial: serial.trim(), name: name.trim() }
      });
      setVerifiedData(res.data);
      setResult('success');
    } catch {
      setResult('error');
    } finally {
      setLoading(false);
    }
  };

  // Safe Date Formatter to prevent crashes
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
    } catch {
      return "Invalid Date";
    }
  };

  // --- BULLETPROOF DATA EXTRACTORS ---
  // These prevent the "Object as React Child" crash
  const getCourseName = () => {
    const courseObj = verifiedData?.data?.course || verifiedData?.data?.courseName || verifiedData?.courseTitle;
    if (typeof courseObj === 'object' && courseObj !== null) return courseObj.title;
    return courseObj || "Course";
  };

  const getStudentName = () => {
    const studentObj = verifiedData?.data?.studentName || verifiedData?.data?.name || verifiedData?.studentName;
    if (typeof studentObj === 'object' && studentObj !== null) return studentObj.name;
    return studentObj || "Student";
  };

  return (
    <main className="pt-40 pb-16 bg-white dark:bg-gray-900 min-h-screen">

      <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          <div className="lg:w-1/2">
            <span className="text-blue-600 dark:text-blue-500 font-extrabold tracking-widest text-sm uppercase mb-4 block">
              Why Certification Matters
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Validate Your Skills. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Accelerate Your Career.</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6 leading-relaxed">
              Our certification is more than just a piece of paper. It represents weeks of intensive, project-based learning and mastery of industry-standard tools.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 h-10 w-10 rounded-lg flex items-center justify-center text-green-600 dark:text-green-400">
                  <Award size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Industry Recognized</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Trusted by top agencies and companies.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-2 h-10 w-10 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Skill Validation</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Proof of your hands-on expertise.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="absolute inset-0 bg-blue-600 rounded-[2rem] rotate-3 opacity-10"></div>
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=2070"
              alt="Graduation"
              className="relative rounded-[2rem] shadow-2xl border-4 border-white dark:border-gray-800"
            />
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Verify a Certificate</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-10">
            Enter the student's name and the unique serial number found on the certificate to verify its authenticity.
          </p>

          <form onSubmit={handleVerify} className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
                  placeholder="Student Name"
                />
              </div>
              <div className="text-left">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase">Serial</label>
                <input
                  required
                  type="text"
                  value={serial}
                  onChange={e => setSerial(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none dark:text-white uppercase"
                  placeholder="GA202607022669"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Verify Now"}
            </button>
          </form>

          {/* SUCCESS RESULT UI */}
          {result === 'success' && verifiedData && (
            <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl animate-in fade-in slide-in-from-bottom-4">
              <div className="flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-2 text-green-700 dark:text-green-400 font-bold text-xl mb-4">
                  <CheckCircle size={28} /> Verified Successfully
                </div>

                <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
                  <strong>{getStudentName()}</strong> successfully completed <strong>{getCourseName()}</strong>.
                </p>

                <div className="w-full max-w-sm border-t border-green-200/50 dark:border-green-800/50 pt-4 flex justify-around">
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">Issue Date</p>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {formatDate(verifiedData.data?.date || verifiedData.data?.issueDate || verifiedData.issueDate)}
                    </p>
                  </div>
                  <div className="w-px bg-green-200/50 dark:bg-green-800/50"></div>
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1">Serial Number</p>
                    <p className="font-bold font-mono text-gray-900 dark:text-white uppercase tracking-widest">
                      {verifiedData.data?.serialNumber || verifiedData.serial || serial}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ERROR RESULT UI */}
          {result === 'error' && (
            <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex flex-col items-center gap-2 animate-in fade-in zoom-in-95">
              <AlertCircle className="text-red-500 mb-1" size={32} />
              <p className="text-red-600 dark:text-red-400 font-bold text-lg">Certificate not found.</p>
              <p className="text-red-500/80 dark:text-red-400/80 text-sm">Please check the spelling of the name and the exact serial number.</p>
            </div>
          )}

        </div>
      </section>

    </main>
  );
};

export default Certification;