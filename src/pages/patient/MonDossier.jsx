import React, { useState, useEffect } from 'react';
import api from '../../api/axios.js';

const bloodTypeMap = {
  A_POSITIF: 'A+', A_NEGATIF: 'A-',
  B_POSITIF: 'B+', B_NEGATIF: 'B-',
  AB_POSITIF: 'AB+', AB_NEGATIF: 'AB-',
  O_POSITIF: 'O+', O_NEGATIF: 'O-'
};

const genreLabel = {
  MASCULIN: 'Homme',
  FEMININ: 'Femme',
  AUTRE: 'Autre'
};

const severiteStyle = {
  LEGERE: { background: '#FEF3C7', color: '#D97706' },
  MODEREE: { background: '#FED7AA', color: '#C2410C' },
  SEVERE: { background: '#FEF0EE', color: '#D94F38' },
  MORTELLE: { background: '#FEE2E2', color: '#991B1B' }
};

export default function MonDossier() {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        // Récupérer userId depuis le token JWT directement
        const token = localStorage.getItem('hoptal_token');
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const patientUserId = decoded.userId;

        const res = await api.get(`/api/patients/par-user/${patientUserId}/dossier-complet`);
        const data = res.data?.data ?? res.data ?? null;
        setDossier(data);
      } catch (err) {
        console.error('Erreur dossier patient:', err?.response?.data ?? err);
        setError('Impossible de charger votre dossier médical.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ background: '#F9FAFB', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#1B6B45', fontSize: '18px', fontWeight: 'bold' }}>Chargement de votre dossier...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '28px' }}>
        <div style={{ background: '#FEF0EE', color: '#D94F38', padding: '20px', borderRadius: '12px', border: '2px solid #D94F38', fontWeight: 'bold' }}>
          {error}
        </div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '28px' }}>
        <p style={{ color: '#6B7280', fontStyle: 'italic', textAlign: 'center' }}>Aucune donnée disponible pour votre dossier.</p>
      </div>
    );
  }

  const p = dossier?.patient;
  const allergies = dossier?.allergies ?? [];
  const antecedents = dossier?.antecedents ?? [];
  const prescriptions = dossier?.prescriptionsActives ?? [];
  const resultats = dossier?.derniersResultats ?? [];
  const releves = dossier?.derniersReleves ?? [];

  const initiales = (p?.nom?.[0] || '') + (p?.prenom?.[0] || '').toUpperCase();

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px', minHeight: '100vh' }}>

      {/* BLOC 1 — EN-TÊTE IDENTITÉ */}
      <div style={{ background: '#1B6B45', borderRadius: '16px', padding: '28px 32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.15)', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 'bold', color: 'white' }}>
              {initiales}
            </div>
            <div>
              <h1 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: '24px', fontWeight: 'bold', color: 'white' }}>
                {p?.nom} {p?.prenom}
              </h1>
              <p style={{ margin: '4px 0', fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#3DB87A' }}>
                Dossier n°{p?.numeroDossier}
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.75)' }}>
                {genreLabel[p?.genre] || p?.genre} · {p?.dateDeNaissance ? new Date(p.dateDeNaissance).toLocaleDateString('fr-FR') : '-'} · {p?.telephone}
              </p>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '16px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', marginBottom: '4px' }}>Groupe sanguin</div>
            <div style={{ fontFamily: 'Fraunces, serif', fontSize: '32px', fontWeight: 'bold', color: 'white' }}>
              {bloodTypeMap[p?.typeSang] || p?.typeSang || '-'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.85)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px' }}>
            🏥 {p?.hopitalNom || 'Hôpital'}
          </div>
          <div style={{ background: '#E8F5EE', color: '#1B6B45', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>
            ● {p?.statut || 'ACTIF'}
          </div>
        </div>
      </div>

      {/* BLOC 2 — ALERTE ALLERGIE */}
      {allergies.length > 0 && (
        <div style={{ background: '#FEF0EE', border: '2px solid #D94F38', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 'bold', color: '#D94F38', marginBottom: '4px' }}>
            ⚠️ ALERTE — {allergies.length} allergie(s) connue(s)
          </div>
          <div style={{ fontSize: '12px', color: '#D94F38' }}>
            {allergies.map(a => `${a.substance} (${a.severite.charAt(0) + a.severite.slice(1).toLowerCase()})`).join(' · ')}
          </div>
        </div>
      )}

      {/* BLOC 3 — GRID 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

        {/* Card A — Allergies */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 'bold', color: '#D94F38', marginBottom: '12px' }}>
            🚨 Allergies <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6B7280' }}>({allergies.length})</span>
          </div>
          {allergies.length === 0 ? (
            <div style={{ fontStyle: 'italic', color: '#6B7280', fontSize: '13px' }}>Aucune allergie connue</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {allergies.map(a => (
                <div key={a.id} style={{ background: '#FEF2F2', borderRadius: '10px', padding: '12px 14px', position: 'relative' }}>
                  <div style={{ fontWeight: 'bold', color: '#991B1B', fontSize: '13px' }}>{a.substance}</div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{a.reaction}</div>
                  <span style={{ position: 'absolute', top: '12px', right: '14px', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold', ...severiteStyle[a.severite] }}>
                    {a.severite}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card B — Antécédents */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 'bold', color: '#D97706', marginBottom: '12px' }}>
            📋 Antécédents médicaux <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6B7280' }}>({antecedents.length})</span>
          </div>
          {antecedents.length === 0 ? (
            <div style={{ fontStyle: 'italic', color: '#6B7280', fontSize: '13px' }}>Aucun antécédent</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {antecedents.map(a => (
                <div key={a.id} style={{ background: '#FEF7C3', borderRadius: '10px', padding: '12px 14px' }}>
                  <span style={{ background: '#FEF3C7', color: '#92400E', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>{a.type}</span>
                  <div style={{ fontWeight: 'bold', color: '#92400E', marginTop: '6px', fontSize: '13px' }}>
                    {a.description}
                    {a.chronique && <span style={{ marginLeft: '8px', background: '#FEE2E2', color: '#991B1B', padding: '2px 6px', borderRadius: '12px', fontSize: '9px', fontWeight: 'bold' }}>Chronique</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>{a.notes}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card C — Prescriptions actives */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 'bold', color: '#0284C7', marginBottom: '12px' }}>
            💊 Prescriptions actives <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6B7280' }}>({prescriptions.length})</span>
          </div>
          {prescriptions.length === 0 ? (
            <div style={{ fontStyle: 'italic', color: '#6B7280', fontSize: '13px' }}>Aucune prescription active</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {prescriptions.map(pr => (
                <div key={pr.id} style={{ background: '#EFF6FF', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontWeight: 'bold', color: '#1E40AF', fontSize: '13px' }}>
                    {pr.nomDuMedicament}
                    {pr.renouvellable && <span style={{ float: 'right', background: '#E8F5EE', color: '#1B6B45', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>Renouvelable</span>}
                  </div>
                  <div style={{ fontSize: '12px', color: '#374151', marginTop: '4px' }}>{pr.dosage} · {pr.frequence}</div>
                  <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '4px' }}>{pr.duree}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card D — Résultats labo */}
        <div style={{ background: 'white', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '16px' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 'bold', color: '#1B6B45', marginBottom: '12px' }}>
            🔬 Derniers résultats <span style={{ fontSize: '12px', fontWeight: 'normal', color: '#6B7280' }}>({resultats.length})</span>
          </div>
          {resultats.length === 0 ? (
            <div style={{ fontStyle: 'italic', color: '#6B7280', fontSize: '13px' }}>Aucun résultat disponible</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resultats.map(r => (
                <div key={r.id} style={{ background: '#ECFDF5', borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#166534', fontSize: '13px' }}>{r.nomDuTest}</div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#374151', marginTop: '4px' }}>
                      {r.resultat} {r.unite}
                    </div>
                  </div>
                  {r.anomalie ? (
                    <span style={{ background: '#FEF0EE', color: '#D94F38', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>Anormal</span>
                  ) : (
                    <span style={{ background: '#E8F5EE', color: '#1B6B45', padding: '4px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>Normal</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* BLOC 4 — HISTORIQUE CONSULTATIONS */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'Fraunces, serif', fontSize: '16px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
          📅 Historique des consultations <span style={{ fontSize: '14px', fontWeight: 'normal', color: '#6B7280' }}>({releves.length} consultation(s))</span>
        </div>

        {releves.length === 0 ? (
          <div style={{ textAlign: 'center', fontStyle: 'italic', color: '#6B7280', fontSize: '13px' }}>Aucune consultation enregistrée.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {releves.map(rel => (
              <div key={rel.id} style={{ background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#6B7280' }}>
                    {new Date(rel.dateDeVisite).toLocaleDateString('fr-FR')}
                  </div>
                  <div style={{ background: '#E8F5EE', color: '#1B6B45', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' }}>
                    {rel.typeVisite}
                  </div>
                </div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827', marginTop: '8px' }}>
                  Dr. {rel.doctorNom} {rel.doctorPrenom}
                </div>
                <div style={{ fontSize: '13px', color: '#374151', margin: '4px 0' }}>{rel.diagnostic}</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>{rel.dureeConsultation} min</div>

                {rel.prescriptions && rel.prescriptions.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: '#6B7280', marginBottom: '6px' }}>
                      Médicaments prescrits
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {rel.prescriptions.map((p, i) => (
                        <span key={i} style={{ background: '#E0F2FE', color: '#0284C7', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>
                          {p.nomDuMedicament}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BLOC 5 — CONTACT D'URGENCE */}
      {p?.nomContactUrgence && (
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '12px', padding: '16px 20px' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: '14px', fontWeight: 'bold', color: '#92400E', marginBottom: '8px' }}>
            🆘 Contact d'urgence
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#111827' }}>{p.nomContactUrgence}</div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#374151', marginTop: '2px' }}>
            {p.telephoneContactUrgence}
          </div>
        </div>
      )}
    </section>
  );
}
