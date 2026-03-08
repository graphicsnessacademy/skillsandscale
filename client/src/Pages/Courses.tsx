import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, Users, Loader2 } from 'lucide-react';
import api from '../utils/api';

const Courses = () => {
  const [courses, setCourses] = useState<{ _id: string; title: string; price: string; image: string; nextBatch?: string; category?: string; discount?: number; duration?: string; students?: number; reviews?: number; originalPrice?: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await api.get('/courses');
        setCourses(response.data);
        setError(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <p className="text-red-500 font-bold mb-2">কোর্স লোড করা সম্ভব হয়নি।</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold">
          রিফ্রেশ করুন
        </button>
      </div>
    </div>
  );

  return (
    <main className="pt-40 pb-20 bg-slate-50 dark:bg-slate-950 min-h-screen">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-hind-siliguri">
            আমাদের কোর্সসমূহ
          </h2>
          <p className="mt-5 text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-noto-sans-bengali">
            আপনার দক্ষতা বাড়াতে আমাদের সেরা কোর্সগুলো দেখুন।
          </p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Link to={`/courses/${course._id}`} key={course._id} className="group block h-full">
              <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col hover:-translate-y-2">

                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-white shadow-sm">
                    {course.category}
                  </div>

                  {/* Discount Badge (Highlighted) */}
                  {course.discount && course.discount > 0 && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-[pulse_ease-in-out_2s_infinite]">
                      {course.discount}% OFF
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-7 flex flex-col flex-grow">

                  {/* Title */}
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </h3>

                  {/* Meta Info (Icons) */}
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400 mb-6">
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} className="text-indigo-500" /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={16} className="text-emerald-500" /> {course.students}
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-500">
                      <Star size={16} fill="currentColor" /> {course.reviews}
                    </span>
                  </div>

                  {/* Divider Line */}
                  <div className="border-t border-slate-100 dark:border-slate-800 mb-5"></div>

                  {/* Bottom Row: Batch & Price */}
                  <div className="flex items-end justify-between mt-auto">

                    {/* Left: Batch Date */}
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ব্যাচ শুরু</p>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{course.nextBatch}</p>
                    </div>

                    {/* Right: Price (Same Size) */}
                    <div className="text-right flex items-center gap-3">
                      {course.originalPrice && course.discount && course.discount > 0 ? (
                        <span className="text-xl font-bold text-slate-400 line-through decoration-red-500 decoration-2">
                          ৳{course.originalPrice}
                        </span>
                      ) : null}
                      <span className="text-xl font-black text-indigo-600">
                        {course.price}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main >
  );
};

export default Courses;