import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLaborantins, getDemandesEnAttente } from '../../api/laborantinApi.js';

export default function LabDashboard() {
  const navigate = useNavigate();
  const [laborantinId, setLaborantinId] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function initLaborantin() {
      try {
        const token = localStorage.getItem('hoptal_token');
        if (!token) throw new Error('No token found');
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const username = decoded.sub;

        const res = await getLaborantins();
        const data = res.data?.data ?? res.data ?? [];
        const lab = data.find(l => l.nomUtilisateur === username);
        if (lab?.id) {
          setLaborantinId(lab.id);
        } else {
          setError('Laborantin introuvable');
          setLoading(false);
        }
      } catch (err) {
        setError("Erreur d'authentification ou récupération du laborantin");
        setLoading(false);
      }
    }
    initLaborantin();
  }, []);

  useEffect(() => {
    if (!laborantinId) return;

    async function loadDemandes() {
      try {
        const res = await getDemandesEnAttente(laborantinId);
        const data = res.data?.data ?? res.data ?? [];
        setDemandes(data);
        setError('');
      } catch (err) {
        setError('Impossible de charger les demandes en attente.');
      } finally {
        setLoading(false);
      }
    }

    loadDemandes();
    const interval = setInterval(loadDemandes, 30000)
    return () => clearInterval(interval);
  }, [laborantinId]);

  const now = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>

      <div style={{
        background: 'var(--lab-accent-green)',
        borderRadius: '20px',
        padding: '32px 40px',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: '64px', fontWeight: 800, lineHeight: 1, marginBottom: '8px' }}>
            {demandes.length}
          </div>
          <div style={{ fontSize: '14px', opacity: 0.8, fontWeight: 500 }}>
            analyses en attente · triées par ordre d'arrivée
          </div>
        </div>
        <div style={{ fontSize: '60px', opacity: 0.2 }}>🔬</div>
      </div>

      <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{
          padding: '16px 40px',
          borderBottom: '1px solid #F0F0EE',
          fontSize: '10px',
          fontWeight: 700,
          color: 'rgba(0,0,0,0.2)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase'
        }}>
          File d'attente — Les plus anciennes en premier
        </div>

        {loading ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'rgba(0,0,0,0.4)' }}>Chargement des analyses...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--lab-danger)' }}>{error}</div>
        ) : demandes.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', color: 'rgba(0,0,0,0.4)', fontStyle: 'italic' }}>
            Aucune analyse en attente pour le moment.
          </div>
        ) : (
          <div>
            {demandes.map((demande, index) => (
              <div
                key={demande.id}
                style={{
                  padding: '24px 40px',
                  borderBottom: index === demandes.length - 1 ? 'none' : '1px solid #F0F0EE',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '32px'
                }}
              >
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: 'rgba(11, 48, 32, 0.3)', width: '30px' }}>
                  {(index + 1).toString().padStart(2, '0')}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 700, color: '#1B1A17' }}>
                    {demande.nomDuTest}
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'rgba(0,0,0,0.4)', fontWeight: 500 }}>
                    {demande.patientNom} {demande.patientPrenom} · {demande.patientNumeroDossier}
                  </p>
                </div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '13px', color: '#1B1A17', opacity: 0.6 }}>
                  {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
                <button
                  onClick={() => navigate(`/laborantin/resultats/${demande.id}/saisir`)}
                  style={{
                    background: '#0B3020',
                    color: 'white',
                    border: 'none',
                    padding: '10px 24px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  Saisir <span style={{ opacity: 0.5 }}>→</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
