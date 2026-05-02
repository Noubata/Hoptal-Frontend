import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { label: 'Dashboard', to: '/doctor/dashboard' },
  { label: 'Rechercher patient', to: '/doctor/rechercher-patient' }
];

export default function DoctorSidebar() {
  const { nomUtilisateur, logout } = useAuth();

  return (
    <aside className="app-sidebar doctor-sidebar">
      <div className="sidebar-brand">
        <strong>Hoptal</strong>
        <span>DOCTOR PANEL</span>
      </div>
      <div className="sidebar-user">
        <div className="avatar">{nomUtilisateur?.charAt(0) || 'D'}</div>
        <div>
          <p className="user-name">{nomUtilisateur || 'Médecin'}</p>
          <p className="user-role">DOCTOR</p>
        </div>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button type="button" className="sidebar-logout" onClick={logout}>
        Se déconnecter
      </button>
    </aside>
  );
}
