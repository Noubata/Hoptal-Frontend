import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createLaborantin } from '../../api/laborantinApi.js';
import api from '../../api/axios.js';

const initialState = {
  nom: '', prenom: '', numeroDeTelephone: '', email: '',
  serviceId: '', nomUtilisateur: '', motDePasse: ''
};

export default function NouveauLaborantin() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    api.get('/api/services')
      .then(res => {
        const data = res.data?.data ?? res.data ?? [];
        setServices(Array.isArray(data) ? data : []);
      })
      .catch(() => setServices([]));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors = [];
    if (!form.nom.trim()) nextErrors.push('Le nom est requis.');
    if (!form.prenom.trim()) nextErrors.push('Le prénom est requis.');
    if (!form.numeroDeTelephone.trim()) nextErrors.push('Le téléphone est requis.');
    if (!form.email.trim()) nextErrors.push('L\'email est requis.');
    if (!form.serviceId) nextErrors.push('Le service est requis.');
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
        numeroDeTelephone: form.numeroDeTelephone, email: form.email,
        serviceId: Number(form.serviceId),
        nomUtilisateur: form.nomUtilisateur, motDePasse: form.motDePasse
      };
      await createLaborantin(body);
      setSuccess(true);
    } catch (err) {
      const message = err?.response?.data?.message
                   || err?.response?.data?.data?.message
                   || 'Impossible de créer le laborantin.';
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
            Laborantin créé avec succès !
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
              onClick={() => navigate('/admin/laborantins')}
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
            Nouveau laborantin
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Créer un compte laborantin
          </h1>
        </div>
        <button
          style={{ background: 'white', color: '#1B6B45', border: '1.5px solid #1B6B45', padding: '9px 18px', borderRadius: '7px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
          onClick={() => navigate('/admin/laborantins')}
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
          <h3 style={sectionTitle}>Informations personnelles</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label style={labelStyle}>Nom<input type="text" name="nom" value={form.nom} onChange={handleChange} style={inputStyle} /></label>
            <label style={labelStyle}>Prénom<input type="text" name="prenom" value={form.prenom} onChange={handleChange} style={inputStyle} /></label>
            <label style={labelStyle}>Téléphone<input type="tel" name="numeroDeTelephone" value={form.numeroDeTelephone} onChange={handleChange} placeholder="+235 6X XX XX XX" style={inputStyle} /></label>
            <label style={labelStyle}>Email<input type="email" name="email" value={form.email} onChange={handleChange} style={inputStyle} /></label>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={sectionTitle}>Affectation au service</h3>
          <label style={labelStyle}>
            Service
            <select name="serviceId" value={form.serviceId} onChange={handleChange} style={inputStyle}>
              <option value="">-- Sélectionner un service --</option>
              {services.length === 0 ? (
                <option disabled>Aucun service disponible</option>
              ) : (
                services.map(s => (
                  <option key={s.id} value={s.id}>{s.nom}</option>
                ))
              )}
            </select>
          </label>
          {services.length === 0 && (
            <div style={{ marginTop: 8, fontSize: '11px', color: '#D97706', background: '#FEF3C7', padding: '8px 12px', borderRadius: '6px' }}>
              ⚠ Aucun service trouvé. Vérifiez que le endpoint GET /api/services existe dans le backend.
            </div>
          )}
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
          {loading ? 'Création en cours...' : 'Créer le laborantin'}
        </button>
      </form>
    </section>
  );
}