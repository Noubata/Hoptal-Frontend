import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { creerDoctor } from '../../api/doctorApi.js';
import api from '../../api/axios.js';

const initialState = {
  nom: '', prenom: '', numeroDeLicence: '', numeroDeTelephone: '',
  email: '', dateEmbauche: '', specialiteId: '', departementId: '',
  nomUtilisateur: '', motDePasse: ''
};

export default function NouveauDoctor() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [specialites, setSpecialites] = useState([]);
  const [departements, setDepartements] = useState([]);

  useEffect(() => {
    api.get('/api/specialites')
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        setSpecialites(Array.isArray(data) ? data : []);
      })
      .catch(() => setSpecialites([]));

    api.get('/api/departements')
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        setDepartements(Array.isArray(data) ? data : []);
      })
      .catch(() => setDepartements([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = [];
    if (!form.nom.trim()) nextErrors.push('Le nom est requis.');
    if (!form.prenom.trim()) nextErrors.push('Le prénom est requis.');
    if (!form.numeroDeLicence.trim()) nextErrors.push('Le numéro de licence est requis.');
    if (!form.numeroDeTelephone.trim()) nextErrors.push('Le téléphone est requis.');
    if (!form.email.trim()) nextErrors.push('L\'email est requis.');
    if (!form.dateEmbauche) nextErrors.push('La date d\'embauche est requise.');
    if (!form.specialiteId) nextErrors.push('La spécialité est requise.');
    if (!form.departementId) nextErrors.push('Le département est requis.');
    if (!form.nomUtilisateur.trim()) nextErrors.push('Le nom d\'utilisateur est requis.');
    if (!form.motDePasse.trim()) nextErrors.push('Le mot de passe est requis.');
    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setErrors([]);
    try {
      const body = {
        nom: form.nom, prenom: form.prenom,
        numeroDeLicence: form.numeroDeLicence,
        numeroDeTelephone: form.numeroDeTelephone,
        email: form.email, dateEmbauche: form.dateEmbauche,
        specialiteId: Number(form.specialiteId),
        departementId: Number(form.departementId),
        nomUtilisateur: form.nomUtilisateur, motDePasse: form.motDePasse
      };
      await creerDoctor(body);
      setSuccess(true);
    } catch (err) {
      const message = err?.response?.data?.message
                   || err?.response?.data?.data?.message
                   || 'Impossible de créer le médecin.';
      setErrors([message]);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px', fontFamily: "'DM Sans', sans-serif" };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' };
  const cardStyle = { background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' };
  const sectionTitle = { fontFamily: "'Fraunces', serif", fontSize: '14px', fontWeight: 700, color: '#1B6B45', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #E5E7EB' };

  if (success) {
    return (
      <section style={{ background: '#F9FAFB', padding: '0 28px 28px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '40px', textAlign: 'center', maxWidth: '500px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '24px' }}>
            Médecin créé avec succès !
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              style={{ background: '#1B6B45', color: 'white', padding: '9px 18px', borderRadius: '7px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
              onClick={() => { setForm(initialState); setErrors([]); setSuccess(false); }}
            >
              Créer un autre
            </button>
            <button
              style={{ background: 'white', color: '#1B6B45', border: '1.5px solid #1B6B45', padding: '9px 18px', borderRadius: '7px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
              onClick={() => navigate('/admin/doctors')}
            >
              Retour à la liste
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#6B7280', marginBottom: 4 }}>
            Nouveau médecin
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Créer un compte médecin
          </h1>
        </div>
        <button
          style={{ background: 'white', color: '#1B6B45', border: '1.5px solid #1B6B45', padding: '9px 18px', borderRadius: '7px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
          onClick={() => navigate('/admin/doctors')}
        >
          Retour à la liste
        </button>
      </header>

      {errors.length > 0 && (
        <div style={{ background: '#FEF0EE', color: '#D94F38', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {errors.map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={cardStyle}>
          <h3 style={sectionTitle}>Informations médicales</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label style={labelStyle}>Nom<input type="text" name="nom" value={form.nom} onChange={handleChange} style={inputStyle} /></label>
            <label style={labelStyle}>Prénom<input type="text" name="prenom" value={form.prenom} onChange={handleChange} style={inputStyle} /></label>
            <label style={labelStyle}>Numéro de licence<input type="text" name="numeroDeLicence" value={form.numeroDeLicence} onChange={handleChange} style={inputStyle} /></label>
            <label style={labelStyle}>Téléphone<input type="tel" name="numeroDeTelephone" value={form.numeroDeTelephone} onChange={handleChange} placeholder="+235 6X XX XX XX" style={inputStyle} /></label>
            <label style={labelStyle}>Email<input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} /></label>
            <label style={labelStyle}>Date d'embauche<input type="date" name="dateEmbauche" value={form.dateEmbauche} onChange={handleChange} style={inputStyle} /></label>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={sectionTitle}>Affectation</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label style={labelStyle}>
              Spécialité
              <select name="specialiteId" value={form.specialiteId} onChange={handleChange} style={inputStyle}>
                <option value="">-- Sélectionner une spécialité --</option>
                {specialites.length === 0 ? (
                  <option disabled>Aucune spécialité disponible</option>
                ) : (
                  specialites.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)
                )}
              </select>
              {specialites.length === 0 && (
                <div style={{ marginTop: 6, fontSize: '11px', color: '#D97706' }}>
                  ⚠ GET /api/specialites introuvable
                </div>
              )}
            </label>
            <label style={labelStyle}>
              Département
              <select name="departementId" value={form.departementId} onChange={handleChange} style={inputStyle}>
                <option value="">-- Sélectionner un département --</option>
                {departements.length === 0 ? (
                  <option disabled>Aucun département disponible</option>
                ) : (
                  departements.map(d => <option key={d.id} value={d.id}>{d.nom}</option>)
                )}
              </select>
              {departements.length === 0 && (
                <div style={{ marginTop: 6, fontSize: '11px', color: '#D97706' }}>
                  ⚠ GET /api/departements introuvable
                </div>
              )}
            </label>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={sectionTitle}>Compte de connexion</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label style={labelStyle}>Nom d'utilisateur<input type="text" name="nomUtilisateur" value={form.nomUtilisateur} onChange={handleChange} style={inputStyle} /></label>
            <label style={labelStyle}>Mot de passe temporaire<input type="password" name="motDePasse" value={form.motDePasse} onChange={handleChange} style={inputStyle} /></label>
          </div>
        </div>

        <button type="submit" disabled={loading}
          style={{ background: '#1B6B45', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%' }}>
          {loading ? 'Création en cours...' : 'Créer le médecin'}
        </button>
      </form>
    </section>
  );
}