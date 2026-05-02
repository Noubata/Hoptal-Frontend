import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDoctorByNomUtilisateur } from '../../api/doctorApi.js';
import { getDoctorPatients } from '../../api/releveApi.js';

const bloodTypeLabel = {
  A_POSITIF: 'A+',
  A_NEGATIF: 'A-',
  B_POSITIF: 'B+',
  B_NEGATIF: 'B-',
  AB_POSITIF: 'AB+',
  AB_NEGATIF: 'AB-',
  O_POSITIF: 'O+',
  O_NEGATIF: 'O-'
};
export default function DoctorDashboard() {
  const { nomUtilisateur } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('hoptal_token');
      if (!token) { setError('Token manquant.'); return; }
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const username = decoded.sub; // 'dr.ali'

      const connectedDoctor = await getDoctorByNomUtilisateur(username);
      if (!connectedDoctor) { setError('Compte médecin introuvable.'); return; }

      setDoctor(connectedDoctor);
      const patientsResponse = await getDoctorPatients(connectedDoctor.id);
      const patientsData = patientsResponse.data?.data ?? patientsResponse.data ?? [];
      setPatients(Array.isArray(patientsData) ? patientsData : []);
    } catch (err) {
      console.error('Erreur DoctorDashboard:', err);
      setError('Impossible de charger le tableau de bord.');
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, []); // ← tableau vide — plus de dépendance sur nomUtilisateur

  const recentPatients = useMemo(() => [...patients].slice(0, 5), [patients]);

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', background: '#1B6B45', borderRadius: 12, padding: 24, marginBottom: 24, color: 'white' }}>
        <div style={{ maxWidth: 620 }}>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 800, margin: 0 }}>Démarrer une consultation</h1>
          <p style={{ marginTop: 10, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
            Recherchez un patient pour ouvrir son dossier
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/doctor/rechercher-patient')}
          style={{ background: '#E8F5EE', color: '#1B6B45', border: 'none', borderRadius: 10, padding: '12px 24px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
        >
          🔍 Rechercher un patient →
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#FFFFFF', borderRadius: 16, borderLeft: '4px solid #1B6B45', padding: 20, minHeight: 140 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 24 }}>📋</span>
            <div>
              <div style={{ fontSize: 40, fontFamily: 'Fraunces, serif', fontWeight: 800, color: '#1B6B45' }}>0</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Consultations aujourd'hui</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, borderLeft: '4px solid #22874F', padding: 20, minHeight: 140 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 24 }}>👥</span>
            <div>
              <div style={{ fontSize: 40, fontFamily: 'Fraunces, serif', fontWeight: 800, color: '#22874F' }}>{patients.length}</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Mes patients</div>
            </div>
          </div>
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 16, borderLeft: '4px solid #3DB87A', padding: 20, minHeight: 140 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
            <span style={{ fontSize: 24 }}>🩺</span>
            <div>
              <div style={{ fontSize: 40, fontFamily: 'Fraunces, serif', fontWeight: 800, color: '#3DB87A' }}>{doctor?.specialiteNom || '—'}</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>Spécialité</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 700, margin: 0, color: '#111827' }}>Derniers patients consultés</h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('/doctor/rechercher-patient')}
            style={{ background: 'transparent', border: 'none', color: '#1B6B45', fontWeight: 700, cursor: 'pointer' }}
          >
            Rechercher un patient →
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: '#6B7280' }}>Chargement...</div>
        ) : error ? (
          <div style={{ padding: '24px', background: '#FEF0EE', borderRadius: 12, color: '#D94F38' }}>{error}</div>
        ) : recentPatients.length === 0 ? (
          <div style={{ padding: '24px', color: '#6B7280' }}>Aucun patient trouvé pour le moment.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>
                  <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>NUMÉRO DOSSIER</th>
                  <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>NOM COMPLET</th>
                  <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TÉLÉPHONE</th>
                  <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>GROUPE SANGUIN</th>
                  <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>STATUT</th>
                  <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {recentPatients.map((patient) => (
                  <tr key={patient.id || patient.numeroDossier || patient.nomUtilisateur} style={{ borderBottom: '1px solid #F3F4F6' }}>
                    <td style={{ padding: '14px 12px', fontFamily: 'DM Mono, monospace', color: '#111827' }}>{patient.numeroDossier || '—'}</td>
                    <td style={{ padding: '14px 12px', color: '#111827' }}>{`${patient.nom || ''} ${patient.prenom || ''}`.trim() || '—'}</td>
                    <td style={{ padding: '14px 12px', color: '#111827' }}>{patient.telephone || '—'}</td>
                    <td style={{ padding: '14px 12px', color: '#111827' }}>{bloodTypeLabel[patient.typeSang] || '—'}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, fontSize: 12, background: (patient.statut || 'ACTIF') === 'ACTIF' ? '#E8F5EE' : '#FEF2F2', color: (patient.statut || 'ACTIF') === 'ACTIF' ? '#166534' : '#B91C1C' }}>
                        {(patient.statut || 'ACTIF') === 'ACTIF' ? 'ACTIF' : 'INACTIF'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 12px' }}>
                      <button
                        type="button"
                        onClick={() => navigate(`/doctor/patients/${patient.id}/dossier`)}
                        style={{ background: '#1B6B45', color: 'white', border: 'none', borderRadius: 10, padding: '10px 16px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Ouvrir →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
