import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLaborantins, activerDesactiverUser } from '../../api/laborantinApi.js';

export default function AdminLaborantins() {
  const navigate = useNavigate();
  const [laborantins, setLaborantins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true); 
      setError('');
      try {
        const response = await getLaborantins();
        const data = response.data?.data ?? response.data ?? [];
        setLaborantins(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Erreur laborantins:', err?.response?.data);
        setError(err?.response?.data?.message || 'Impossible de charger les laborantins.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const toggleStatus = async (lab) => {
  const targetId = lab.UserId;

  if (!targetId) {
    console.error("No UserId found:", lab);
    return;
  }

  try {
    await activerDesactiverUser(targetId, !lab.actif);
    setLaborantins(prev =>
      prev.map(item =>
        item.UserId === targetId ? { ...item, actif: !lab.actif } : item
      )
    );
  } catch (err) {
    console.error('Erreur toggle:', err.response?.data);
    setError('Impossible de changer le statut.');
  }
};
  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#6B7280', marginBottom: 4 }}>
            Laborantins
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Liste des laborantins
          </h1>
        </div>
        <button
          style={{ background: '#1B6B45', color: 'white', padding: '9px 18px', borderRadius: '7px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/admin/laborantins/nouveau')}
        >
          + Nouveau laborantin
        </button>
      </header>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>Chargement...</div>
        ) : error ? (
          <div style={{ background: '#FEF0EE', color: '#D94F38', padding: '14px', borderRadius: '8px', margin: '20px' }}>
            {error}
          </div>
        ) : laborantins.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280', fontStyle: 'italic' }}>
            Aucun laborantin trouvé.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  NOM
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  PRÉNOM
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  SERVICE
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  TÉLÉPHONE
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  EMAIL
                </th>
                <th style={{ textAlign: 'left', padding: '10px 16px', fontSize: '10px', fontWeight: 600, color: '#6B7280', borderBottom: '1px solid #E5E7EB', fontFamily: "'DM Mono', monospace", letterSpacing: '0.5px', textTransform: 'uppercase', background: '#F9FAFB' }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
  {laborantins.map((lab) => (
    /* 1. Update key to use userId (capital I) */
    <tr key={lab.UserId} style={{ borderBottom: '1px solid #F3F4F6' }}>
      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', fontWeight: 600 }}>
        {lab.nom || '—'}
      </td>
      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#111827', fontWeight: 600 }}>
        {lab.prenom || '—'}
      </td>
      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>
        {lab.serviceNom || '—'}
      </td>
      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>
        {lab.numeroDeTelephone || '—'}
      </td>
      <td style={{ padding: '12px 16px', fontSize: '13px', color: '#374151' }}>
        {lab.email || '—'}
      </td>
      <td style={{ padding: '12px 16px' }}>
        <button
          style={{ 
            /* 2. Dynamic styling based on the 'actif' boolean */
            background: lab.actif === false ? '#1B6B45' : '#FEF0EE', 
            color: lab.actif === false ? 'white' : '#D94F38',
            border: lab.actif === false ? 'none' : '1px solid #D94F38',
            padding: '6px 12px', 
            borderRadius: '6px', 
            fontSize: '12px', 
            fontWeight: 600, 
            cursor: 'pointer' 
          }}
          onClick={() => toggleStatus(lab)}
        >
          {/* 3. Dynamic text logic */}
          {lab.actif === false ? 'Activer' : 'Désactiver'}
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