import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { creerPatient } from '../../api/patientApi.js';

const initialState = {
  nom: '',
  prenom: '',
  dateDeNaissance: '',
  genre: 'FEMININ',
  typeSang: 'A_POSITIF',
  telephone: '',
  email: '',
  adresse: '',
  nomContactUrgence: '',
  telephoneContactUrgence: '',
  nomUtilisateur: '',
  motDePasse: ''
};

export default function NouveauPatient() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [generatedDossier, setGeneratedDossier] = useState('');

  const validate = () => {
    const nextErrors = [];
    if (!form.nom.trim()) nextErrors.push('Le nom est requis.');
    if (!form.prenom.trim()) nextErrors.push('Le prénom est requis.');
    if (!form.dateDeNaissance) nextErrors.push('La date de naissance est requise.');
    if (!form.telephone.trim()) nextErrors.push('Le numéro de téléphone est requis.');
    if (!form.adresse.trim()) nextErrors.push('L\'adresse est requise.');
    if (!form.nomContactUrgence.trim()) nextErrors.push('Le contact d\'urgence est requis.');
    if (!form.telephoneContactUrgence.trim()) nextErrors.push('Le téléphone du contact d\'urgence est requis.');
    if (!form.nomUtilisateur.trim()) nextErrors.push('Le nom d\'utilisateur est requis.');
    if (!form.motDePasse.trim()) nextErrors.push('Le mot de passe temporaire est requis.');
    setErrors(nextErrors);
    return nextErrors.length === 0;
  };

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors([]);

    try {
      const body = { ...form, hopitalId: 2 };
      const response = await creerPatient(body);
      const patient = response.data?.data ?? response.data;

      setGeneratedDossier(patient.numeroDossier);
      setSuccess(true);
    } catch (err) {
      const message = err?.response?.data?.message
                   || err?.response?.data?.data?.message
                   || 'Impossible de créer le patient.';
      setErrors([message]);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '40px', textAlign: 'center', maxWidth: '500px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>

        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '24px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
          Patient créé avec succès !
        </h2>

        <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '20px' }}>
          Numéro de dossier :
          <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 'bold', color: '#1B6B45' }}>
            {' '}{generatedDossier}
          </span>
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px' }}>
          <button
            style={{ background: '#1B6B45', color: 'white', padding: '9px 18px', borderRadius: '7px', fontWeight: 600, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            onClick={() => {
              setForm(initialState);
              setErrors([]);
              setSuccess(false);
            }}
          >
            Créer un autre
          </button>

          <button
            style={{ background: 'white', color: '#1B6B45', border: '1.5px solid #1B6B45', padding: '9px 18px', borderRadius: '7px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
            onClick={() => navigate('/admin/patients')}
          >
            Retour à la liste
          </button>
        </div>

        <p style={{ fontSize: '14px', color: '#6B7280', marginTop: '20px' }}>
          Redirection dans 3 secondes...
        </p>

      </div>
    </section>
  );
}

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#6B7280', marginBottom: 4 }}>
            Nouveau patient
          </div>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            Créer un dossier patient
          </h1>
        </div>
        <button
          style={{ background: 'white', color: '#1B6B45', border: '1.5px solid #1B6B45', padding: '9px 18px', borderRadius: '7px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
          onClick={() => navigate('/admin/patients')}
        >
          Retour à la liste
        </button>
      </header>

      {errors.length > 0 && (
        <div style={{ background: '#FEF0EE', color: '#D94F38', padding: '14px', borderRadius: '8px', marginBottom: '20px' }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '14px', fontWeight: 700, color: '#1B6B45', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #E5E7EB' }}>
            Informations personnelles
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Nom
              <input
                type="text"
                name="nom"
                value={form.nom}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              />
            </label>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Prénom
              <input
                type="text"
                name="prenom"
                value={form.prenom}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              />
            </label>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Date de naissance
              <input
                type="date"
                name="dateDeNaissance"
                value={form.dateDeNaissance}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              />
            </label>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Genre
              <select
                name="genre"
                value={form.genre}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              >
                <option value="FEMININ">Femme</option>
                <option value="MASCULIN">Homme</option>
                <option value="AUTRE">Autre</option>
              </select>
            </label>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Groupe sanguin
              <select
                name="typeSang"
                value={form.typeSang}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              >
                <option value="A_POSITIF">A+</option>
                <option value="A_NEGATIF">A-</option>
                <option value="B_POSITIF">B+</option>
                <option value="B_NEGATIF">B-</option>
                <option value="AB_POSITIF">AB+</option>
                <option value="AB_NEGATIF">AB-</option>
                <option value="O_POSITIF">O+</option>
                <option value="O_NEGATIF">O-</option>
              </select>
            </label>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Téléphone
              <input
                type="tel"
                name="telephone"
                value={form.telephone}
                onChange={handleChange}
                placeholder="+235 6X XX XX XX"
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              />
            </label>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="exemple@hoptal.td"
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              />
            </label>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px', gridColumn: '1 / -1' }}>
              Adresse
              <input
                type="text"
                name="adresse"
                value={form.adresse}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              />
            </label>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '14px', fontWeight: 700, color: '#1B6B45', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #E5E7EB' }}>
            Contact d'urgence
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Nom contact urgence
              <input
                type="text"
                name="nomContactUrgence"
                value={form.nomContactUrgence}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              />
            </label>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Téléphone contact urgence
              <input
                type="tel"
                name="telephoneContactUrgence"
                value={form.telephoneContactUrgence}
                onChange={handleChange}
                placeholder="+235 6X XX XX XX"
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              />
            </label>
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px', marginBottom: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: '14px', fontWeight: 700, color: '#1B6B45', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #E5E7EB' }}>
            Compte de connexion
          </h3>
          <div style={{ background: '#F9FAFB', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '11px', color: '#6B7280' }}>
            Le numéro de dossier DPI-XXXX-XXXXX sera généré automatiquement
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Nom d'utilisateur
              <input
                type="text"
                name="nomUtilisateur"
                value={form.nomUtilisateur}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              />
            </label>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: "'DM Mono', monospace", marginBottom: '6px' }}>
              Mot de passe temporaire
              <input
                type="password"
                name="motDePasse"
                value={form.motDePasse}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: '7px', fontSize: '14px' }}
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ background: '#1B6B45', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%' }}
        >
          {loading ? 'Création en cours...' : 'Créer le patient'}
        </button>
      </form>
    </section>
  );
}
