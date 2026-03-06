import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, BookOpen, Briefcase, Loader2, Star, ChevronRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import api from '../utils/api';

const DynamicIcon = ({ name }: { name: string }) => {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[name];
  if (!IconComponent) return <LucideIcons.HelpCircle className="w-full h-full" />;
  return <IconComponent className="w-full h-full" />;
};

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<{ courses: { _id: string; title: string; description?: string; image?: string; price?: string; link?: string; duration?: string; reviews?: number; discount?: number; originalPrice?: number }[], services: { _id: string; title: string; category?: string; icon?: string }[] }>({
    courses: [],
    services: []
  });

  useEffect(() => {
    const fetchAndFilter = async () => {
      setLoading(true);
      try {
        const [courseRes, serviceRes] = await Promise.all([
          api.get('/courses'),
          api.get('/services')
        ]);

        const lowerQuery = query.toLowerCase();

        const filteredCourses = courseRes.data.filter((course: { title?: string; description?: string }) =>
          (course.title || '').toLowerCase().includes(lowerQuery) ||
          (course.description?.toLowerCase().includes(lowerQuery) || '')
        );

        const filteredServices = serviceRes.data.filter((service: { title?: string }) =>
          (service.title?.toLowerCase().includes(lowerQuery) || '')
        );

        setResults({ courses: filteredCourses, services: filteredServices });
      } catch (error) {
        console.error("Search Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchAndFilter();
    } else {
      setLoading(false);
      setResults({ courses: [], services: [] });
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value.trim();
    if (input) navigate(`/search?q=${encodeURIComponent(input)}`);
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0f172a]">
      <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
      <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Scanning Database...</p>
    </div>
  );

  return (
    <main className="pt-32 pb-20 bg-slate-50 dark:bg-[#0f172a] min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Search Header */}
        <div className="mb-12">

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md overflow-hidden px-5 py-3 gap-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <SearchIcon className="text-indigo-500 shrink-0" size={20} />
              <input
                name="search"
                defaultValue={query}
                placeholder="Search courses, services..."
                className="flex-1 bg-transparent text-slate-900 dark:text-white font-semibold text-base placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Results Meta */}
          {query && (
            <div className="mb-12">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Search Results for <span className="text-blue-600">"{query}"</span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Found {results.courses.length} courses and {results.services.length} services.
              </p>
            </div>
          )}
        </div>

        {/* --- 1. COURSE RESULTS (Premium Grid) --- */}
        {results.courses.length > 0 && (
          <section className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-600 text-white rounded-lg shadow-lg shadow-indigo-500/20"><BookOpen size={20} /></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Academy Modules</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.courses.map(course => (
                <Link key={course._id} to={`/courses/${course._id}`} className="group bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-3 hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-48 overflow-hidden rounded-[1.5rem] mb-4">
                    <img src={course.image || 'https://via.placeholder.com/400x250?text=No+Image'} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase text-indigo-600">{course.price || 'Free'}</div>
                  </div>
                  <div className="p-4 pt-0">
                    <h3 className="font-black text-slate-900 dark:text-white text-lg line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{course.title}</h3>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase">
                      <span className="flex items-center gap-1 text-amber-500"><Star size={12} fill="currentColor" /> {course.reviews}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* --- 2. SERVICE RESULTS (Icon Cards) --- */}
        {results.services.length > 0 && (
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-500 text-white rounded-lg shadow-lg shadow-emerald-500/20"><Briefcase size={20} /></div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Agency Services</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.services.map(service => (
                <Link key={service._id} to="/services" className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center hover:border-indigo-500 transition-all group shadow-sm">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                    <div className="w-6 h-6"><DynamicIcon name={service.icon || 'HelpCircle'} /></div>
                  </div>
                  <span className="font-black text-slate-800 dark:text-white text-[10px] uppercase tracking-widest leading-tight">{service.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && query && results.courses.length === 0 && results.services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 mb-6">
              <SearchIcon size={40} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">No Matches Found</h2>
            <p className="text-slate-500 mt-2 font-medium">Try checking your spelling or use general keywords like "Web" or "Design".</p>
            <Link to="/" className="mt-8 text-indigo-600 font-bold uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-3 transition-all">
              <ChevronRight className="rotate-180" size={16} /> Return Home
            </Link>
          </div>
        )}

      </div>
    </main>
  );
};

export default Search;