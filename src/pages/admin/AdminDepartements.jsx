import { useNavigate } from 'react-router-dom';

export default function AdminDepartements() {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '40px', textAlign: 'center', maxWidth: '500px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏥</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '28px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
          Fonctionnalité à venir
        </h1>
        <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '24px', lineHeight: '1.5' }}>
          La gestion des départements sera disponible dans une prochaine version.
          <br />
          Pour l'instant, les départements sont configurés directement en base de données
          lors de l'initialisation du système.
        </p>
        <button
          style={{ background: '#1B6B45', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/admin/dashboard')}
        >
          Retour au dashboard
        </button>
      </div>
    </section>
  );
}
