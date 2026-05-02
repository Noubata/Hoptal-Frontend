
import api from './axios.js';

export function creerPatient(body) {
  return api.post('/api/patients/creer', body);
}

export function getAllPatients() {
  return api.get('/api/patients/allPatients');
}
export function searchPatients(query = '') {
  return api.get('/api/patients/search', { params: { query } });
}

export function getDossierComplet(patientId) {
  return api.get(`/api/patients/${patientId}/dossier-complet`);
}

export function getRecentPatients() {
  return api.get('/api/patients/recent');
}

export function getPatient(patientId) {
  return api.get(`/api/patients/${patientId}`);
}
export function getallergies(patientId) {
  return api.get(`/api/patients/${patientId}/allergies`);
}

export function ajouterAllergie(patientId, body) {
  return api.post(`/api/patients/${patientId}/allergies`, body);
}

export function getAntecedents(patientId) {
  return api.get(`/api/patients/${patientId}/antecedents`);
}

export function ajouterAntecedent(patientId, body) {
  return api.post(`/api/patients/${patientId}/antecedents`, body);
}