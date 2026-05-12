import api from './axios.js';

export function searchDoctors(query = '') {
  return api.get('/api/doctors/search', { params: { query } });
}

export function creerDoctor(body) {
  return api.post('/api/doctors/creer-docteur', body);
}

export function activerDesactiverUser(userId, actif) {
  return api.put(`/api/auth/activer-desactiver/${userId}`, { actif });
}
export function updateDoctor(id, body) {
  return api.put(`/api/doctors/${id}`, body);
}

export function getDoctorById(id) {
  return api.get(`/api/doctors/${id}`);
}

export function getPatientsDoctor(doctorId) {
  return api.get(`/api/doctors/${doctorId}/patients`);
}

export async function getDoctorByNomUtilisateur(nomUtilisateur) {
  const res = await api.get('/api/doctors/search', { params: { query: nomUtilisateur } });
  const doctors = res.data?.data ?? res.data ?? [];
  return Array.isArray(doctors)
    ? doctors.find(d => d.nomUtilisateur === nomUtilisateur) ?? null
    : null;
}