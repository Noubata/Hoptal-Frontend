import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPatient, ajouterAntecedent } from '../../api/patientApi.js';

const antecedentTypes = [
  { value: 'MEDICAL', label: 'Médical' },
  { value: 'CHIRURGICAL', label: 'Chirurgical' },
  { value: 'FAMILIAL', label: 'Familial' },
  { value: 'GYNECOLOGIQUE', label: 'Gynécologique' },
  { value: 'PSYCHIATRIQUE', label: 'Psychiatrique' }
];

export default function AjouterAntecedent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [form, setForm] = useState({ type: 'MEDICAL', description: '', dateDebut: '', chronique: 'false', notes: '' });
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
    if (id) {
      loadPatient();
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = [];
    if (!form.type) nextErrors.push('Le type est requis.');
    if (!form.description.trim()) nextErrors.push('La description est requise.');
    if (!form.dateDebut) nextErrors.push('La date de début est requise.');
    if (nextErrors.length) {
      setError(nextErrors.join(' '));
      return;
    }

    setSaving(true);
    setError('');

    try {
      await ajouterAntecedent(id, {
        type: form.type,
        description: form.description.trim(),
        dateDebut: form.dateDebut,
        chronique: form.chronique === 'true',
        notes: form.notes.trim() || undefined
      });
      navigate(`/doctor/patients/${id}/dossier`);
    } catch (err) {
      console.error('Erreur ajout antécédent:', err);
      setError(err?.response?.data?.message || 'Impossible d’ajouter l’antécédent.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px', minHeight: '100vh' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', paddingTop: 28 }}>
        <div style={{ background: '#FEF3F7', borderRadius: 18, padding: 24, border: '1px solid #FCD5CE' }}>
          <p style={{ margin: 0, fontSize: 12, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.16em', color: '#B45309' }}>
            Ajouter un antécédent médical
          </p>
          <h1 style={{ margin: '12px 0 0', fontFamily: 'Fraunces, serif', fontSize: 22, color: '#B45309' }}>
            Ajouter un antécédent médical
          </h1>
          <p style={{ marginTop: 8, color: '#92400E' }}>{patientName}</p>
        </div>

        {loading ? (
          <div style={{ marginTop: 24, padding: 24, background: 'white', borderRadius: 18, color: '#6B7280' }}>Chargement du patient...</div>
        ) : (
          <form onSubmit={handleSubmit} style={{ marginTop: 24, background: 'white', borderRadius: 18, border: '1px solid #E5E7EB', padding: 24 }}>
            {error && (
              <div style={{ marginBottom: 20, padding: 16, borderRadius: 14, background: '#FEF0EE', color: '#B91C1C' }}>{error}</div>
            )}

            <label style={{ display: 'block', marginBottom: 18 }}>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Type d’antécédent</span>
              <select name="type" value={form.type} onChange={handleChange} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14 }}>
                {antecedentTypes.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: 18 }}>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                placeholder="Décrire l'antécédent médical du patient..."
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14, resize: 'vertical' }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 18 }}>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Date de début</span>
              <input
                name="dateDebut"
                type="date"
                value={form.dateDebut}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14 }}
              />
            </label>

            <label style={{ display: 'block', marginBottom: 18 }}>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Chronique</span>
              <select name="chronique" value={form.chronique} onChange={handleChange} style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14 }}>
                <option value="false">Non</option>
                <option value="true">Oui</option>
              </select>
            </label>

            <label style={{ display: 'block', marginBottom: 28 }}>
              <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Notes</span>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Informations complémentaires (facultatif)..."
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 14, resize: 'vertical' }}
              />
            </label>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => navigate(`/doctor/patients/${id}/dossier`)} style={{ background: 'transparent', color: '#111827', border: '1px solid #D1D5DB', borderRadius: 12, padding: '12px 22px', fontWeight: 700, cursor: 'pointer' }}>
                Annuler
              </button>
              <button type="submit" disabled={saving} style={{ background: '#D97706', color: 'white', border: 'none', borderRadius: 12, padding: '12px 22px', fontWeight: 700, cursor: 'pointer' }}>
                {saving ? 'Enregistrement...' : 'Sauvegarder l’antécédent'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
