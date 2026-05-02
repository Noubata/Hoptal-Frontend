import api from './axios.js';

export function getLaborantins() {
  return api.get('/api/laborantins');
}

export function createLaborantin(body) {
  return api.post('/api/laborantins', body);
}

export function getDemandesEnAttente(laborantinId) {
  if (!laborantinId) return Promise.resolve({ data: { data: [] } });
  return api.get(`/api/laborantins/${laborantinId}/demandes-en-attente`);
}

export function submitResultat(resultatId, body) {
  return api.put(`/api/laborantins/resultats/${resultatId}/saisir`, body);
}

export function activerDesactiverUser(userId, actif) {
  return api.put(`/api/auth/activer-desactiver/${userId}`, { actif });
}
