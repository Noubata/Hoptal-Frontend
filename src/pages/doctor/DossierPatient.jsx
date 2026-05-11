import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatientDossierComplet } from '../../api/releveApi.js';

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

const severityStyles = {
  LEGERE: { background: '#FEF3C7', color: '#92400E' },
  MODEREE: { background: '#FEF3C7', color: '#92400E' },
  SEVERE: { background: '#FEE2E2', color: '#991B1B' },
  MORTELLE: { background: '#FEE2E2', color: '#7F1D1D' }
};

export default function DossierPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadDossier() {
      setLoading(true);
      setError('');
      try {
        const response = await getPatientDossierComplet(id);
        const dossierData = response.data?.data ?? response.data ?? null;
        setDossier(dossierData);
      } catch (err) {
        console.error('Erreur dossier patient:', err);
        setError('Impossible de charger le dossier patient.');
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      loadDossier();
    }
  }, [id]);

  const allergies = useMemo(() => dossier?.allergies ?? [], [dossier]);
  const antecedents = useMemo(() => dossier?.antecedents ?? [], [dossier]);
  const prescriptions = useMemo(() => dossier?.prescriptionsActives ?? [], [dossier]);
  const results = useMemo(() => dossier?.derniersResultats ?? [], [dossier]);
  const releves = useMemo(() => dossier?.derniersReleves ?? [], [dossier]);

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px', minHeight: '100vh' }}>
      <div style={{ background: '#1B6B45', borderRadius: 18, padding: '28px 32px', color: 'white', marginBottom: 24 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              {`${dossier?.patient?.nom?.[0] || ''}${dossier?.patient?.prenom?.[0] || ''}`.toUpperCase()}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>Dossier patient</p>
              <h1 style={{ margin: '8px 0 0', fontFamily: 'Fraunces, serif', fontSize: 22, fontWeight: 800 }}>{`${dossier?.patient?.nom || ''} ${dossier?.patient?.prenom || ''}`.trim() || 'Patient inconnu'}</h1>
            </div>
          </div>
          <div style={{ marginLeft: 'auto', minWidth: 240, padding: '16px 20px', borderRadius: 16, background: 'rgba(255,255,255,0.12)' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginBottom: 6 }}>Groupe sanguin</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 800 }}>{bloodTypeLabel[dossier?.patient?.typeSang] || '—'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 22 }}>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{dossier?.patient?.genre || 'Genre inconnu'}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>·</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{dossier?.patient?.dateDeNaissance || 'Date de naissance inconnue'}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>·</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>{dossier?.patient?.telephone || 'Téléphone inconnu'}</div>
        </div>

        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: '#3DB87A', background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '8px 12px' }}>{dossier?.patient?.numeroDossier || 'DPI-XXXX'}</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
        <button
          type="button"
          onClick={() => navigate(`/doctor/patients/${id}/nouvelle-consultation`)}
          style={{ background: '#1B6B45', color: 'white', border: 'none', borderRadius: 12, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
        >
          ➕ Nouvelle consultation
        </button>
        <button
          type="button"
          onClick={() => navigate(`/doctor/patients/${id}/allergies/ajouter`)}
          style={{ background: 'white', color: '#D94F38', border: '1.5px solid #D94F38', borderRadius: 12, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
        >
          ➕ Ajouter allergie
        </button>
        <button
          type="button"
          onClick={() => navigate(`/doctor/patients/${id}/antecedents/ajouter`)}
          style={{ background: 'white', color: '#D97706', border: '1.5px solid #D97706', borderRadius: 12, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
        >
          ➕ Ajouter antécédent
        </button>
        <button
          type="button"
          onClick={() => navigate('/doctor/rechercher-patient')}
          style={{ background: 'transparent', color: '#111827', border: '1px solid #D1D5DB', borderRadius: 12, padding: '12px 20px', fontWeight: 700, cursor: 'pointer' }}
        >
          ← Retour recherche
        </button>
      </div>

      {loading ? (
        <div style={{ padding: 24, background: 'white', borderRadius: 16, color: '#6B7280' }}>Chargement du dossier...</div>
      ) : error ? (
        <div style={{ padding: 24, background: '#FEF0EE', borderRadius: 16, color: '#D94F38' }}>{error}</div>
      ) : !dossier ? (
        <div style={{ padding: 24, background: 'white', borderRadius: 16, color: '#6B7280' }}>Aucune donnée disponible.</div>
      ) : (
        <>
          {allergies.length > 0 && (
            <div style={{ background: '#FEF0EE', border: '2px solid #D94F38', borderRadius: 12, padding: 18, marginBottom: 24, color: '#92400E' }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>⚠️ ALERTE ALLERGIE — {allergies.length} allergie(s) connue(s)</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {allergies.map((item, index) => (
                  <span key={index} style={{ fontSize: 14 }}>{item.substance || 'Substance inconnue'} ({item.severite || 'N/A'})</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 16, color: '#D94F38' }}>🚨 Allergies</h3>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{allergies.length} trouvé(s)</span>
              </div>
              {allergies.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#6B7280' }}>Aucune allergie connue</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                  {allergies.map((item, index) => (
                    <li key={index} style={{ borderRadius: 12, padding: '14px 16px', background: '#FEF2F2', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <div>
                        <div style={{ fontWeight: 700, color: '#991B1B' }}>{item.substance || 'Substance inconnue'}</div>
                        <div style={{ fontSize: 13, color: '#6B7280', marginTop: 6 }}>{item.reaction || 'Réaction non renseignée'}</div>
                      </div>
                      <span style={{ borderRadius: 999, padding: '6px 12px', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', background: severityStyles[item.severite]?.background || '#F3F4F6', color: severityStyles[item.severite]?.color || '#111827' }}>{item.severite || 'N/A'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 16, color: '#D97706' }}>📋 Antécédents</h3>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{antecedents.length} trouvé(s)</span>
              </div>
              {antecedents.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#6B7280' }}>Aucun antécédent</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                  {antecedents.map((item, index) => (
                    <li key={index} style={{ borderRadius: 12, padding: '14px 16px', background: '#FEF7C3' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ background: '#FEF3C7', color: '#92400E', borderRadius: 999, padding: '4px 10px', fontSize: 12, fontWeight: 700 }}>{item.type || 'Type inconnu'}</span>
                        <span style={{ fontSize: 12, color: '#6B7280' }}>{item.dateDebut || ''}</span>
                      </div>
                      <div style={{ fontWeight: 700, color: '#92400E' }}>{item.description || 'Description non renseignée'}</div>
                      {item.notes && <div style={{ marginTop: 6, fontSize: 13, color: '#6B7280' }}>{item.notes}</div>}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 16, color: '#0284C7' }}>💊 Prescriptions actives</h3>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{prescriptions.length} trouvé(s)</span>
              </div>
              {prescriptions.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#6B7280' }}>Aucune prescription active</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                  {prescriptions.map((item, index) => (
                    <li key={index} style={{ borderRadius: 12, padding: '14px 16px', background: '#EFF6FF' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A' }}>{item.nomDuMedicament || 'Médicament inconnu'}</div>
                      <div style={{ marginTop: 6, fontSize: 13, color: '#6B7280' }}>
                        {item.dosage || ''} · {item.frequence || ''} · {item.duree ? `${item.duree} jours` : 'Durée non renseignée'}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 16, color: '#1B6B45' }}>🔬 Résultats labo</h3>
                <span style={{ fontSize: 12, color: '#6B7280' }}>{results.length} trouvé(s)</span>
              </div>
              {results.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: '#6B7280' }}>Aucun résultat disponible</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 12 }}>
                  {results.map((item, index) => {
                    const lowerResult = item.resultat ? item.resultat.toLowerCase() : '';
                    const lowerStatus = item.status ? item.status.toLowerCase() : '';
                    const isNormal = lowerResult.includes('normal') || lowerStatus === 'normal';
                    return (
                      <li key={index} style={{ borderRadius: 12, padding: '14px 16px', background: '#ECFDF5', display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700, color: '#165E3B' }}>{item.nomDuTest || 'Test inconnu'}</div>
                          <div style={{ marginTop: 6, fontSize: 13, color: '#6B7280' }}>{item.resultat || item.description || 'Résultat non renseigné'}</div>
                        </div>
                        <span style={{ borderRadius: 999, padding: '6px 12px', fontSize: 12, fontWeight: 700, color: isNormal ? '#14532D' : '#B91C1C', background: isNormal ? '#DCFCE7' : '#FEE2E2' }}>
                          {isNormal ? 'Normal' : 'Anormal'}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 20 }}>
              <div>
                <h2 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 16, fontWeight: 700, color: '#111827' }}>Historique consultations</h2>
              </div>
            </div>
            {releves.length === 0 ? (
              <p style={{ color: '#6B7280' }}>Aucun historique de consultation disponible.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
                  <thead>
                    <tr style={{ textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>
                      <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>DATE</th>
                      <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>MÉDECIN</th>
                      <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>DIAGNOSTIC</th>
                      <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>TYPE</th>
                      <th style={{ padding: '14px 12px', fontSize: 12, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>DURÉE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {releves.map((item, index) => (
  <tr key={index} style={{ borderBottom: '1px solid #F3F4F6' }}>
    <td style={{ padding: '10px 12px', fontSize: 13, fontFamily: "'DM Mono',monospace", color: '#6B7280' }}>
      {item.dateDeVisite
        ? new Date(item.dateDeVisite).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
        : '—'}
    </td>
    <td style={{ padding: '10px 12px', fontSize: 13, fontWeight: 600, color: '#111827' }}>
      Dr. {item.doctorNom} {item.doctorPrenom}
    </td>
    <td style={{ padding: '10px 12px', fontSize: 13, color: '#374151' }}>{item.diagnostic || '—'}</td>
    <td style={{ padding: '10px 12px', fontSize: 13, color: '#374151' }}>{item.typeVisite || '—'}</td>
    <td style={{ padding: '10px 12px', fontSize: 13, color: '#374151' }}>
      {item.dureeConsultation ? `${item.dureeConsultation} min` : '—'}
    </td>
  </tr>
))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
