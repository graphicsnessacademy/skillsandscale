import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/Logo.png'; // Make sure extension matches your file
import logoWhite from '../assets/Logowhite.png'; // <--- Import Dark Mode Logo
const Header = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Helper to check active state
  const isActive = (path: string) => {
    return location.pathname === path
      ? "text-brand-magenta dark:text-brand-magenta font-bold text-lg"
      : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium text-lg";
  };

  const mobileIsActive = (path: string) => {
    return location.pathname === path
      ? "block px-4 py-2 text-brand-magenta dark:text-brand-magenta font-bold bg-blue-50 dark:bg-blue-900/20 rounded text-lg"
      : "block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-lg";
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-black/50 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50 shadow-md shadow-gray-200/5 dark:shadow-black/10 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2">
              {/* Image 1: Visible in Light, Hidden in Dark */}
              <img
                src={logo}
                alt="SkillsandScale Logo"
                className="h-10 w-auto object-contain block dark:hidden"
              />

              {/* Image 2: Hidden in Light, Visible in Dark */}
              <img
                src={logoWhite}
                alt="SkillsandScale Logo"
                className="h-10 w-auto object-contain hidden dark:block"
              />
              {/* If your logo image already has text, delete this span below */}
              {/*<span className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-500 transition-colors">
                  SkillsandScale
                </span> */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className={`${isActive('/')} transition-colors font-hind-siliguri`}>হোম</Link>
            <Link to="/courses" className={`${isActive('/courses')} transition-colors font-hind-siliguri`}>কোর্সসমূহ</Link>
            <Link to="/services" className={`${isActive('/services')} transition-colors font-hind-siliguri`}>সার্ভিসসমূহ</Link>
          </div>

          {/* Desktop Right Side (Buttons) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none">
              {!isDark ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              )}
            </button>

            {/* Contact (Secondary Text Link)
            <Link to="/contact" className="font-semibold text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-hind-siliguri text-lg">
              যোগাযোগ   সাইন আপ
            </Link>
            */}

            {/* Sign Up (Primary Button) */}
            <Link to="/contact" className="inline-block bg-gradient-to-r from-brand-magenta to-brand-violet text-white px-6 py-2.5 rounded-lg font-semibold hover:from-brand-violet hover:to-brand-magenta transition-all duration-300 transform hover:scale-105 shadow-md shadow-brand-magenta/30 font-hind-siliguri text-lg">
              যোগাযোগ
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 focus:outline-none">
              {!isDark ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              )}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white focus:outline-none">
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 py-4 border-t border-gray-200 dark:border-gray-800 font-hind-siliguri">
          <Link to="/" className={mobileIsActive('/')} onClick={() => setIsMobileMenuOpen(false)}>হোম</Link>
          <Link to="/courses" className={mobileIsActive('/courses')} onClick={() => setIsMobileMenuOpen(false)}>কোর্সসমূহ</Link>
          <Link to="/services" className={mobileIsActive('/services')} onClick={() => setIsMobileMenuOpen(false)}>সার্ভিসসমূহ</Link>

          <div className="px-4 mt-4 grid grid-cols-2 gap-3">
            <Link to="/contact" className="block text-center border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2.5 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-lg" onClick={() => setIsMobileMenuOpen(false)}>
              যোগাযোগ
            </Link>
            <Link to="/signup" className="block text-center bg-gradient-to-r from-brand-magenta to-brand-violet text-white px-4 py-2.5 rounded-lg font-semibold hover:from-brand-violet hover:to-brand-magenta transition-colors shadow-md text-lg" onClick={() => setIsMobileMenuOpen(false)}>
              সাইন আপ
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;