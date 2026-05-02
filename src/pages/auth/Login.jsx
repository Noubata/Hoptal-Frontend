import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../api/authApi.js'; 
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuth(); 
  const [nomUtilisateur, setNomUtilisateur] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    
    if (!nomUtilisateur.trim() || !motDePasse.trim()) {
      setError('Veuillez renseigner votre identifiant et votre mot de passe.');
      return;
    }

    setLoading(true);
    try {
      // loginRequest now returns the 'data' field directly (token, role, etc.)
      const userData = await loginRequest({ 
        nomUtilisateur: nomUtilisateur.trim(), 
        motDePasse 
      });
      

      if (userData && userData.token && userData.role) {
        localStorage.setItem('hoptal_hopitalId', userData.hopitalId);
        localStorage.setItem('hoptal_token', userData.token);
        localStorage.setItem('hoptal_role', userData.role);
        localStorage.setItem('hoptal_nomUtilisateur', userData.nomUtilisateur); // ← add this
        localStorage.setItem('hoptal_userId', userData.userId);
        
        
      //setAuth();
      console.log(userData)
      
      const userRole = userData.role.toUpperCase();
        
      if (userRole === 'ADMIN') navigate('/admin/dashboard');
      else if (userRole === 'DOCTOR') navigate('/doctor/dashboard');
      else if (userRole === 'LABORANTIN') navigate('/laborantin/dashboard');
      else if (userRole === 'PATIENT') navigate('/patient/mon-dossier');
      else setError('Rôle utilisateur non reconnu.');
    }
    } catch (err) {
      // Handle the 401/404/500 errors from backend
      const message = err.response?.data?.message || 'Identifiants invalides ou erreur serveur.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <h1>Bienvenue</h1>
        <p>Connectez-vous pour accéder à l’espace Hoptal.</p>

        {error && <div className="alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Nom d’utilisateur</label>
          <input
            id="username"
            type="text"
            value={nomUtilisateur}
            onChange={e => setNomUtilisateur(e.target.value)}
            placeholder="Entrez votre identifiant"
            autoComplete="username"
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={motDePasse}
            onChange={e => setMotDePasse(e.target.value)}
            placeholder="Entrez votre mot de passe"
            autoComplete="current-password"
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </section>
    </main>
  );
}