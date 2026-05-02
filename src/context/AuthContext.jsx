import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/authApi.js';

const AuthContext = createContext(null);

function parseJwt(token) {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem('hoptal_token') || '');
  const [role, setRole] = useState(() => localStorage.getItem('hoptal_role') || '');
  const [userId, setUserId] = useState(() => localStorage.getItem('hoptal_userId') || '');
  const [nomUtilisateur, setNomUtilisateur] = useState(() => {
    const saved = localStorage.getItem('hoptal_nomUtilisateur');
    if (saved) return saved;
    const token = localStorage.getItem('hoptal_token');
    if (token) {
      const parsed = parseJwt(token);
      return parsed?.sub || parsed?.nomUtilisateur || '';
    }
    return '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Parse token on mount if token exists but role doesn't
  useEffect(() => {
    if (token && !role) {
      const parsed = parseJwt(token);
      if (parsed) {
        setRole(parsed.role || '');
        setUserId(parsed.userId || '');
        setNomUtilisateur(prev => prev || parsed.sub || '');
      }
    }
  }, [token, role]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('hoptal_token', token);
    } else {
      localStorage.removeItem('hoptal_token');
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('hoptal_role', role);
    } else {
      localStorage.removeItem('hoptal_role');
    }
  }, [role]);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('hoptal_userId', userId);
    } else {
      localStorage.removeItem('hoptal_userId');
    }
  }, [userId]);

  useEffect(() => {
    if (nomUtilisateur) {
      localStorage.setItem('hoptal_nomUtilisateur', nomUtilisateur);
    } else {
      localStorage.removeItem('hoptal_nomUtilisateur');
    }
  }, [nomUtilisateur]);

  const login = async ({ nomUtilisateur, motDePasse }) => {
    setLoading(true);
    setError('');

    try {
      const response = await loginRequest({ nomUtilisateur, motDePasse });
      const data = response.data.data; 
      const jwtRole = data.role || parseJwt(data.token)?.role || '';
      const jwtUserId = data.userId || parseJwt(data.token)?.userId || '';
      setToken(data.token);
      setRole(jwtRole);
      setUserId(jwtUserId);
      setNomUtilisateur(data.nomUtilisateur || nomUtilisateur);

      if (jwtRole === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (jwtRole === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else if (jwtRole === 'LABORANTIN') {
        navigate('/laborantin/dashboard');
      } else if (jwtRole === 'PATIENT') {
        navigate('/patient/mon-dossier');
      } else {
        navigate('/login');
      }
    } catch (err) {
      const message = err?.response?.data?.message;
      if (message === 'Utilisateur introuvable' || message === 'Mot de passe incorrect') {
        setError('Identifiant ou mot de passe incorrect');
      } else if (message === 'Ce compte est désactivé') {
        setError('Votre compte a été désactivé. Contactez l\'administrateur.');
      } else {
        setError('Impossible de se connecter pour le moment. Réessayez plus tard.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setRole('');
    setUserId('');
    setNomUtilisateur('');
    localStorage.removeItem('hoptal_token');
    localStorage.removeItem('hoptal_role');
    localStorage.removeItem('hoptal_userId');
    localStorage.removeItem('hoptal_nomUtilisateur');
    navigate('/login');
  };

  const value = useMemo(
    () => ({ token, role, userId, nomUtilisateur, loading, error, login, logout, setError }),
    [token, role, userId, nomUtilisateur, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }
  return context;
}
