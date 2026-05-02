import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LandingPage() {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Déjà connecté → rediriger vers le bon dashboard
      if (role === 'ADMIN') navigate('/admin/dashboard');
      if (role === 'DOCTOR') navigate('/doctor/dashboard');
      if (role === 'LABORANTIN') navigate('/laborantin/dashboard');
      if (role === 'PATIENT') navigate('/patient/mon-dossier');
    }
  }, [token, role, navigate]);

  const scrollToFeatures = () => {
    document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* SECTION 1 — NAVBAR */}
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-main">Hop</span>
            <span className="logo-accent">tal</span>
          </div>
          <button className="btn-login" onClick={() => navigate('/login')}>
            Se connecter
          </button>
        </div>
      </nav>

      {/* SECTION 2 — HERO */}
      <section className="hero">
        <div className="hero-content">
          <div className="tag">SYSTÈME DPI · TCHAD</div>
          <h1 className="hero-title">
            Le dossier médical<br />
            de chaque patient,<br />
            <span className="highlight">toujours</span> accessible.
          </h1>
          <p className="hero-subtitle">
            Hoptal digitalise les dossiers patients dans les hôpitaux au Tchad.
            Plus de carnets perdus. Plus de prescriptions dangereuses.
            L'information médicale là où elle doit être.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/login')}>
              Accéder au système →
            </button>
            <button className="btn-secondary" onClick={scrollToFeatures}>
              En savoir plus ↓
            </button>
          </div>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-number">200+</span>
              <span className="stat-label">tests/jour</span>
            </div>
            <div className="stat-divider">·</div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">rôles</span>
            </div>
            <div className="stat-divider">·</div>
            <div className="stat-item">
              <span className="stat-number">1</span>
              <span className="stat-label">hôpital</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — LE PROBLÈME */}
      <section className="problems" id="features">
        <div className="section-content">
          <div className="section-header">
            <div className="section-tag">Le problème</div>
            <h2 className="section-title">
              Les hôpitaux tchadiens fonctionnent encore sur papier.
            </h2>
            <p className="section-subtitle">
              Les carnets médicaux se perdent. Les médecins consultent sans historique.
              Les résultats d'analyses n'arrivent jamais. Les prescriptions dangereuses
              restent possibles faute d'information sur les allergies.
            </p>
          </div>

          <div className="problems-grid">
            <div className="problem-card">
              <div className="card-icon">📄</div>
              <h3 className="card-title">Dossiers perdus</h3>
              <p className="card-text">Le patient arrive sans carnet. Le médecin repart de zéro.</p>
            </div>
            <div className="problem-card">
              <div className="card-icon">🩺</div>
              <h3 className="card-title">Médecin à l'aveugle</h3>
              <p className="card-text">Sans historique, impossible de prendre la bonne décision.</p>
            </div>
            <div className="problem-card">
              <div className="card-icon">💊</div>
              <h3 className="card-title">Prescriptions dangereuses</h3>
              <p className="card-text">Sans liste d'allergies, un médicament peut tuer.</p>
            </div>
            <div className="problem-card">
              <div className="card-icon">🔬</div>
              <h3 className="card-title">Tests répétés</h3>
              <p className="card-text">Les résultats se perdent. Le patient paye deux fois.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — LA SOLUTION */}
      <section className="solution">
        <div className="section-content">
          <div className="section-tag">LA SOLUTION</div>
          <h2 className="section-title">
            Tout ce dont un hôpital a besoin, rien de plus.
          </h2>

          <div className="features-grid">
            <div className="feature-column">
              <h3 className="column-title">👨‍⚕️ Pour les médecins</h3>
              <ul className="feature-list">
                <li>✓ Dossier complet du patient en un clic</li>
                <li>✓ Allergies visibles immédiatement</li>
                <li>✓ Historique des consultations</li>
                <li>✓ Prescriptions avec alerte allergie automatique</li>
                <li>✓ Commande d'analyses labo directement</li>
              </ul>
            </div>
            <div className="feature-column">
              <h3 className="column-title">🔬 Pour les laborantins</h3>
              <ul className="feature-list">
                <li>✓ File d'attente des analyses en temps réel</li>
                <li>✓ Saisie de résultat en 3 clics</li>
                <li>✓ Détection automatique des anomalies</li>
                <li>✓ Résultats visibles par le médecin instantanément</li>
              </ul>
            </div>
            <div className="feature-column">
              <h3 className="column-title">🧑‍⚕️ Pour les patients</h3>
              <ul className="feature-list">
                <li>✓ Accès au dossier depuis un téléphone</li>
                <li>✓ Prescriptions actives toujours disponibles</li>
                <li>✓ Résultats d'analyses consultables</li>
                <li>✓ Historique des visites médicales</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA FINAL + FOOTER */}
      <section className="cta-footer">
        <div className="cta-content">
          <h2 className="cta-title">Prêt à digitaliser votre hôpital ?</h2>
          <p className="cta-subtitle">
            Hoptal est conçu pour les réalités du terrain tchadien.
            Fonctionne sur réseau local, même sans internet stable.
          </p>
          <button className="btn-cta" onClick={() => navigate('/login')}>
            Se connecter au système →
          </button>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-logo">
              <span className="logo-main">Hop</span>
              <span className="logo-accent">tal</span>
            </div>
            <p className="footer-text">
              © 2025 Hoptal DPI · Système de Gestion Hospitalière · Tchad
            </p>
            <p className="footer-subtext">
              Conçu pour les hôpitaux du Tchad
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}