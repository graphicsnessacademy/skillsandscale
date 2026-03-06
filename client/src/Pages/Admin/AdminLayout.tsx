import { Outlet } from 'react-router-dom';
import Sidebar from '../../Components/Admin/Sidebar';
import TopHeader from '../../Components/Admin/TopHeader';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopHeader />
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;