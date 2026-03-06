import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation(); // 1. Hook into the current URL location

  // 2. Show a loading screen while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white font-medium flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          Verifying Access...
        </div>
      </div>
    );
  }

  // 3. LOGIC FIX: Determine where to redirect
  if (!user || !allowedRoles.includes(user.role)) {
    // Check if the user was trying to access any path starting with /admin
    const isAdminRoute = location.pathname.startsWith('/admin');

    // If it's an admin route, send to /admin/login. Otherwise, send to public /login
    return <Navigate to={isAdminRoute ? "/admin/login" : "/login"} replace />;
  }

  // 4. If authorized, render the Admin Layout
  return <Outlet />;
};

export default ProtectedRoute;