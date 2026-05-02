import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getDoctorById, updateDoctor, activerDesactiverUser } from '../../api/doctorApi.js';

export default function AdminDoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toggling, setToggling] = useState(false);

  // Edit form state
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    numeroDeTelephone: '',
    numeroDeLicence: '',
    specialiteNom: '',
    departementNom: '',
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const response = await getDoctorById(id);
        const data = response.data?.data ?? response.data;
        setDoctor(data);
        setForm({
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          numeroDeTelephone: data.numeroDeTelephone || '',
          numeroDeLicence: data.numeroDeLicence || '',
          specialiteNom: data.specialiteNom || '',
          departementNom: data.departementNom || '',
        });
      } catch (err) {
        setError(err?.response?.data?.message || 'Impossible de charger le médecin.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!doctor) return;
    setToggling(true);
    try {
      await activerDesactiverUser(doctor.userId, !doctor.actif);
      setDoctor(prev => ({ ...prev, actif: !prev.actif }));
    } catch (err) {
      setError('Impossible de modifier le statut.');
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError('');
    try {
      const response = await updateDoctor(id, form);
      const updated = response.data?.data ?? response.data;
      setDoctor(prev => ({ ...prev, ...updated }));
      setEditMode(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError(err?.response?.data?.message || 'Impossible de sauvegarder les modifications.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    border: '1.5px solid #E5E7EB',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#111827',
    background: 'white',
    boxSizing: 'border-box',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const readonlyStyle = {
    ...inputStyle,
    background: '#F9FAFB',
    color: '#6B7280',
    cursor: 'default',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '10px',
    fontWeight: 600,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: 6,
    fontFamily: "'DM Mono', monospace",
  };

  if (loading) {
    return (
      <section style={{ background: '#F9FAFB', padding: '0 28px 28px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#6B7280', fontSize: '14px' }}>Chargement...</div>
      </section>
    );
  }

  if (error && !doctor) {
    return (
      <section style={{ background: '#F9FAFB', padding: '0 28px 28px' }}>
        <div style={{ background: '#FEF0EE', color: '#D94F38', padding: '14px', borderRadius: '8px', marginTop: 24 }}>{error}</div>
      </section>
    );
  }

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px' }}>

      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <button
            onClick={() => navigate('/admin/doctors')}
            style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '13px', cursor: 'pointer', padding: 0, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}
          >
            ← Retour aux médecins
          </button>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#6B7280', marginBottom: 4 }}>
            Médecins
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Dr. {doctor?.nom} {doctor?.prenom}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Status badge */}
          <span style={{
            padding: '4px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 700,
            background: doctor?.actif ? '#E8F5EE' : '#FEF0EE',
            color: doctor?.actif ? '#1B6B45' : '#D94F38',
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '0.5px',
          }}>
            {doctor?.actif ? 'ACTIF' : 'INACTIF'}
          </span>

          {/* Toggle status button */}
          <button
            onClick={handleToggleStatus}
            disabled={toggling}
            style={{
              background: doctor?.actif ? '#FEF0EE' : '#1B6B45',
              color: doctor?.actif ? '#D94F38' : 'white',
              border: doctor?.actif ? '1px solid #D94F38' : 'none',
              padding: '9px 16px',
              borderRadius: '7px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: toggling ? 'not-allowed' : 'pointer',
              opacity: toggling ? 0.7 : 1,
            }}
          >
            {toggling ? '...' : doctor?.actif ? 'Désactiver' : 'Activer'}
          </button>

          {/* Edit / Cancel button */}
          <button
            onClick={() => { setEditMode(e => !e); setError(''); }}
            style={{
              background: editMode ? '#F3F4F6' : '#1B6B45',
              color: editMode ? '#374151' : 'white',
              border: 'none',
              padding: '9px 18px',
              borderRadius: '7px',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            {editMode ? 'Annuler' : '✏️ Modifier'}
          </button>
        </div>
      </header>

      {/* Error / success banners */}
      {error && (
        <div style={{ background: '#FEF0EE', color: '#D94F38', padding: '12px 16px', borderRadius: '8px', marginBottom: 20, fontSize: '13px' }}>
          {error}
        </div>
      )}
      {saveSuccess && (
        <div style={{ background: '#E8F5EE', color: '#1B6B45', padding: '12px 16px', borderRadius: '8px', marginBottom: 20, fontSize: '13px', fontWeight: 600 }}>
          ✓ Modifications enregistrées avec succès.
        </div>
      )}

      {/* Main card */}
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>

        {/* Card header strip */}
        <div style={{ background: '#1B6B45', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: 'white', fontFamily: "'Fraunces', serif" }}>
            {doctor?.nom?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div style={{ color: 'white', fontFamily: "'Fraunces', serif", fontSize: 18, fontWeight: 700 }}>
              Dr. {doctor?.nom} {doctor?.prenom}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
              {doctor?.specialiteNom || '—'} · {doctor?.departementNom || '—'}
            </div>
          </div>
        </div>

        {/* Form fields */}
        <div style={{ padding: '28px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>

            <div>
              <label style={labelStyle}>Nom</label>
              <input
                style={editMode ? inputStyle : readonlyStyle}
                value={form.nom}
                readOnly={!editMode}
                onChange={e => setForm(f => ({ ...f, nom: e.target.value }))}
              />
            </div>

            <div>
              <label style={labelStyle}>Prénom</label>
              <input
                style={editMode ? inputStyle : readonlyStyle}
                value={form.prenom}
                readOnly={!editMode}
                onChange={e => setForm(f => ({ ...f, prenom: e.target.value }))}
              />
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                style={editMode ? inputStyle : readonlyStyle}
                value={form.email}
                readOnly={!editMode}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              />
            </div>

            <div>
              <label style={labelStyle}>Téléphone</label>
              <input
                style={editMode ? inputStyle : readonlyStyle}
                value={form.numeroDeTelephone}
                readOnly={!editMode}
                onChange={e => setForm(f => ({ ...f, numeroDeTelephone: e.target.value }))}
              />
            </div>

            <div>
              <label style={labelStyle}>Numéro de licence</label>
              <input
                style={readonlyStyle}
                value={form.numeroDeLicence}
                readOnly
              />
            </div>

            <div>
              <label style={labelStyle}>Nom d'utilisateur</label>
              <input
                style={readonlyStyle}
                value={doctor?.nomUtilisateur || '—'}
                readOnly
              />
            </div>

            <div>
              <label style={labelStyle}>Spécialité</label>
              <input
                style={editMode ? inputStyle : readonlyStyle}
                value={form.specialiteNom}
                readOnly={!editMode}
                onChange={e => setForm(f => ({ ...f, specialiteNom: e.target.value }))}
              />
            </div>

            <div>
              <label style={labelStyle}>Département</label>
              <input
                style={editMode ? inputStyle : readonlyStyle}
                value={form.departementNom}
                readOnly={!editMode}
                onChange={e => setForm(f => ({ ...f, departementNom: e.target.value }))}
              />
            </div>

          </div>

          {/* Save button — only visible in edit mode */}
          {editMode && (
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: '#1B6B45',
                  color: 'white',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? 'Enregistrement...' : '✓ Enregistrer les modifications'}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}