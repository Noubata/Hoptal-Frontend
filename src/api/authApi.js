import api from './axios.js';

export async function loginRequest(credentials) {
  // Axios returns 'response', your Java backend returns 'APIResponse' in 'response.data'
  const response = await api.post('/api/auth/login', credentials);
  
  // We return response.data.data to get the LoginResponse (token, role, etc.)
  return response.data.data; 
}

export function changePassword(userId, body) {
  return api.put(`/api/auth/changer-mot-de-passe/${userId}`, body);
}