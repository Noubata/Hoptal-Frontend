import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Patients', to: '/admin/patients' },
  { label: 'Médecins', to: '/admin/doctors' },
  { label: 'Laborantins', to: '/admin/laborantins' },
  { label: 'Départements', to: '/admin/departements' }
];

export default function Sidebar() {
  const { nomUtilisateur, role, logout } = useAuth();

  return (
    <aside className="app-sidebar">
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", fontWeight: 900,
                     color: "white", whiteSpace: "nowrap", lineHeight: 1.2 }}>
        Hop<span style={{ color: "#3DB87A" }}>tal</span>
      </div>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: "9px",
                     color: "rgba(255,255,255,0.35)", letterSpacing: "2px",
                     marginTop: "4px" }}>
        ADMIN PANEL
      </div>

      <div className="sidebar-user">
        <div className="avatar">{nomUtilisateur?.charAt(0) || 'H'}</div>
        <div>
          <p className="user-name">{nomUtilisateur || 'Utilisateur'}</p>
          <p className="user-role">{role || 'ADMIN'}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}
          >
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
