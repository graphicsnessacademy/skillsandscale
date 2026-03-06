import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './Components/ProtectedRoute';

import Header from './Components/Header';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import Courses from './Pages/Courses';
import CourseDetail from './Pages/CourseDetail';
import Services from './Pages/Services';
import Contact from './Pages/Contact';
import Certification from './Pages/Certification';
import Team from './Pages/Team';
import ScrollToTop from './Components/ScrollToTop';
import SmartNotFound from './Components/SmartNotFound';
import PaymentSuccess from './Pages/PaymentSuccess';
import PaymentFail from './Pages/PaymentFail';
import Search from './Pages/Search';
import AdminLogin from './Pages/Admin/AdminLogin';
import AdminLayout from './Pages/Admin/AdminLayout';
import Dashboard from './Pages/Admin/Dashboard';
import CourseManager from './Pages/Admin/CourseManager';
import ServiceManager from './Pages/Admin/ServiceManager';
import TeamManager from './Pages/Admin/TeamManager';
import StudentManager from './Pages/Admin/StudentManager';
import MessageManager from './Pages/Admin/MessageManager';
import ProjectManager from './Pages/Admin/ProjectManager';
import Settings from './Pages/Admin/Settings';

const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <div className="flex-grow">
      <Outlet />
    </div>
    <Footer />
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>

          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/certification" element={<Certification />} />
          </Route>


          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />


          <Route path="/admin/login" element={<AdminLogin />} />

          <Route element={<ProtectedRoute allowedRoles={['sub-admin', 'master-admin']} />}>
            <Route path="/admin" element={<AdminLayout />}>

              <Route index element={<Dashboard />} />

              <Route path="courses" element={<CourseManager />} />
              <Route path="students" element={<StudentManager />} />
              <Route path="services" element={<ServiceManager />} />
              <Route path="team" element={<TeamManager />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="settings" element={<Settings />} />

              <Route path="messages" element={<MessageManager />} />
              <Route path="notifications" element={<div className="p-8 text-slate-800 dark:text-white font-bold text-2xl">Notifications Center (Coming Soon)</div>} />

              <Route element={<ProtectedRoute allowedRoles={['master-admin']} />}>
                <Route path="staff" element={<Settings />} />
              </Route>

              <Route path="certs" element={<div className="p-8 text-slate-800 dark:text-white font-bold text-2xl">Certification Registry (Coming Soon)</div>} />

            </Route>
          </Route>

          <Route path="*" element={<SmartNotFound />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
