import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      // Calls http://localhost:5000/api/auth/login
      const res = await api.post('/auth/login', { email, password });

      if (res.data.role === 'master-admin' || res.data.role === 'sub-admin') {
        login(res.data);
        navigate('/admin');
      } else {
        setError('Access Denied: You do not have admin privileges.');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || 'Login failed. Check server connection.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <ShieldCheck className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Portal</h1>
        </div>

        {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-sm rounded-lg text-center">{error}</div>}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input
            type="email" placeholder="Email" required
            className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password" placeholder="Password" required
            className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl outline-none focus:border-blue-500"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
            Login <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;