import { Outlet } from 'react-router-dom';
import DoctorSidebar from './DoctorSidebar.jsx';
import Topbar from './Topbar.jsx';

export default function DoctorLayout() {
  return (
    <div className="app-shell">
      <DoctorSidebar />
      <div className="app-content">
        <Topbar title="Médecin" />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
