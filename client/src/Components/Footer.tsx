import { Link } from 'react-router-dom'; // <--- THIS WAS MISSING
import logo from '../assets/Logo.png'; // Make sure extension matches your file
import logoWhite from '../assets/Logowhite.png'; // <--- Import Dark Mode Logo


const Footer = () => {
  return (
    <footer className="bg-white dark:bg-black text-gray-800 dark:text-white border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-12">

          {/* Logo & Description */}
          <div className="lg:col-span-4">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={logo}
                alt="SkillsandScale Logo"
                className="h-10 w-auto object-contain block dark:hidden"
              />
              <img
                src={logoWhite}
                alt="SkillsandScale Logo"
                className="h-10 w-auto object-contain hidden dark:block"
              />
              {/*<span className="text-xl font-bold text-gray-900 dark:text-white">SkillsandScale ACADEMY</span>*/}
            </div>
            <p className="text-gray-500 dark:text-gray-400 pr-8 font-noto-sans-bengali">
              বিশ্বমানের ডিজাইন, কার্যকর মার্কেটিং স্ট্র্যাটেজি এবং পূর্ণাঙ্গ শিক্ষার মাধ্যমে ক্রিয়েটর এবং ব্যবসায়ীদের ক্ষমতায়ন করছি।
            </p>

            {/* Social Icons */}
            <div className="flex space-x-4 mt-6">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.07-1.645-.07-4.85s.012-3.584.07-4.85c.148-3.225 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.85-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98.059-1.281.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98-1.281-.059-1.689-.073-4.948-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.441 1.441 1.441 1.441-.645 1.441-1.441-.645-1.44-1.441-1.44z"></path></svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white tracking-wider uppercase mb-4 font-hind-siliguri">এক্সপ্লোর করুন</h3>
              <ul className="space-y-3 font-noto-sans-bengali">
                {/* Updated to use Link */}
                <li><Link to="/courses" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">কোর্সসমূহ</Link></li>
                <li><Link to="/services" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">সার্ভিসসমূহ</Link></li>
                <li><Link to="/certification" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">সার্টিফিকেশন</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white tracking-wider uppercase mb-4 font-hind-siliguri">আমাদের সম্পর্কে</h3>
              <ul className="space-y-3 font-noto-sans-bengali">
                <li><Link to="/about" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">আমাদের গল্প</Link></li>
                <li><Link to="/team" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">টিম</Link></li>
                <li><Link to="/contact" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">যোগাযোগ</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white tracking-wider uppercase mb-4 font-hind-siliguri">লিগ্যাল ইনফো</h3>
              <ul className="space-y-3 font-noto-sans-bengali">
                <li><Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">প্রাইভেসি পলিসি</Link></li>
                <li><Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">টার্মস অফ সার্ভিস</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-center text-gray-400 dark:text-gray-500">
          <p>&copy; 2025 SkillsandScale Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;