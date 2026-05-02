import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatient, ajouterAllergie } from '../../api/patientApi.js';

const severiteOptions = [
  { value: 'LEGERE', label: 'Légère' },
  { value: 'MODEREE', label: 'Modérée' },
  { value: 'SEVERE', label: 'Sévère' },
  { value: 'MORTELLE', label: 'Mortelle' }
];

export default function AjouterAllergie() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [form, setForm] = useState({ substance: '', severite: 'LEGERE', reaction: '', dateDecouverte: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPatient() {
      setLoading(true);
      setError('');
      try {
        const response = await getPatient(id);
        const data = response.data?.data ?? response.data ?? null;
        setPatientName(`${data?.nom || ''} ${data?.prenom || ''}`.trim() || 'Patient');
      } catch (err) {
        console.error('Erreur chargement patient:', err);
        setError('Impossible de charger le patient.');
      } finally {
        setLoading(false);
      }
    }
    if (id) loadPatient();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = [];
    if (!form.substance.trim()) nextErrors.push('La substance est requise.');
    if (!form.severite) nextErrors.push('La sévérité est requise.');
    if (!form.dateDecouverte) nextErrors.push('La date de découverte est requise.');
    if (nextErrors.length) {
      setError(nextErrors.join(' '));
      return;
    }

    setSaving(true);
    setError('');

    try {
      await ajouterAllergie(id, {
        substance: form.substance.trim(),
        severite: form.severite,
        reaction: form.reaction.trim(),
        dateDecouverte: form.dateDecouverte
      });
      navigate(`/doctor/patients/${id}/dossier`);
    } catch (err) {
      console.error('Erreur ajout allergie:', err);
      setError(err?.response?.data?.message || 'Impossible d’ajouter l’allergie.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px', minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', paddingTop: 28 }}>
        <div style={{ background: '#FEE2E2', borderRadius: 18, padding: 24, border: '1px solid #FECACA' }}>
          <p style={{ margin: 0, fontSize: 12, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#991B1B' }}>
            Ajouter une allergie
          </p>
          <h1 style={{ margin: '12px 0 0', fontFamily: 'Fraunces, serif', fontSize: 22, color: '#991B1B' }}>
            Ajouter une allergie
          </h1>
          <p style={{ marginTop: 8, color: '#7F1D1D' }}>{patientName}</p>
        </div>

        {loading ? (
          <div style={{ marginTop: 24, padding: 24, background: 'white', borderRadius: 18, color: '#6B7280' }}>Chargement du patient...</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 24, background: 'white', borderRadius: 18, border: '1px solid #E5E7EB', padding: 24 }}>
            {error && (
              <div style={{ marginBottom: 20, padding: 16, borderRadius: 14, background: '#FEF0EE', color: '#B91C1C' }}>{error}</div>
            )}

            <label style={{ display: 'block', marginBottom: 18 }}>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Substance</span>
              <input
                name="substance"
                type="text"
                value={form.substance}
                onChange={handleChange}
                placeholder="ex: Pénicilline, Aspirine..."
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14 }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 18 }}>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Sévérité</span>
              <select name="severite" value={form.severite} onChange={handleChange} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14 }}>
                {severiteOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: 18 }}>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Réaction</span>
              <textarea
                name="reaction"
                value={form.reaction}
                onChange={handleChange}
                rows="4"
                placeholder="Décrire la réaction observée..."
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14, resize: 'vertical' }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 28 }}>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Date découverte</span>
              <input
                name="dateDecouverte"
                type="date"
                value={form.dateDecouverte}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14 }}
              />
            </label>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => navigate(`/doctor/patients/${id}/dossier`)} style={{ background: 'transparent', color: '#111827', border: '1px solid #D1D5DB', borderRadius: 12, padding: '12px 22px', fontWeight: 700, cursor: 'pointer' }}>
                Annuler
              </button>
              <button type="submit" disabled={saving} style={{ background: '#D94F38', color: 'white', border: 'none', borderRadius: 12, padding: '12px 22px', fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Enregistrement...' : 'Sauvegarder l’allergie'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
