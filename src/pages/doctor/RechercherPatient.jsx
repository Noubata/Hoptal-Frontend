import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPatients, getDossierComplet } from '../../api/patientApi.js';

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

export default function RechercherPatient() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const trimmed = query.trim();
    const timer = setTimeout(async () => {
      if (trimmed.length < 2) {
        setPatients([]);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await searchPatients(trimmed);
        const list = response.data?.data ?? response.data ?? [];
        const patientList = Array.isArray(list) ? list : [];

        const patientsWithAllergies = await Promise.all(
          patientList.map(async (patient) => {
            if (!patient.id) {
              return { ...patient, allergiesCount: 0 };
            }
            try {
              const dossierResponse = await getDossierComplet(patient.id);
              const dossierData = dossierResponse.data?.data ?? dossierResponse.data ?? {};
              return {
                ...patient,
                allergiesCount: Array.isArray(dossierData.allergies) ? dossierData.allergies.length : 0,
                dossier: dossierData
              };
            } catch {
              return { ...patient, allergiesCount: 0 };
            }
          })
        );

        setPatients(patientsWithAllergies);
      } catch (err) {
        console.error('Erreur recherche patient:', err);
        setError('Impossible de rechercher les patients.');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px' }}>
      <div style={{ textAlign: 'center', margin: '0 auto 24px', maxWidth: 700 }}>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#6B7280', marginBottom: 8 }}>
          Qui consultez-vous ?
        </p>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 800, color: '#111827', margin: 0 }}>
          Qui consultez-vous ?
        </h1>
        <p style={{ marginTop: 12, fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>
          Recherchez par nom, prénom ou numéro de dossier
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto 28px', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Fatima Mahamat ou DPI-2026-..."
            style={{ width: '100%', padding: '14px 18px 14px 46px', borderRadius: 14, border: '1px solid #E5E7EB', fontSize: 16, fontFamily: 'DM Sans, sans-serif', color: '#111827' }}
          />
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {loading ? (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, textAlign: 'center', color: '#6B7280' }}>
            Recherche en cours...
          </div>
        ) : error ? (
          <div style={{ background: '#FEF0EE', borderRadius: 16, padding: 24, color: '#D94F38' }}>{error}</div>
        ) : query.trim().length < 2 ? (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, color: '#6B7280' }}>
            Entrez au moins 2 caractères pour lancer la recherche.
          </div>
        ) : patients.length === 0 ? (
          <div style={{ background: 'white', borderRadius: 16, padding: 24, color: '#6B7280' }}>
            Aucun patient trouvé pour cette recherche.
          </div>
        ) : (
          <div style={{ background: 'white', borderRadius: 16, padding: 0, border: '1px solid #E5E7EB' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #E5E7EB', fontFamily: 'DM Mono, monospace', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#6B7280' }}>
              RÉSULTATS — {patients.length} trouvé(s)
            </div>
            <div>
              {patients.map((patient) => (
                <div key={patient.id || patient.numeroDossier || patient.nomUtilisateur} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E8F5EE', color: '#1B6B45', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                      {`${patient.nom?.[0] || ''}${patient.prenom?.[0] || ''}`.toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {patient.nom || '—'} {patient.prenom || ''}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 11, color: '#6B7280', fontFamily: 'DM Mono, monospace' }}>
                        {patient.numeroDossier || '—'} · {patient.dateDeNaissance || '—'} · {bloodTypeLabel[patient.typeSang] || '—'}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {patient.allergiesCount > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 12px', borderRadius: 999, background: '#FEF0EE', color: '#D94F38', fontSize: 12, fontWeight: 700 }}>
                        ⚠ Allergies
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => navigate(`/doctor/patients/${patient.id}/dossier`)}
                      style={{ background: '#1B6B45', color: 'white', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Ouvrir →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
