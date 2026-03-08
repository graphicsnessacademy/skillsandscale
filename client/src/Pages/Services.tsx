import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Phone } from 'lucide-react';
import api from '../utils/api';
import { IconMap } from '../utils/IconRegistry'; // Import the mapper

interface Service {
  _id: string;
  title: string;
  category: string;
  icon: string;
}

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);


  const designServices = services.filter(s => s.category === 'Design');
  const marketingServices = services.filter(s => s.category === 'Marketing');

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <Loader2 className="w-10 h-10 animate-spin text-brand-magenta" />
    </div>
  );

  return (
    <main className="pt-40 pb-16 bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- HERO SECTION --- */}
        <header className="text-center py-12 md:py-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight font-hind-siliguri">
            ব্র্যান্ডিং থেকে মার্কেটিং - <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-magenta to-brand-violet">আমরা অফার করি আপনার ব্র্যান্ড গড়ার সব কিছু</span>
          </h1>
          <p className="max-w-[60rem] mx-auto text-lg text-gray-600 dark:text-gray-300 mb-8 font-noto-sans-bengali leading-relaxed">
            ব্র্যান্ডিং মানে শুধু লোগো নয় - এটি আপনার সম্পূর্ণ পরিচয়। মার্কেটিং মানে সেই পরিচয় সঠিক মানুষের কাছে পৌঁছে দেওয়া। আমরা বিশ্বাস করি সমন্বিত সমাধানে - যেখানে ব্র্যান্ড এবং মার্কেটিং একসাথে কাজ করে অসাধারণ ফলাফলের জন্য।
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-magenta to-brand-violet text-white px-8 py-3 rounded-full font-semibold transition-transform hover:-translate-y-1 shadow-lg shadow-brand-magenta/30 font-hind-siliguri">
            কল বুক করুন
            <Phone size={18} />
          </Link>
        </header>

        {/* --- SECTION 1: VISUAL DESIGN --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">

          {/* Left: Text Card */}
          <div className="lg:col-span-5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[40px] p-12 relative flex flex-col justify-center overflow-hidden min-h-[500px]">



            <div className="absolute top-12 right-12 animate-float-medium z-0">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-2xl shadow-sm rotate-[12deg]">
                ✨
              </div>
            </div>

            <div className="absolute bottom-40 right-8 animate-float-fast z-0">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-2xl shadow-sm">
                🖌️
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight relative z-10 font-hind-siliguri">
              ক্রিয়েটিভ<br />ভিজ্যুয়াল ডিজাইন
            </h2>

            <p
              className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed relative z-10 max-w-sm text-justify font-noto-sans-bengali"
              style={{ textJustify: 'inter-word' }}
            >
              প্রতিটি ডিজাইন একটি গল্প বলে। আমরা আপনার ব্যবসায়িক লক্ষ্য বুঝে এবং সেই অনুযায়ী উচ্চমানের ক্রিয়েটিভ ভিজ্যুয়াল ডিজাইন তৈরি করি যা ব্র্যান্ডেকে প্রতিফলিত করে এবং ব্যবসায়িক লক্ষ্য অর্জনে সহায়তা করে।
            </p>
          </div>

          {/* Right: Icon Grid (Dynamic) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[40px] p-10 md:p-14 shadow-sm flex items-center">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
              {designServices.map((service, index) => (
                <div key={index} className="flex flex-col items-center justify-center text-center p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-fuchsia-50 dark:bg-fuchsia-900/20 text-brand-magenta flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {IconMap[service.icon] || IconMap['Layout']}
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-tight">
                    {service.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- SECTION 2: DIGITAL MARKETING --- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">

          {/* Left: Icon Grid (Dynamic) */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[40px] p-10 md:p-14 shadow-sm flex items-center order-2 lg:order-1">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full">
              {marketingServices.map((service, index) => (
                <div key={index} className="flex flex-col items-center justify-center text-center p-6 rounded-3xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 cursor-pointer">
                  <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/20 text-brand-violet flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {IconMap[service.icon] || IconMap['Search']}
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 leading-tight">
                    {service.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Text Card */}
          <div className="lg:col-span-5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[40px] p-12 relative flex flex-col justify-center items-end text-right overflow-hidden min-h-[500px] order-1 lg:order-2">



            <div className="absolute top-20 right-10 animate-float-slow z-0">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-2xl shadow-sm rotate-[-5deg]">
                📈
              </div>
            </div>

            <div className="absolute bottom-40 left-16 animate-float-fast z-0">
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 text-2xl shadow-sm">
                💡
              </div>
            </div>

            <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight relative z-10 font-hind-siliguri">
              ডিজিটাল<br />মার্কেটিং
            </h2>

            <p
              className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed relative z-10 max-w-sm text-justify font-noto-sans-bengali"
              style={{ textJustify: 'inter-word', textAlignLast: 'right' }}
            >
              আপনার ব্যবসাকে অনলাইনের কঠিন প্রতিযোগিতায় সামনের সারিতে তুলে ধরতে আমরা অ্যাডভান্সড মার্কেটিং টুলস আর টেকনিক ব্যবহার করি, যাতে আপনার ব্যবসাকে দ্বিগুণ গতিতে স্কেল করতে পারেন সহজেই। আপনার লক্ষ্য পূরণ করে দীর্ঘমেয়াদী সাফল্য নিশ্চিত করতে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>
          </div>

        </section>

        {/* --- CTA SECTION --- */}
        <section className="text-center py-20 border-t border-gray-100 dark:border-gray-800">
          <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-6 font-hind-siliguri">
            একটি প্রজেক্ট শুরু করতে প্রস্তুত?
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-10 text-lg font-noto-sans-bengali">
            আপনার নতুন ব্র্যান্ড আইডেন্টিটি, মার্কেটিং পুশ বা কোর্সে ভর্তির প্রয়োজন হোক না কেন, আমরা সাহায্য করতে এখানে আছি।
          </p>
          <Link to="/contact" className="bg-gradient-to-r from-brand-magenta to-brand-violet text-white px-10 py-4 rounded-xl font-bold hover:from-brand-violet hover:to-brand-magenta transition-all text-lg shadow-lg inline-block transform hover:-translate-y-1 font-hind-siliguri">
            যোগাযোগ করুন
          </Link>



        </section>

      </div>
    </main>
  );
};

export default Services;