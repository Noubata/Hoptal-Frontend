import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { label: 'Analyses en attente', to: '/laborantin/dashboard' },
  { label: 'Terminées', to: '/laborantin/completed' }
];

export default function LabSidebar() {
  const { nomUtilisateur, logout } = useAuth();

  return (
    <aside className="app-sidebar lab-sidebar">
      <div className="sidebar-brand">
        <strong>Hoptal</strong>
        <span>LAB PANEL</span>
      </div>
      <div className="sidebar-user">
        <div className="avatar lab-avatar">{nomUtilisateur?.charAt(0) || 'L'}</div>
        <div>
          <p className="user-name">{nomUtilisateur || 'Laborantin'}</p>
          <p className="user-role">LABORANTIN</p>
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
