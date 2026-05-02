import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDossierComplet } from '../../api/patientApi.js';

const bloodTypeMap = {
  A_POSITIF: 'A+', A_NEGATIF: 'A-', B_POSITIF: 'B+', B_NEGATIF: 'B-',
  O_POSITIF: 'O+', O_NEGATIF: 'O-', AB_POSITIF: 'AB+', AB_NEGATIF: 'AB-'
};

export default function AdminPatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getDossierComplet(id);
        const data = res.data?.data ?? res.data;
        setDossier(data);
      } catch (err) {
        setError('Impossible de charger le dossier patient.');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const s = { card: { background: 'white', borderRadius: 12, border: '1px solid #E5E7EB', padding: 24, marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }, label: { fontSize: 11, color: '#6B7280', fontFamily: "'DM Mono',monospace", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }, value: { fontSize: 14, fontWeight: 600, color: '#111827' }, grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }, sectionTitle: { fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, color: '#1B6B45', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #E5E7EB' } };

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#6B7280' }}>Chargement du dossier...</div>
  );

  if (error) return (
    <div style={{ padding: 20 }}>
      <div style={{ background: '#FEF0EE', color: '#D94F38', padding: 14, borderRadius: 8, marginBottom: 16 }}>{error}</div>
      <button onClick={() => navigate('/admin/patients')} style={{ background: 'white', color: '#1B6B45', border: '1.5px solid #1B6B45', padding: '9px 18px', borderRadius: 7, fontWeight: 600, cursor: 'pointer' }}>← Retour à la liste</button>
    </div>
  );

  if (!dossier) return null;

  const p = dossier.patient;

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px' }}>
      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: 2, color: '#6B7280', marginBottom: 4 }}>Dossier patient</div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontSize: 26, fontWeight: 'bold', color: '#111827', margin: 0 }}>{p?.nom} {p?.prenom}</h1>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 12, color: '#3DB87A', marginTop: 4 }}>{p?.numeroDossier}</div>
        </div>
        <button onClick={() => navigate('/admin/patients')} style={{ background: 'white', color: '#1B6B45', border: '1.5px solid #1B6B45', padding: '9px 18px', borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>← Retour à la liste</button>
      </header>

      {/* ALERTES ALLERGIES */}
      {dossier.allergies?.length > 0 && (
        <div style={{ background: '#FEF0EE', border: '2px solid #D94F38', borderRadius: 10, padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 12 }}>
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontFamily: "'Fraunces',serif", fontSize: 14, fontWeight: 700, color: '#D94F38', marginBottom: 4 }}>
              ALERTE ALLERGIE — {dossier.allergies.length} allergie(s) connue(s)
            </div>
            <div style={{ fontSize: 12, color: '#D94F38' }}>
              {dossier.allergies.map(a => `${a.substance} (${a.severite})`).join(' · ')}
            </div>
          </div>
        </div>
      )}

      <div style={s.card}>
        <div style={s.sectionTitle}>Informations personnelles</div>
        <div style={s.grid}>
          <div><div style={s.label}>Nom complet</div><div style={s.value}>{p?.nom} {p?.prenom}</div></div>
          <div><div style={s.label}>Date de naissance</div><div style={s.value}>{p?.dateDeNaissance ? new Date(p.dateDeNaissance).toLocaleDateString('fr-FR') : '—'}</div></div>
          <div><div style={s.label}>Genre</div><div style={s.value}>{p?.genre || '—'}</div></div>
          <div><div style={s.label}>Groupe sanguin</div><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ background: '#E0F2FE', color: '#0284C7', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{bloodTypeMap[p?.typeSang] || p?.typeSang || '—'}</span></div></div>
          <div><div style={s.label}>Téléphone</div><div style={s.value}>{p?.telephone || '—'}</div></div>
          <div><div style={s.label}>Email</div><div style={s.value}>{p?.email || '—'}</div></div>
          <div><div style={s.label}>Adresse</div><div style={s.value}>{p?.adresse || '—'}</div></div>
          <div><div style={s.label}>Hôpital</div><div style={s.value}>{p?.hopitalNom || '—'}</div></div>
          <div><div style={s.label}>Contact urgence</div><div style={s.value}>{p?.nomContactUrgence || '—'}</div></div>
          <div><div style={s.label}>Tél. urgence</div><div style={s.value}>{p?.telephoneContactUrgence || '—'}</div></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={s.card}>
          <div style={{ ...s.sectionTitle, color: '#D94F38' }}>🚨 Allergies</div>
          {dossier.allergies?.length === 0 ? (
            <div style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic' }}>Aucune allergie connue</div>
          ) : (
            dossier.allergies?.map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: 13, color: '#111827', fontWeight: 500 }}>{a.substance}</span>
                <span style={{ background: '#FEF0EE', color: '#D94F38', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>{a.severite}</span>
              </div>
            ))
          )}
        </div>
        <div style={s.card}>
          <div style={{ ...s.sectionTitle, color: '#D97706' }}>📋 Antécédents</div>
          {dossier.antecedents?.length === 0 ? (
            <div style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic' }}>Aucun antécédent</div>
          ) : (
            dossier.antecedents?.map((a, i) => (
              <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #F3F4F6' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{a.description}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{a.type} {a.chronique ? '· Chronique' : ''}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={s.card}>
        <div style={{ ...s.sectionTitle, color: '#0284C7' }}>💊 Prescriptions actives</div>
        {dossier.prescriptionsActives?.length === 0 ? (
          <div style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic' }}>Aucune prescription active</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {dossier.prescriptionsActives?.map((p, i) => (
              <div key={i} style={{ background: '#F9FAFB', borderRadius: 8, padding: 12, border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{p.nomDuMedicament}</div>
                <div style={{ fontSize: 12, color: '#374151' }}>{p.dosage} · {p.frequence}</div>
                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>Durée : {p.duree}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={s.card}>
        <div style={{ ...s.sectionTitle, color: '#1B6B45' }}>🔬 Derniers résultats labo</div>
        {dossier.derniersResultats?.length === 0 ? (
          <div style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic' }}>Aucun résultat disponible</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['TEST', 'RÉSULTAT', 'VALEUR NORMALE', 'DATE', 'STATUT'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, fontWeight: 600, color: '#6B7280', fontFamily: "'DM Mono',monospace", letterSpacing: 1, borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dossier.derniersResultats?.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#111827' }}>{r.nomDuTest}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontFamily: "'DM Mono',monospace", color: '#374151' }}>{r.resultat} {r.unite}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#6B7280' }}>{r.valeurNormale || '—'}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#6B7280' }}>{r.dateDeTest ? new Date(r.dateDeTest).toLocaleDateString('fr-FR') : '—'}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{ background: r.anomalie ? '#FEF0EE' : '#E8F5EE', color: r.anomalie ? '#D94F38' : '#1B6B45', padding: '2px 8px', borderRadius: 10, fontSize: 11, fontWeight: 600 }}>
                      {r.anomalie ? 'Anormal' : 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={s.card}>
        <div style={s.sectionTitle}>📅 Historique des consultations</div>
        {dossier.derniersReleves?.length === 0 ? (
          <div style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic' }}>Aucune consultation enregistrée</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F9FAFB' }}>
                {['DATE', 'MÉDECIN', 'DIAGNOSTIC', 'TYPE'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, fontWeight: 600, color: '#6B7280', fontFamily: "'DM Mono',monospace", letterSpacing: 1, borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dossier.derniersReleves?.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #F3F4F6' }}>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontFamily: "'DM Mono',monospace", color: '#6B7280' }}>{r.dateDeVisite ? new Date(r.dateDeVisite).toLocaleDateString('fr-FR') : '—'}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#111827' }}>Dr. {r.doctorNom} {r.doctorPrenom}</td>
                  <td style={{ padding: '10px 12px', fontSize: 13, color: '#374151' }}>{r.diagnostic || '—'}</td>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: '#6B7280' }}>{r.typeVisite || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}