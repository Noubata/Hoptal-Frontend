import { Outlet } from 'react-router-dom';
import LabSidebar from './LabSidebar.jsx';
import Topbar from './Topbar.jsx';

export default function LabLayout() {
  return (
    <div className="app-shell">
      <LabSidebar />
      <div className="app-content">
        <Topbar title="Laborantin" />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
