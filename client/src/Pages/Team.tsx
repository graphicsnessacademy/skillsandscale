import { useState, useEffect } from 'react';
import { Mail, Phone, Loader2 } from 'lucide-react';
import api from '../utils/api';

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  image: string;
  phone?: string;
  email?: string;
}

const Team = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get('/team');
        setTeamMembers(response.data.team);
      } catch {
        console.error("Error loading team");
      }
      finally { setLoading(false); }
    };
    fetchTeam();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <main className="pt-40 pb-16 bg-white dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">
            Meet the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#81007F] to-[#4B0081]">Creative Minds</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Our elite team of designers and strategists.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {teamMembers && teamMembers.map((member) => (
            <div key={member._id} className="group bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:-translate-y-1">
              <div className="relative aspect-square mb-3 overflow-hidden rounded-xl shadow-md">
                {/* grayscale effect remains identical to your design */}
                <img src={member.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" alt={member.name} />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5">{member.name}</h3>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{member.role}</p>
                <div className="flex justify-center gap-4">
                  <a href={`tel:${member.phone} `} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#81007F] hover:to-[#4B0081] hover:text-white transition-all shadow-sm">
                    <Phone size={14} />
                  </a>
                  <a href={`mailto:${member.email} `} className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gradient-to-r hover:from-[#81007F] hover:to-[#4B0081] hover:text-white transition-all shadow-sm">
                    <Mail size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Team;