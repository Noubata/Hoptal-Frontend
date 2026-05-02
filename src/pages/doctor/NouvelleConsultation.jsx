import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { getDoctorByNomUtilisateur } from '../../api/doctorApi.js';
import { getLaborantins } from '../../api/laborantinApi.js';
import { creerReleve, ajouterPrescription, demanderAnalyse, verifierAllergie, getPatientDossierComplet } from '../../api/releveApi.js';

const visitTypes = [
  { value: 'consultation', label: 'Consultation générale' },
  { value: 'urgence', label: 'Urgence' },
  { value: 'suivi', label: 'Suivi' },
  { value: 'controle', label: 'Contrôle' }
];

const initialPrescription = {
  nomDuMedicament: '',
  dosage: '',
  frequence: '',
  duree: '',
  instructions: '',
  renouvellable: false
};

const initialAnalyse = {
  nomDuTest: '',
  nomDuLabo: '',
  laborantinId: ''
};

export default function NouvelleConsultation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { nomUtilisateur } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [patient, setPatient] = useState(null);
  const [patientDossier, setPatientDossier] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [laborantins, setLaborantins] = useState([]);

  const [symptomes, setSymptomes] = useState('');
  const [diagnostic, setDiagnostic] = useState('');
  const [notes, setNotes] = useState('');
  const [typeVisite, setTypeVisite] = useState('consultation');
  const [dureeConsultation, setDureeConsultation] = useState('30');

  const [prescriptionForm, setPrescriptionForm] = useState(initialPrescription);
  const [prescriptions, setPrescriptions] = useState([]);
  const [prescriptionAllergies, setPrescriptionAllergies] = useState([]);
  const [allowAllergieRisk, setAllowAllergieRisk] = useState(false);
  const [showAllergieModal, setShowAllergieModal] = useState(false);

  const [analyseForm, setAnalyseForm] = useState(initialAnalyse);
  const [analyses, setAnalyses] = useState([]);

  const patientAge = useMemo(() => {
    if (!patient?.dateDeNaissance) return null;
    const diff = Date.now() - new Date(patient.dateDeNaissance).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }, [patient]);

  useEffect(() => {
  async function load() {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('hoptal_token');
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const username = decoded.sub;

      const doctor = await getDoctorByNomUtilisateur(username);
      setDoctorId(doctor?.id ?? null);

      const dossierRes = await getPatientDossierComplet(id);
      const dossierData = dossierRes.data?.data ?? dossierRes.data ?? null;
      setPatientDossier(dossierData);
      setPatient(dossierData?.patient ?? null);

      try {
        const laborantinsRes = await getLaborantins();
        const laboData = laborantinsRes.data?.data ?? laborantinsRes.data ?? [];
        setLaborantins(Array.isArray(laboData) ? laboData : []);
      } catch {
        setLaborantins([]);
      }
    } catch (err) {
      console.error('Erreur consultation:', err?.response?.data ?? err);
      setError('Impossible de charger le dossier du patient.');
    } finally {
      setLoading(false);
    }
  }
  if (id) load();
}, [id]); // ← seulement id

  useEffect(() => {
    const timer = setTimeout(async () => {
      const med = prescriptionForm.nomDuMedicament.trim();
      if (!med) {
        setPrescriptionAllergies([]);
        setShowAllergieModal(false);
        setAllowAllergieRisk(false);
        return;
      }

      try {
        const response = await verifierAllergie(id, med);
        const allergyMatch = response.data?.data ?? response.data ?? [];
        const allergies = Array.isArray(allergyMatch) ? allergyMatch : [];
        setPrescriptionAllergies(allergies);
        if (allergies.length > 0) {
          setShowAllergieModal(true);
          setAllowAllergieRisk(false);
        } else {
          setShowAllergieModal(false);
          setAllowAllergieRisk(false);
        }
      } catch (err) {
        console.error('Erreur vérification allergie:', err);
        setPrescriptionAllergies([]);
        setShowAllergieModal(false);
        setAllowAllergieRisk(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [prescriptionForm.nomDuMedicament, id]);

  const handlePrescriptionChange = (event) => {
    const { name, value, type, checked } = event.target;
    setPrescriptionForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAddPrescription = (event) => {
    event.preventDefault();
    if (!prescriptionForm.nomDuMedicament.trim() || !prescriptionForm.dosage.trim() || !prescriptionForm.frequence.trim() || !prescriptionForm.duree.trim()) {
      setError('Remplissez tous les champs de prescription avant d’ajouter.');
      return;
    }

    if (prescriptionAllergies.length > 0 && !allowAllergieRisk) {
      setShowAllergieModal(true);
      setError('Ce médicament présente un risque d’allergie. Confirmez ou changez le médicament.');
      return;
    }

    setPrescriptions((prev) => [...prev, prescriptionForm]);
    setPrescriptionForm(initialPrescription);
    setPrescriptionAllergies([]);
    setAllowAllergieRisk(false);
    setError('');
  };

  const handleRemovePrescription = (index) => {
    setPrescriptions((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleAnalyseChange = (event) => {
    const { name, value } = event.target;
    setAnalyseForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAnalyse = (event) => {
    event.preventDefault();
    if (!analyseForm.nomDuTest.trim() || !analyseForm.nomDuLabo.trim() || !analyseForm.laborantinId) {
      setError('Définissez le test, le laboratoire et le laborantin avant d’ajouter l’analyse.');
      return;
    }

    setAnalyses((prev) => [...prev, analyseForm]);
    setAnalyseForm(initialAnalyse);
    setError('');
  };

  const handleRemoveAnalyse = (index) => {
    setAnalyses((prev) => prev.filter((_, idx) => idx !== index));
  };

  const submitConsultation = async (event) => {
  event.preventDefault();
  if (!diagnostic.trim() || !symptomes.trim()) {
    setError('Le diagnostic et les symptômes sont requis.');
    return;
  }
  if (!doctorId) {
    setError('Impossible de récupérer le médecin connecté.');
    return;
  }

  setSaving(true);
  setError('');

  try {
    const consultationBody = {
      patientId: Number(id),        // ← Number() ici
      doctorId: Number(doctorId),   // ← Number() ici
      diagnostic: diagnostic.trim(),
      symptomes: symptomes.trim(),
      notes: notes.trim(),
      typeVisite,
      dureeConsultation: Number(dureeConsultation)
    };

    // ← logs ICI dans submitConsultation pas dans load()
    console.log('body envoyé:', JSON.stringify(consultationBody));

    const releveResponse = await creerReleve(consultationBody);
    const releveData = releveResponse.data?.data ?? releveResponse.data ?? null;
    const releveId = releveData?.id;

    if (!releveId) {
      throw new Error('ID du relevé introuvable dans la réponse.');
    }

    for (const prescription of prescriptions) {
      await ajouterPrescription(releveId, {
        ...prescription,
        renouvellable: Boolean(prescription.renouvellable)
      });
    }

    for (const analyse of analyses) {
      await demanderAnalyse(releveId, {
        ...analyse,
        laborantinId: Number(analyse.laborantinId)
      });
    }

    navigate(`/doctor/patients/${id}/dossier`);

  } catch (err) {
    console.error('Erreur sauvegarde consultation:', err?.response?.data ?? err.message);
    setError(err?.response?.data?.message || err.message || 'Impossible de sauvegarder.');
  } finally {
    setSaving(false);
  }
};

  if (loading) {
    return (
      <section style={{ background: '#F9FAFB', minHeight: '100vh', padding: '28px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: 24, background: 'white', borderRadius: 18, border: '1px solid #E5E7EB' }}>
          Chargement de la consultation...
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: '#F9FAFB', minHeight: '100vh', padding: '28px' }}>
      <div style={{ maxWidth: 1024, margin: '0 auto', display: 'grid', gap: 24, gridTemplateColumns: '1.4fr 0.6fr' }}>
        <div style={{ background: 'white', borderRadius: 28, border: '1px solid #E5E7EB', padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, marginBottom: 28, flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: 0, fontSize: 12, fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.18em', color: '#1B6B45' }}>Nouvelle consultation</p>
              <h1 style={{ margin: '12px 0 0', fontFamily: 'Fraunces, serif', fontSize: 28, color: '#1B6B45' }}>Consultation pour {patient?.nom} {patient?.prenom}</h1>
              <p style={{ marginTop: 8, color: '#4B5563' }}>
                {patient?.genre === 'MASCULIN' ? 'Homme' : patient?.genre === 'FEMININ' ? 'Femme' : 'Genre non renseigné'} • {patientAge ? `${patientAge} ans` : 'Âge inconnu'}
              </p>
            </div>
            <button type="button" onClick={() => navigate(`/doctor/patients/${id}/dossier`)} style={{ background: 'transparent', color: '#1B6B45', border: '1px solid #D1D5DB', borderRadius: 16, padding: '12px 22px', fontWeight: 700, cursor: 'pointer' }}>
              Retour au dossier
            </button>
          </div>

          {patientDossier?.allergies?.length > 0 && (
            <div style={{ marginBottom: 22, padding: 18, borderRadius: 22, background: '#FEF0EE', border: '1px solid #D94F38', color: '#7F1D1D' }}>
              <p style={{ margin: 0, fontWeight: 700 }}>⚠️ Allergies connues</p>
              <p style={{ margin: '8px 0 0' }}>Ce patient a {patientDossier.allergies.length} allergie(s) enregistrée(s). Vérifiez les prescriptions avant d’enregistrer.</p>
            </div>
          )}

          {error && (
            <div style={{ marginBottom: 22, padding: 18, borderRadius: 22, background: '#FEF0EE', border: '1px solid #FECACA', color: '#B91C1C' }}>{error}</div>
          )}

          <form onSubmit={submitConsultation}>
            <div style={{ display: 'grid', gap: 20 }}>
              <div style={{ borderRadius: 24, background: '#F8FCF8', border: '1px solid #D1E7D2', padding: 22 }}>
                <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontFamily: 'DM Mono, monospace', letterSpacing: '0.14em', color: '#166534' }}>Relevé clinique</p>
                    <h2 style={{ margin: '8px 0 0', fontFamily: 'Fraunces, serif', fontSize: 20, color: '#166534' }}>Informations de consultation</h2>
                  </div>
                  <span style={{ fontSize: 13, color: '#166534' }}>Données principales</span>
                </div>

                <div style={{ display: 'grid', gap: 18 }}>
                  <label style={{ display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Symptômes</span>
                    <textarea value={symptomes} onChange={(event) => setSymptomes(event.target.value)} rows={4} placeholder="Décrire les symptômes observés..." style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '14px 16px', fontSize: 14, resize: 'vertical' }} />
                  </label>

                  <label style={{ display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Diagnostic</span>
                    <textarea value={diagnostic} onChange={(event) => setDiagnostic(event.target.value)} rows={4} placeholder="Saisir le diagnostic..." style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '14px 16px', fontSize: 14, resize: 'vertical' }} />
                  </label>

                  <label style={{ display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Notes cliniques</span>
                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Ajoutez des observations complémentaires ou des instructions..." style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '14px 16px', fontSize: 14, resize: 'vertical' }} />
                  </label>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                    <label style={{ display: 'block' }}>
                      <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Type de visite</span>
                      <select value={typeVisite} onChange={(event) => setTypeVisite(event.target.value)} style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '12px 14px', fontSize: 14 }}>
                        {visitTypes.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </label>

                    <label style={{ display: 'block' }}>
                      <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Durée (minutes)</span>
                      <input value={dureeConsultation} onChange={(event) => setDureeConsultation(event.target.value)} type="number" min="5" style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '12px 14px', fontSize: 14 }} />
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ borderRadius: 24, background: '#FEF8ED', border: '1px solid #FDE1B8', padding: 22 }}>
                <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontFamily: 'DM Mono, monospace', letterSpacing: '0.14em', color: '#92400E' }}>Commande d’analyses</p>
                    <h2 style={{ margin: '8px 0 0', fontFamily: 'Fraunces, serif', fontSize: 20, color: '#92400E' }}>Ajouter un examen</h2>
                  </div>
                  <span style={{ fontSize: 13, color: '#92400E' }}>{analyses.length} analyse(s)</span>
                </div>

                <div style={{ display: 'grid', gap: 16 }}>
                  <label style={{ display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Nom du test</span>
                    <input name="nomDuTest" value={analyseForm.nomDuTest} onChange={handleAnalyseChange} placeholder="Nom du test" style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '12px 14px', fontSize: 14 }} />
                  </label>

                  <label style={{ display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Laboratoire</span>
                    <input name="nomDuLabo" value={analyseForm.nomDuLabo} onChange={handleAnalyseChange} placeholder="Nom du laboratoire" style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '12px 14px', fontSize: 14 }} />
                  </label>

                  <label style={{ display: 'block' }}>
                    <span style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: 'DM Mono, monospace' }}>Laborantin</span>
                    <select name="laborantinId" value={analyseForm.laborantinId} onChange={handleAnalyseChange} style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '12px 14px', fontSize: 14 }}>
                      <option value="">Sélectionner le laborantin</option>
                      {laborantins.map((laborantin) => (
                        <option key={laborantin.id} value={laborantin.id}>{laborantin.nom} {laborantin.prenom ? `(${laborantin.prenom})` : ''}</option>
                      ))}
                    </select>
                  </label>

                  <button type="button" onClick={handleAddAnalyse} style={{ width: 240, borderRadius: 18, border: 'none', background: '#1B6B45', color: 'white', padding: '14px 18px', fontWeight: 700, cursor: 'pointer' }}>
                    Commander l’analyse
                  </button>
                </div>

                {analyses.length > 0 && (
                  <div style={{ marginTop: 24, borderRadius: 20, background: 'white', border: '1px solid #D1E7EB', padding: 18 }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#111827' }}>Analyses programmées</h3>
                    <div style={{ display: 'grid', gap: 14 }}>
                      {analyses.map((analyse, index) => (
                        <div key={`${analyse.nomDuTest}-${index}`} style={{ padding: 18, borderRadius: 18, border: '1px solid #E5E7EB', background: '#F8FAF5' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: 700, color: '#111827' }}>{analyse.nomDuTest}</p>
                              <p style={{ margin: '6px 0 0', color: '#4B5563' }}>{analyse.nomDuLabo} • Laborantin ID: {analyse.laborantinId}</p>
                            </div>
                            <button type="button" onClick={() => handleRemoveAnalyse(index)} style={{ background: 'transparent', border: 'none', color: '#1B6B45', cursor: 'pointer', fontWeight: 700 }}>Supprimer</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ borderRadius: 24, background: '#ECFDF5', border: '1px solid #D1FAE5', padding: 22 }}>
                <div style={{ marginBottom: 18, display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, fontFamily: 'DM Mono, monospace', letterSpacing: '0.14em', color: '#166534' }}>Ordonnance</p>
                    <h2 style={{ margin: '8px 0 0', fontFamily: 'Fraunces, serif', fontSize: 20, color: '#166534' }}>Prescriptions</h2>
                  </div>
                  <span style={{ fontSize: 13, color: '#166534' }}>{prescriptions.length} médicament(s)</span>
                </div>

                <div style={{ display: 'grid', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <input name="nomDuMedicament" value={prescriptionForm.nomDuMedicament} onChange={handlePrescriptionChange} placeholder="Médicament" style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '12px 14px', fontSize: 14 }} />
                    <input name="dosage" value={prescriptionForm.dosage} onChange={handlePrescriptionChange} placeholder="Dosage" style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '12px 14px', fontSize: 14 }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <input name="frequence" value={prescriptionForm.frequence} onChange={handlePrescriptionChange} placeholder="Fréquence" style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '12px 14px', fontSize: 14 }} />
                    <input name="duree" value={prescriptionForm.duree} onChange={handlePrescriptionChange} placeholder="Durée" style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '12px 14px', fontSize: 14 }} />
                  </div>
                  <textarea name="instructions" value={prescriptionForm.instructions} onChange={handlePrescriptionChange} rows={3} placeholder="Instructions d'utilisation (facultatif)" style={{ width: '100%', borderRadius: 18, border: '1px solid #D1E7DD', padding: '12px 14px', fontSize: 14, resize: 'vertical' }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input name="renouvellable" type="checkbox" checked={prescriptionForm.renouvellable} onChange={handlePrescriptionChange} style={{ width: 18, height: 18 }} />
                    <span style={{ fontSize: 14, color: '#1F2937' }}>Renouvellable</span>
                  </label>
                  {prescriptionAllergies.length > 0 && (
                    <div style={{ padding: 16, borderRadius: 18, background: '#FEF0EE', border: '1px solid #FECACA', color: '#B91C1C' }}>
                      <p style={{ margin: 0, fontWeight: 700 }}>Alerte allergie</p>
                      <p style={{ margin: '8px 0 0' }}>Ce médicament peut provoquer une réaction avec les allergies connues de ce patient.</p>
                    </div>
                  )}
                  <button type="button" onClick={handleAddPrescription} style={{ width: 240, borderRadius: 18, border: 'none', background: '#1B6B45', color: 'white', padding: '14px 18px', fontWeight: 700, cursor: 'pointer' }}>
                    Ajouter à l’ordonnance
                  </button>
                </div>

                {prescriptions.length > 0 && (
                  <div style={{ marginTop: 24, borderRadius: 20, background: 'white', border: '1px solid #D1E7EB', padding: 18 }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#111827' }}>Médicaments ajoutés</h3>
                    <div style={{ display: 'grid', gap: 14 }}>
                      {prescriptions.map((prescription, index) => (
                        <div key={`${prescription.nomDuMedicament}-${index}`} style={{ padding: 18, borderRadius: 18, border: '1px solid #E5E7EB', background: '#F8FAF5' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                            <div>
                              <p style={{ margin: 0, fontWeight: 700, color: '#111827' }}>{prescription.nomDuMedicament}</p>
                              <p style={{ margin: '6px 0 0', color: '#4B5563' }}>{prescription.dosage} • {prescription.frequence} • {prescription.duree}</p>
                            </div>
                            <button type="button" onClick={() => handleRemovePrescription(index)} style={{ background: 'transparent', border: 'none', color: '#1B6B45', cursor: 'pointer', fontWeight: 700 }}>Supprimer</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 14, marginTop: 24, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => navigate(`/doctor/patients/${id}/dossier`)} style={{ borderRadius: 18, border: '1px solid #D1D5DB', background: 'white', color: '#111827', padding: '14px 22px', fontWeight: 700, cursor: 'pointer' }}>
                Annuler
              </button>
              <button type="submit" disabled={saving} style={{ borderRadius: 18, border: 'none', background: '#1B6B45', color: 'white', padding: '14px 22px', fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Enregistrement...' : 'Sauvegarder la consultation'}</button>
            </div>
          </form>
        </div>

        <aside style={{ background: 'white', borderRadius: 28, border: '1px solid #E5E7EB', padding: 28, display: 'grid', gap: 20 }}>
          <div style={{ padding: 18, borderRadius: 22, background: '#ECFDF5', border: '1px solid #D1FAE5' }}>
            <h3 style={{ margin: 0, fontSize: 16, color: '#166534' }}>Rappel patient</h3>
            <p style={{ margin: '12px 0 0', color: '#4B5563' }}>Patient: {patient?.nom} {patient?.prenom}</p>
            <p style={{ margin: '8px 0 0', color: '#4B5563' }}>{patient?.telephone || 'Téléphone non renseigné'}</p>
            <p style={{ margin: '8px 0 0', color: '#4B5563' }}>{patient?.email || 'E-mail non renseigné'}</p>
          </div>

          <div style={{ padding: 18, borderRadius: 22, background: '#E8F5EE', border: '1px solid #A7F3D0' }}>
            <h3 style={{ margin: 0, fontSize: 16, color: '#166534' }}>Dossier rapide</h3>
            <p style={{ margin: '12px 0 0', color: '#4B5563' }}>Antécédents: {patientDossier?.antecedents?.length ?? 0}</p>
            <p style={{ margin: '8px 0 0', color: '#4B5563' }}>Allergies: {patientDossier?.allergies?.length ?? 0}</p>
            <p style={{ margin: '8px 0 0', color: '#4B5563' }}>Relevés actuels: {patientDossier?.releves?.length ?? 0}</p>
          </div>

          <div style={{ padding: 18, borderRadius: 22, background: '#FEF3F2', border: '1px solid #FECACA' }}>
            <h3 style={{ margin: 0, fontSize: 16, color: '#B91C1C' }}>Attention</h3>
            <p style={{ margin: '12px 0 0', color: '#7F1D1D' }}>Vérifiez les allergies avant de prescrire et n’ajoutez des médicaments qu’après confirmation.</p>
          </div>
        </aside>
      </div>

      {showAllergieModal && prescriptionAllergies.length > 0 && (
        <div style={{ position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(15, 23, 42, 0.65)', padding: 20, zIndex: 50 }}>
          <div style={{ width: '100%', maxWidth: 560, borderRadius: 28, background: 'white', padding: 28, boxShadow: '0 25px 75px rgba(15,23,42,.2)' }}>
            <h2 style={{ margin: 0, fontFamily: 'Fraunces, serif', fontSize: 24, color: '#991B1B' }}>🚨 DANGER — Allergie détectée</h2>
            <p style={{ margin: '16px 0 0', color: '#4B5563' }}>Le médicament <strong>{prescriptionForm.nomDuMedicament}</strong> peut déclencher une réaction chez ce patient. Voici les allergies potentielles :</p>
            <ul style={{ margin: '16px 0 0', paddingLeft: 20, color: '#4B5563' }}>
              {prescriptionAllergies.map((allergie, index) => (
                <li key={`${allergie.substance}-${index}`} style={{ marginBottom: 8 }}>{allergie.substance} — {allergie.severite}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
              <button type="button" onClick={() => { setShowAllergieModal(false); setPrescriptionForm((prev) => ({ ...prev, nomDuMedicament: '' })); setPrescriptionAllergies([]); setAllowAllergieRisk(false); setError(''); }} style={{ borderRadius: 18, border: '1px solid #D1D5DB', background: 'white', color: '#111827', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
                Changer de médicament
              </button>
              <button type="button" onClick={() => { setAllowAllergieRisk(true); setShowAllergieModal(false); setError(''); }} style={{ borderRadius: 18, border: 'none', background: '#D94F38', color: 'white', padding: '12px 18px', fontWeight: 700, cursor: 'pointer' }}>
                Prescrire quand même
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}