import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDoctors, activerDesactiverUser } from '../../api/doctorApi.js';

export default function AdminDoctors() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await searchDoctors(query.trim());
      const data = response.data?.data ?? response.data ?? [];
      setDoctors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur médecins:', err?.response?.data);
      setError(err?.response?.data?.message || 'Impossible de charger les médecins.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(loadDoctors, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const toggleStatus = async (doctor) => {
  try {
    await activerDesactiverUser(doctor.userId, !doctor.actif);
    // Mettre à jour le state local immédiatement sans recharger
    setDoctors(prev =>
      prev.map(d =>
        d.userId === doctor.userId
          ? { ...d, actif: !doctor.actif }
          : d
      )
    );
  } catch (err) {
    console.error('Erreur toggle:', err?.response?.data);
    setError('Impossible de modifier le statut.');
  }
};

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#6B7280', marginBottom: 4 }}>
            Médecins
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Liste des médecins
          </h1>
        </div>
        <button
          style={{ background: '#1B6B45', color: 'white', padding: '9px 18px', borderRadius: '7px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/admin/doctors/nouveau')}
        >
          + Nouveau médecin
        </button>
      </header>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Rechercher par nom..."
          style={{ flex: 1, maxWidth: '400px', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '8px', fontSize: '14px' }}
        />
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Chargement...</div>
        ) : error ? (
          <div style={{ background: '#FEF0EE', color: '#D94F38', padding: '14px', borderRadius: '8px', margin: '20px' }}>
            {error}
          </div>
        ) : doctors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280', fontStyle: 'italic' }}>
            Aucun médecin trouvé.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  NOM
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  SPÉCIALITÉ
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  DÉPARTEMENT
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  LICENCE
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  COMPTE
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(d => (
                <tr key={d.id || d.numeroDeLicence || d.nomUtilisateur} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', fontWeight: 600 }}>
                    Dr. {d.nom} {d.prenom}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>
                    {d.specialiteNom || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>
                    {d.departementNom || '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '12px', fontFamily: "'DM Mono', monospace", fontWeight: 600, color: '#6B7280' }}>
                    {d.numeroDeLicence || '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: (d.actif ?? true) ? '#E8F5EE' : '#FEF0EE',
                      color: (d.actif ?? true) ? '#1B6B45' : '#D94F38'
                    }}>
                      {(d.actif ?? true) ? 'ACTIF' : 'INACTIF'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', display: 'flex', gap: '8px' }}>
                    <button
                      style={{ background: 'none', border: 'none', color: '#1B6B45', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none' }}
                      onClick={() => navigate(`/admin/doctors/${d.id}`)}
                    >
                      Voir
                    </button>
                    <button
                      style={{
                        background: (d.actif ?? true) ? '#FEF0EE' : '#1B6B45',
                        color: (d.actif ?? true) ? '#D94F38' : 'white',
                        border: (d.actif ?? true) ? '1px solid #D94F38' : 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                      onClick={() => toggleStatus(d)}
                    >
                      {(d.actif ?? true) ? 'Désactiver' : 'Activer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
