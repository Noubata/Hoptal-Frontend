import { Outlet } from 'react-router-dom';
import Topbar from './Topbar.jsx';

export default function PatientLayout() {
  return (
    <div className="patient-shell">
      <Topbar title="Mon dossier" />
      <main className="page-content patient-page">
        <Outlet />
      </main>
    </div>
  );
}
