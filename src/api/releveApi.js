import api from './axios.js';

export function getDoctorPatients(doctorId) {
  return api.get(`/api/doctors/${doctorId}/patients`);
}

export function getPatientDossierComplet(patientId) {
  return api.get(`/api/patients/${patientId}/dossier-complet`);
}

export function creerReleve(body) {
  return api.post('/api/releves', body);
}

export function ajouterPrescription(releveId, body) {
  return api.post(`/api/releves/${releveId}/prescriptions`, body);
}

export function demanderAnalyse(releveId, body) {
  return api.post(`/api/releves/${releveId}/demander-analyse`, body);
}

export function getHistoriquePatient(patientId) {
  return api.get(`/api/releves/patient/${patientId}`);
}

export function verifierAllergie(patientId, medicament) {
  return api.get('/api/prescriptions/verifier', { params: { patientId, medicament } });
}

export function getPatientPrescriptions(patientId) {
  return api.get(`/api/patients/${patientId}/prescriptions`);
}
