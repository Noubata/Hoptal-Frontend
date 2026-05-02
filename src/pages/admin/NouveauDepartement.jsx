import { useNavigate } from 'react-router-dom';

export default function NouveauDepartement() {
  const navigate = useNavigate();

  return (
    <section className="page-form">
      <div className="form-header">
        <div>
          <p className="form-label">Nouveau département</p>
          <h2>Ajouter un département</h2>
        </div>
        <button type="button" className="button-secondary" onClick={() => navigate('/admin/departements')}>
          Retour à la liste
        </button>
      </div>
      <p>La création de département sera implémentée bientôt.</p>
    </section>
  );
}
