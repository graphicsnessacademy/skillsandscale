import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Users, PlayCircle, Star, BookOpen, ArrowLeft, Calendar, Loader2, CheckCircle, Send, Share2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../Components/BookingModal';
import api from '../utils/api';

const CourseDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [course, setCourse] = useState<{ _id: string; title: string; image: string; price: string; nextBatch?: string; duration?: string; outline?: { moduleTitle?: string; moduleSubtitle?: string; title?: string; description?: string }[]; requirements?: string[]; targetAudience?: string[]; careerOpportunities?: string[]; category?: string; reviews?: number; students?: number; description?: string; originalPrice?: number; discount?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reviews] = useState([
    { id: 1, user: "Abir Hasan", rating: 5, comment: "খুবই চমৎকার একটি কোর্স। নতুন অনেক কিছু শিখতে পারলাম।", date: "2 days ago" },
    { id: 2, user: "Sarah Islam", rating: 4, comment: "Content depth is amazing, highly recommended.", date: "1 week ago" }
  ]);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await api.get(`/courses/${id}`);
        setCourse(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    alert("Review Submitted (Demo)");
    setNewReview("");
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  if (!course) return <div className="text-center py-20 text-slate-500">Course not found</div>;

  return (
    <main className="pt-24 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <BookingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} course={course} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <Link to="/courses" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> সব কোর্স দেখুন
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* --- LEFT COLUMN: CONTENT --- */}
          <div className="lg:col-span-2 space-y-10">

            {/* 1. Hero Header */}
            <div>
              <div className="rounded-[2rem] overflow-hidden shadow-lg border border-slate-200 dark:border-slate-800 mb-8 relative group">
                <img src={course.image} alt={course.title} className="w-full aspect-video object-cover" />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                  {course.category}
                </div>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                {course.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 text-amber-500"><Star size={18} fill="currentColor" /> {course.reviews || 0} রিভিউ</span>
                <span className="flex items-center gap-1.5"><Users size={18} className="text-emerald-500" /> {course.students} জন শিক্ষার্থী</span>
                <span className="flex items-center gap-1.5"><Calendar size={18} className="text-blue-500" /> ব্যাচ: {course.nextBatch}</span>
              </div>
            </div>

            {/* 2. Description */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 border-l-4 border-indigo-500 pl-4">কোর্সের বিবরণ</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                {course.description}
              </p>
            </section>

            {/* 3. Curriculum (Dynamic Outline) */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 border-l-4 border-indigo-500 pl-4">কোর্স সিলেবাস</h3>
              <div className="space-y-3">
                {course.outline && course.outline.map((topic, index: number) => (
                  <div key={index} className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-900 transition-all">
                    <div className="mt-0.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-full">
                      <PlayCircle size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{topic.moduleTitle}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{topic.moduleSubtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Reviews & Rating */}
            <section className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200  dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-slate-900 dark:text-white border-l-4 border-indigo-500 pl-4">স্টুডেন্ট রিভিউ</h3>
              </div>

              <div className="space-y-6 mb-10">
                {reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-sm font-black text-indigo-700 dark:text-indigo-300">
                        {rev.user.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{rev.user}</p>
                        <div className="flex text-amber-400 text-[10px] gap-0.5">
                          {[...Array(rev.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                        </div>
                      </div>
                      <span className="text-xs text-slate-400 ml-auto">{rev.date}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm ml-14 font-medium">"{rev.comment}"</p>
                  </div>
                ))}
              </div>

              {/* Write Review Box */}
              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl">
                <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm">আপনার মতামত দিন</h4>
                {user ? (
                  <form onSubmit={handleReviewSubmit}>
                    <textarea
                      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 mb-3 resize-none font-medium"
                      rows={3}
                      placeholder="কোর্সটি সম্পর্কে লিখুন..."
                      value={newReview}
                      onChange={(e) => setNewReview(e.target.value)}
                    ></textarea>
                    <button type="submit" className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 hover:opacity-90 transition-all">
                      <Send size={14} /> সাবমিট করুন
                    </button>
                  </form>
                ) : (
                  <div className="text-sm text-slate-500 font-medium">রিভিউ দিতে দয়া করে <Link to="/login" className="text-indigo-600 font-bold underline">লগইন</Link> করুন।</div>
                )}
              </div>
            </section>
          </div>

          {/* --- RIGHT COLUMN: STICKY BOOKING CARD --- */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">

              {/* Price Section */}
              <div className="mb-8 text-center">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">কোর্স ফি</p>
                <div className="flex items-center justify-center gap-3">
                  {course.originalPrice && course.discount && course.discount > 0 && (
                    <span className="text-xl font-bold text-slate-400 line-through decoration-red-500 decoration-2">
                      ৳{course.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-black text-indigo-600">
                    {course.price}
                  </span>
                </div>
                {course.discount && course.discount > 0 && (
                  <span className="inline-block mt-2 bg-green-300 text-white-600 px-3 py-1 rounded-lg text-xs font-black dark:bg-green-300 dark:text-black">
                    {course.discount}% বিশেষ ছাড়
                  </span>
                )}
              </div>

              {/* Main Action Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:shadow-indigo-500/30 transform hover:-translate-y-1 mb-8 flex items-center justify-center gap-2"
              >
                Book Course <ArrowLeft className="rotate-180" size={20} />
              </button>

              {/* Meta List */}
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-3 font-bold"><Clock size={18} className="text-indigo-500" /> সময়কাল</span>
                  <span className="font-bold text-slate-900 dark:text-white">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-3 font-bold"><BookOpen size={18} className="text-indigo-500" /> মোট ক্লাস</span>
                  <span className="font-bold text-slate-900 dark:text-white">২৪ টি ক্লাস</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-3 font-bold"><Users size={18} className="text-indigo-500" /> মোট শিক্ষার্থী</span>
                  <span className="font-bold text-slate-900 dark:text-white">{course.students}+</span>
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-3 font-bold"><CheckCircle size={18} className="text-indigo-500" /> সার্টিফিকেট</span>
                  <span className="font-bold text-slate-900 dark:text-white">Yes</span>
                </div>
              </div>

              <button className="w-full mt-6 py-3 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:border-indigo-500 hover:text-indigo-600 transition-all">
                <Share2 size={16} /> বন্ধুদের সাথে শেয়ার করুন
              </button>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default CourseDetail;