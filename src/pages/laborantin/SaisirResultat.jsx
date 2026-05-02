import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLaborantins, getDemandesEnAttente, submitResultat } from '../../api/laborantinApi.js';

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  border: '1.5px solid #E5E7EB',
  borderRadius: '7px',
  fontSize: '14px',
  fontFamily: "'DM Sans', sans-serif",
  outline: 'none',
  boxSizing: 'border-box'
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: 600,
  color: '#374151',
  fontFamily: "'DM Mono', monospace",
  marginBottom: '6px'
};

const cardStyle = {
  background: 'white',
  borderRadius: '12px',
  border: '1px solid #E5E7EB',
  padding: '24px',
  marginBottom: '20px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
};

const sectionTitle = {
  fontFamily: "'Fraunces', serif",
  fontSize: '14px',
  fontWeight: 700,
  color: '#1B6B45',
  marginBottom: '16px',
  paddingBottom: '8px',
  borderBottom: '1px solid #E5E7EB'
};

export default function SaisirResultat() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    resultat: '',
    valeurNormale: '',
    unite: '',
    anomalie: false,
    commentaire: ''
  });

  const [resultat, setResultat] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [errorInfo, setErrorInfo] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadInfo() {
      try {
        const token = localStorage.getItem('hoptal_token');
        if (!token) throw new Error('No token');
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const username = decoded.sub;

        const resLab = await getLaborantins();
        const dataLab = resLab.data?.data ?? resLab.data ?? [];
        const lab = dataLab.find(l => l.nomUtilisateur === username);

        if (!lab?.id) throw new Error('Laborantin introuvable');

        const resDemandes = await getDemandesEnAttente(lab.id);
        const demandes = resDemandes.data?.data ?? resDemandes.data ?? [];
        const currentDemande = demandes.find(d => d.id.toString() === id);

        if (currentDemande) {
          setResultat(currentDemande);
        } else {
          setErrorInfo('Demande introuvable ou déjà traitée');
        }
      } catch (err) {
        setErrorInfo('Impossible de charger les informations');
      } finally {
        setLoadingInfo(false);
      }
    }
    loadInfo();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAnomalieChange = (value) => {
    setForm(prev => ({ ...prev, anomalie: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    if (!form.resultat.trim()) {
      setError('Le champ résultat est requis.');
      setSaving(false);
      return;
    }

    try {
      const body = {
        resultat: form.resultat.trim(),
        valeurNormale: form.valeurNormale.trim(),
        unite: form.unite.trim(),
        anomalie: form.anomalie,
        commentaire: form.commentaire.trim()
      };
      await submitResultat(id, body);
      setSuccess(true);
    } catch (err) {
      setError(err?.response?.data?.message || 'Impossible de sauvegarder le résultat.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px', minHeight: '100vh', position: 'relative' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <label style={{ fontFamily: "'DM Mono', monospace", fontSize: '12px', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>
            SAISIE DE RÉSULTAT
          </label>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: '26px', color: '#111827', margin: '4px 0 0 0' }}>
            Saisir le résultat d'analyse
          </h1>
        </div>
        <button
          onClick={() => navigate('/laborantin/dashboard')}
          type="button"
          style={{ background: 'transparent', border: 'none', color: '#6B7280', fontWeight: 600, cursor: 'pointer', fontSize: '14px' }}>
          ← Retour au dashboard
        </button>
      </div>

      <div style={{ background: '#E8F5EE', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '14px', fontWeight: 700, color: '#1B6B45', marginBottom: '16px' }}>
          Informations de l'analyse
        </h2>
        {loadingInfo ? (
          <div>
            <div style={{ height: '16px', background: '#D1D5DB', borderRadius: '4px', width: '30%', marginBottom: '8px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
            <div style={{ height: '16px', background: '#D1D5DB', borderRadius: '4px', width: '50%', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
          </div>
        ) : errorInfo ? (
          <p style={{ color: '#D94F38', fontSize: '14px', margin: 0 }}>{errorInfo}</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '14px' }}>
            <div>
              <span style={{ color: '#6B7280' }}>Patient : </span>
              <span style={{ fontWeight: 600, color: '#111827' }}>
                {resultat?.patientNom && resultat?.patientPrenom ? `${resultat.patientNom} ${resultat.patientPrenom}` : '—'}
              </span>
            </div>
            <div>
              <span style={{ color: '#6B7280' }}>Numéro dossier : </span>
              <span style={{ fontFamily: "'DM Mono', monospace", color: '#1B6B45', fontWeight: 600 }}>{resultat?.patientNumeroDossier || '—'}</span>
            </div>
            <div>
              <span style={{ color: '#6B7280' }}>Test demandé : </span>
              <span style={{ fontWeight: 600, color: '#111827' }}>{resultat?.nomDuTest || '—'}</span>
            </div>
            <div>
              <span style={{ color: '#6B7280' }}>Laboratoire : </span>
              <span style={{ color: '#111827' }}>{resultat?.nomDuLabo || '—'}</span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} style={cardStyle}>
        <h2 style={sectionTitle}>Résultat de l'analyse</h2>

        {error && <div style={{ background: '#FEF0EE', color: '#D94F38', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Résultat *</label>
            <textarea
              name="resultat"
              value={form.resultat}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Ex: Hémoglobine : 14.2 g/dL — dans les normes"
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div>
            <label style={labelStyle}>Valeur normale</label>
            <input
              type="text"
              name="valeurNormale"
              value={form.valeurNormale}
              onChange={handleChange}
              placeholder="Ex: 12-16 g/dL"
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Unité</label>
            <input
              type="text"
              name="unite"
              value={form.unite}
              onChange={handleChange}
              placeholder="Ex: g/dL, mmol/L, U/L"
              style={inputStyle}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Commentaire</label>
            <textarea
              name="commentaire"
              value={form.commentaire}
              onChange={handleChange}
              rows="3"
              placeholder="Observations complémentaires du laborantin..."
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Anomalie détectée ?</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div
                onClick={() => handleAnomalieChange(false)}
                style={{
                  padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: 600, border: '2px solid',
                  background: !form.anomalie ? '#E8F5EE' : 'white',
                  borderColor: !form.anomalie ? '#1B6B45' : '#E5E7EB',
                  color: !form.anomalie ? '#1B6B45' : '#374151',
                  transition: 'all 0.2s'
                }}>
                ✓ Normal
              </div>
              <div
                onClick={() => handleAnomalieChange(true)}
                style={{
                  padding: '16px', borderRadius: '8px', cursor: 'pointer', textAlign: 'center', fontWeight: 600, border: '2px solid',
                  background: form.anomalie ? '#FEF0EE' : 'white',
                  borderColor: form.anomalie ? '#D94F38' : '#E5E7EB',
                  color: form.anomalie ? '#D94F38' : '#374151',
                  transition: 'all 0.2s'
                }}>
                ⚠ Anormal
              </div>
            </div>
            {form.anomalie && (
              <p style={{ color: '#D94F38', fontSize: '13px', marginTop: '8px', fontWeight: 600 }}>
                Ce résultat sera marqué comme anormal et signalé au médecin.
              </p>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                width: '100%', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '16px', cursor: saving ? 'not-allowed' : 'pointer', color: 'white',
                background: form.anomalie ? '#D94F38' : '#1B6B45',
                opacity: saving ? 0.7 : 1,
                transition: 'all 0.2s'
              }}>
              {saving ? "Envoi en cours..." : (form.anomalie ? "⚠ Valider résultat anormal" : "Valider et envoyer le résultat")}
            </button>
          </div>
        </div>
      </form>

      {success && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', maxWidth: '480px', width: '90%', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '48px', color: '#1B6B45', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: '22px', color: '#111827', marginBottom: '8px' }}>
              Résultat enregistré !
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: form.anomalie ? '16px' : '24px' }}>
              Le résultat a été transmis avec succès.
            </p>
            {form.anomalie && (
              <p style={{ color: '#D94F38', fontWeight: 600, fontSize: '14px', marginBottom: '24px', background: '#FEF0EE', padding: '8px', borderRadius: '6px' }}>
                ⚠ Ce résultat a été marqué comme anormal.
              </p>
            )}
            <button
              onClick={() => navigate('/laborantin/dashboard')}
              type="button"
              style={{ background: '#1B6B45', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              Retour au dashboard
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
