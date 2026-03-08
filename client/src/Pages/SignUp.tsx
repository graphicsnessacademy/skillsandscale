import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Play } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (errors[e.target.id]) {
      setErrors({ ...errors, [e.target.id]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Account created successfully!");
      navigate('/login');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#f0f2f5] dark:bg-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
      
      {/* Main Card Container - Reduced max-width and height */}
      <div className="bg-white dark:bg-gray-800 rounded-[2rem] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row min-h-[600px] border border-gray-100 dark:border-gray-700">
        
        {/* Left Side: Form Section - Reduced padding */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-gray-800 transition-colors">
          <div className="max-w-sm mx-auto w-full">
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">Sign up now</h1>
              <p className="text-gray-400 dark:text-gray-500 text-base">Create a free account to start learning.</p>
            </header>

            {/* Google Button */}
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 mb-6 bg-white dark:bg-transparent">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-200 font-semibold text-sm">Sign up with Google</span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400 font-medium bg-white dark:bg-gray-800 px-2">or</span>
              <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            {/* Form */}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com" 
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password" 
                    className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600 pr-10`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase">Repeat password</label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password" 
                  className={`w-full px-4 py-3 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'} bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-400 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600`}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-black dark:bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-gray-800 dark:hover:bg-blue-500 transition-all duration-300 transform active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Sign up"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
              Already have an account? <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        {/* Right Side: Visual Section */}
        <div className="hidden md:block w-1/2 relative bg-[#0f172a] overflow-hidden">
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
                 alt="Background" 
                 className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
            
            <div className="relative h-full w-full flex items-center justify-center p-8">
                <div className="relative w-full max-w-sm aspect-[4/5] overflow-hidden rounded-[2rem] border-[8px] border-slate-800/50 shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700">
                    <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=2070" 
                         alt="App Mockup" 
                         className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                        <div className="space-y-2">
                            <span className="inline-block px-2 py-1 bg-cyan-400/20 backdrop-blur-md rounded text-[9px] font-bold text-cyan-300 uppercase tracking-widest border border-cyan-400/30">
                                SkillsandScale Academy
                            </span>
                            <h2 className="text-2xl font-bold leading-tight">Master Design &<br/>Development</h2>
                        </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 cursor-pointer hover:scale-110 transition-transform">
                            <Play size={20} className="text-white fill-white ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;