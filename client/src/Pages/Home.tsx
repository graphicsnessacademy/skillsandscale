import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PromoCover from '../assets/Image/PromoCover.jpg';
import { Clock } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import {
  Star,
  Users,
  ChevronRight,
} from 'lucide-react';
import ProjectShowcase from '../Components/ProjectShowcase/ProjectShowcase';
import HeroCard from '../Components/HeroCard';
import api from '../utils/api';


const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<{ _id: string; title: string; price: string; image: string; nextBatch?: string; link?: string; category?: string; discount?: number; duration?: string; students?: number; reviews?: number; originalPrice?: number }[]>([]); // New state for fetched courses
  const [services, setServices] = useState<{ _id: string; title: string; category: string; icon: string }[]>([]); // Add this line
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Slider & Indicator States
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await api.get('/courses');
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const resServices = await api.get('/services');
        setServices(resServices.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const sections = document.querySelectorAll('.fade-in-section');
    sections.forEach(section => observerRef.current?.observe(section));

    const statsSection = document.getElementById('stats-section');
    const counters = document.querySelectorAll('.counter');
    let animated = false;

    const statsObserver = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach((counter) => {
          const target = +(counter.getAttribute('data-target') || '0');
          const duration = 1500;
          const stepTime = 20;
          const steps = duration / stepTime;
          const increment = target / steps;
          let current = 0;

          const updateCount = () => {
            current += increment;
            if (current < target) {
              (counter as HTMLElement).innerText = Math.ceil(current).toLocaleString() + '+';
              setTimeout(updateCount, stepTime);
            } else {
              (counter as HTMLElement).innerText = target.toLocaleString() + '+';
            }
          };
          updateCount();
        });
      }
    }, { threshold: 0.5 });

    if (statsSection) statsObserver.observe(statsSection);

    return () => {
      observerRef.current?.disconnect();
      statsObserver.disconnect();
    };
  }, []);


  // --- Slider Logic ---
  const startDragging = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (sliderRef.current?.offsetLeft || 0));
    setScrollLeft(sliderRef.current?.scrollLeft || 0);
  };

  const stopDragging = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current.offsetLeft || 0);
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const width = target.offsetWidth;
    // Calculate index based on roughly one card width
    const newIndex = Math.round(target.scrollLeft / (width * 0.8));
    setActiveIndex(newIndex);
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const executeSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const DynamicIcon = ({ name }: { name: string }) => {
    const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[name];
    if (!IconComponent) return <LucideIcons.HelpCircle className="w-full h-full" strokeWidth={1.5} />;
    return <IconComponent className="w-full h-full" strokeWidth={1.5} />;
  };



  return (
    <main className="bg-gray-50 dark:bg-gray-900">

      {/* Hero Section */}
      <section className="fade-in-section pt-32 pb-16 sm:pt-40 sm:pb-20 bg-[#fefdff] dark:bg-black relative overflow-hidden">

        <div className="absolute inset-0 bg-grid-gray-200/50 dark:bg-grid-gray-800/20 [mask-image:linear-gradient(to_bottom,white_5%,transparent_90%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight font-hind-siliguri leading-tight" style={{ lineHeight: '1.2' }}>
                দক্ষতার সাথে <span className="bg-gradient-to-r from-brand-magenta to-brand-violet bg-clip-text text-transparent">স্বপ্ন দেখুন</span>, <br className="hidden lg:block" />
                সৃজনশীলতার সাথে <span className="bg-gradient-to-r from-brand-magenta to-brand-violet bg-clip-text text-transparent">বাস্তবায়ন করুন।</span>
              </h1>
              <p className="mt-6 text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto lg:mx-0 font-noto-sans-bengali">
                ব্যবসার জন্য <span className="text-brand-violet font-bold">স্মার্ট মার্কেটিং স্ট্র্যাটেজি</span> এবং ক্যারিয়ারের জন্য <span className="text-brand-violet font-bold">ইন্ডাস্ট্রি-স্ট্যান্ডার্ড স্কিল</span>—সবই পাচ্ছেন আমাদের কাছে।
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link to="/courses" className="inline-block bg-gradient-to-r from-brand-magenta to-brand-violet text-white px-6 py-3 rounded-lg font-semibold hover:from-brand-violet hover:to-brand-magenta transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-magenta/30 text-center whitespace-nowrap">
                  Browse Courses
                </Link>
                <div className="relative inline-block min-w-[240px] sm:min-w-[280px]">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full pl-4 pr-10 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-sm"
                  />
                  <button
                    onClick={executeSearch}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </button>
                </div>
              </div>


              <div className="mt-6 flex items-center justify-center lg:justify-start space-x-4 flex-wrap gap-y-3">
                <div className="flex items-center">
                  <span className="font-bold text-base sm:text-lg mr-2 text-gray-900 dark:text-white">5.0</span>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                    ))}
                  </div>
                </div>
                <div className="flex -space-x-3">
                  <img className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white dark:ring-gray-900" src="https://picsum.photos/id/1005/32/32" alt="User 1" />
                  <img className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white dark:ring-gray-900" src="https://picsum.photos/id/1011/32/32" alt="User 2" />
                  <img className="inline-block h-7 w-7 sm:h-8 sm:w-8 rounded-full ring-2 ring-white dark:ring-gray-900" src="https://picsum.photos/id/1027/32/32" alt="User 3" />
                </div>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 font-medium">&gt;100k+ People Joined</p>
              </div>
            </div>

            {/* Hero Right side visual */}
            <div className="flex items-center justify-center lg:justify-end mt-10 lg:mt-0">
              <HeroCard />
            </div>
          </div>
        </div>
      </section>

      {/* TrustedBy Section */}
      <section className="fade-in-section py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className=" bg-white dark:bg-black/20 rounded-2xl p-8  shadow-[0_05px_05px_rgba(0,0,0,0.01)] dark:shadow-none">
            <p className="text-center text-gray-500 dark:text-gray-400 font-medium mb-8">
              Trusted by over 1,000+ companies to find the best creative assets
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              <span className="text-gray-400 dark:text-gray-500 font-bold text-lg hover:text-gray-800 dark:hover:text-white transition-colors">COBLEBOX</span>
              <span className="text-gray-400 dark:text-gray-500 font-bold text-lg hover:text-gray-800 dark:hover:text-white transition-colors">LUMORA</span>
              <span className="text-gray-400 dark:text-gray-500 font-bold text-lg hover:text-gray-800 dark:hover:text-white transition-colors">FLYTECH</span>
              <span className="text-gray-400 dark:text-gray-500 font-bold text-lg hover:text-gray-800 dark:hover:text-white transition-colors">PHINDER</span>
              <span className="text-gray-400 dark:text-gray-500 font-bold text-lg hover:text-gray-800 dark:hover:text-white transition-colors">CLICKSY</span>
              <span className="text-gray-400 dark:text-gray-500 font-bold text-lg hover:text-gray-800 dark:hover:text-white transition-colors">COMBI</span>
            </div>
          </div>
        </div>
      </section>

      {/* PromoBanner Section */}
      <section className="fade-in-section py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative h-64 bg-white dark:bg-black rounded-2xl flex items-center justify-center overflow-hidden ">
            {/* UPDATED IMAGE TAG BELOW */}
            <img
              src={PromoCover}
              alt="Promotional background"
              className="absolute inset-0 w-full h-full object-cover opacity-100 dark:opacity-100"
            />
          </div>
        </div>
      </section>

      {/* Courses Section (Horizontal Scroll) */}{/* Courses Section (Horizontal Scroll) */}
      <section id="courses" className="fade-in-section py-16 bg-gray-100 dark:bg-black overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-hind-siliguri">আমাদের কোর্সসমূহ</h2>
            <p className="mt-5 text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-noto-sans-bengali">
              আপনার দক্ষতা বাড়াতে আমাদের সেরা কোর্সগুলো দেখুন।
            </p>
          </div>

          {/* Slider Container */}
          <div
            ref={sliderRef}
            onScroll={handleScroll}
            onMouseDown={startDragging}
            onMouseLeave={stopDragging}
            onMouseUp={stopDragging}
            onMouseMove={onMouseMove}
            className={`flex gap-8 overflow-x-auto pb-12 px-2 scrollbar-hide ${isDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'}`}
          >
            {courses.map((course) => (
              <div
                key={course._id}
                className="flex-shrink-0 w-[85%] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start">
                <Link to={`/courses/${course._id}`} className="group block h-full select-none ">
                  <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 h-full flex flex-col ">

                    {/* Image Section */}
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        draggable="false"
                      />

                      {/* Category Badge */}
                      <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                        {course.category}
                      </div>

                      {/* Discount Badge */}
                      {course.discount && course.discount > 0 && (
                        <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
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

                      {/* Meta Info */}
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

                      {/* Divider */}
                      <div className="border-t border-slate-100 dark:border-slate-800 mb-5"></div>

                      {/* Bottom Row */}
                      <div className="flex items-center justify-between mt-auto">
                        {/* Batch */}
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">ব্যাচ শুরু</p>
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{course.nextBatch}</p>
                        </div>

                        {/* Price */}
                        <div className="text-right flex flex-col items-end">
                          {course.originalPrice && course.discount && (
                            <span className="text-xs font-bold text-slate-400 line-through mb-0.5">
                              ৳{course.originalPrice}
                            </span>
                          )}
                          <span className="text-lg sm:text-2xl font-black text-indigo-600 leading-none">
                            {course.price}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                </Link>
              </div>
            ))}

            {/* View All Card */}
            {/* View All Card - Hidden until courses load */}
            {courses.length > 0 && (
              <div className="min-w-[60%] md:min-w-[250px] flex-shrink-0 flex items-center justify-center snap-start">
                <Link to="/courses" className="flex flex-col items-center gap-4 group text-slate-400 hover:text-indigo-600 transition-all">
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center transition-all duration-300 group-hover:border-indigo-600 group-hover:scale-110 group-hover:border-solid">
                    <ChevronRight size={40} />
                  </div>
                  <span className="font-bold font-hind-siliguri text-xl">সকল কোর্স দেখুন</span>
                </Link>
              </div>
            )}
          </div>
          {/* Slide Indicators (Dots) - Hidden until courses load */}
          {courses.length > 0 && (
            <div className="flex justify-center items-center gap-2 mt-4">
              {courses.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${activeIndex === index ? "w-8 bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.4)]" : "w-1.5 bg-gray-300 dark:bg-gray-700"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      {/* Services Section (Infinite Scroll) */}
      <section id="services" className="fade-in-section py-16 bg-white dark:bg-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-hind-siliguri">আমাদের সার্ভিসসমূহ</h2>
            <p className="mt-5 text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-noto-sans-bengali">
              আপনার ব্র্যান্ডের জন্য সেরা ডিজাইন এবং ডিজিটাল সলিউশন।
            </p>
          </div>

          {/* Infinite Scroll Container */}
          <div className="relative w-full overflow-hidden mask-linear-gradient">
            <div className="flex gap-6 w-max animate-infinite-scroll hover:[animation-play-state:paused]">

              {/* Mapping from dynamic backend services */}
              {[...services, ...services].map((service, index) => {
                // Determine colors based on category
                const isDesign = service.category === 'Design';
                const cardBgHover = isDesign
                  ? 'hover:bg-fuchsia-50 dark:hover:bg-fuchsia-900/20'
                  : 'hover:bg-purple-50 dark:hover:bg-purple-900/20';
                const cardBorderHover = isDesign
                  ? 'hover:border-fuchsia-300 dark:hover:border-fuchsia-500'
                  : 'hover:border-purple-300 dark:hover:border-purple-500';
                const iconBg = isDesign
                  ? 'bg-fuchsia-50 dark:bg-fuchsia-900/20'
                  : 'bg-purple-50 dark:bg-purple-900/20';
                const iconColor = isDesign
                  ? 'text-brand-magenta'
                  : 'text-brand-violet';
                const iconHoverScale = 'group-hover:scale-110';

                return (
                  <div
                    key={`${service._id}-${index}`}
                    className={`flex-shrink-0 w-48 h-48 bg-white dark:bg-black/50 border border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center p-4 text-center group ${cardBgHover} ${cardBorderHover} transition-all duration-300 cursor-pointer`}
                  >
                    <div className={`w-16 h-16 rounded-full ${iconBg} ${iconColor} flex items-center justify-center mb-3 ${iconHoverScale} transition-transform`}>
                      <div className="w-8 h-8">
                        <DynamicIcon name={service.icon} />
                      </div>
                    </div>
                    <span className="font-semibold text-gray-800 dark:text-white mt-1">{service.title}</span>
                  </div>
                );
              })}

            </div>

            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10"></div>
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white px-8 py-3 rounded-lg font-semibold border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-600 transition-colors">
              View All Services
            </Link>
          </div>
        </div>
      </section>



      {/* RecentWork Section */}

      <ProjectShowcase />

      {/* Stats Section */}
      <section id="stats-section" className="fade-in-section bg-gradient-to-r from-brand-magenta to-brand-violet py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold counter" data-target="5">0+</p>
              <p className="mt-2 text-sm sm:text-base font-semibold tracking-wider uppercase opacity-80 font-hind-siliguri">অ্যাক্টিভ কোর্স</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold counter" data-target="1000">0+</p>
              <p className="mt-2 text-sm sm:text-base font-semibold tracking-wider uppercase opacity-80 font-hind-siliguri">হ্যাপি স্টুডেন্ট</p>
            </div>

            <div>
              <p className="text-4xl sm:text-5xl font-extrabold counter" data-target="250">0+</p>
              <p className="mt-2 text-sm sm:text-base font-semibold tracking-wider uppercase opacity-80 font-hind-siliguri">কোম্পানি ব্র্যান্ডিং</p>
            </div>
            <div>
              <p className="text-4xl sm:text-5xl font-extrabold counter" data-target="300">0+</p>
              <p className="mt-2 text-sm sm:text-base font-semibold tracking-wider uppercase opacity-80 font-hind-siliguri">ক্লায়েন্ট প্রজেক্ট</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="fade-in-section py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white"></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial Card 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl h-full flex flex-col border border-gray-200 dark:border-gray-700">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic flex-grow">"ভিডিও এডিটিং সার্ভিস অনেক ভালো। ফাস্ট-পেসড আর ট্রেন্ডি স্টাইলে এডিট করে দিয়েছে, আমার সোশ্যাল মিডিয়া কনটেন্টের ভিউজ অনেক বেড়েছে। আমি সন্তুষ্ট!"</p>
              <div className="flex items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <img src="https://picsum.photos/id/237/48/48" alt="Sarah Jenkins" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Samiha Tasnim</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Director-LH</p>
                </div>
              </div>
            </div>
            {/* Testimonial Card 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl h-full flex flex-col border border-gray-200 dark:border-gray-700">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic flex-grow">"ব্র্যান্ডিং এর জন্য পুরো প্যাকেজ নিয়েছি লোগো, কালার প্যালেট, গাইডলাইন সবকিছু পারফেক্ট। আগের থেকে আমার বিজনেস অনেক প্রিমিয়াম লুক।ধন্যবাদ ১০০% রিকমেন্ডেড!"</p>
              <div className="flex items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <img src="https://picsum.photos/id/238/48/48" alt="Elena Rodriguez" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">MD Taruk Ahmed</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Business Owner</p>
                </div>
              </div>
            </div>
            {/* Testimonial Card 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl h-full flex flex-col border border-gray-200 dark:border-gray-700">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic flex-grow">" ami ekta course korsi ekhane onek valo lagse. ami onek kichu sikhchi. course cholakalin ami ekta kaj o peyechi. Onek supportive."</p>
              <div className="flex items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <img src="https://picsum.photos/id/239/48/48" alt="Mike Ross" className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">Muhammad Ashikur Rahman</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="fade-in-section py-20 bg-gray-100 dark:bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white font-hind-siliguri">আপনার ব্যবসা বা স্কিলকে নেক্সট লেভেলে নিতে চান?</h2>
          <p className="mt-5 text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto font-noto-sans-bengali">
            প্রফেশনাল ক্রিয়েটিভ সার্ভিস + ইন্ডাস্ট্রি-স্ট্যান্ডার্ড প্রজেক্ট-বেসড কোর্স — সব এক জায়গায়।
          </p>
          <div className="mt-8">
            {/* Update to Link */}
            <Link to="/contact" className="bg-gradient-to-r from-brand-magenta to-brand-violet text-white px-10 py-4 rounded-xl font-bold hover:from-brand-violet hover:to-brand-magenta transition-all duration-300 transform hover:scale-105 text-lg shadow-lg shadow-brand-magenta/30 inline-block">
              আজই যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};



export default Home;