import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecentPatients, searchPatients } from '../../api/patientApi.js';
import { searchDoctors } from '../../api/doctorApi.js';
import { getLaborantins } from '../../api/laborantinApi.js';
import api from '../../api/axios.js';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({ doctors: 0, laborantins: 0, consultations: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError('');
      
      try {
        const [patientsRes, doctorsRes, laborantinsRes, recentRes] = await Promise.allSettled([
          searchPatients(),
          searchDoctors(''),
          getLaborantins(),
          getRecentPatients()
        ]);

        const allPatients = patientsRes.status === 'fulfilled' ? (patientsRes.value.data?.data ?? patientsRes.value.data ?? []) : [];
        const docs = doctorsRes.status === 'fulfilled' ? (doctorsRes.value.data?.data ?? doctorsRes.value.data ?? []) : [];
        const labs = laborantinsRes.status === 'fulfilled' ? (laborantinsRes.value.data?.data ?? laborantinsRes.value.data ?? []) : [];
        const consultRes = await api.get('/api/releves/aujourd-hui/count');
        const consultCount = consultRes.data?.data ?? 0;
        setStats(prev => ({ ...prev, consultations: consultCount }));

        setStats({
          patients: allPatients.length,
          doctors: docs.length,
          laborantins: labs.length,
          consultations: 0
        });

        if (recentRes.status === 'fulfilled') {
          const recentData = recentRes.value.data?.data ?? recentRes.value.data ?? [];
          setPatients(Array.isArray(recentData) ? recentData : []);
        } else {
          console.error("Erreur spécifique getRecentPatients:", recentRes.reason);
          setError('Impossible de charger la liste des derniers patients.');
        }

      } catch (err) {
        console.error('Erreur critique dashboard:', err);
        setError('Une erreur critique est survenue.');
      } finally {
        setLoading(false);
      }
    }

  loadData();
}, []);
  const latestPatients = useMemo(() => [...patients].reverse().slice(0, 5), [patients]);
  return (
    <div className="dashboard-page">
      <section className="stats-grid">
        <div className="dashboard-card" style={{ borderLeft: '4px solid #1B6B45' }}>
          <div className="card-row">
            <div className="card-icon"></div>
            <div>
              <div className="card-number" style={{ color: '#1B6B45' }}>{stats.patients}</div>
              <div className="card-label">Total patients</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card" style={{ borderLeft: '4px solid #22874F' }}>
          <div className="card-row">
            <div className="card-icon"></div>
            <div>
              <div className="card-number" style={{ color: '#22874F' }}>{stats.doctors}</div>
              <div className="card-label">Médecins actifs</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card" style={{ borderLeft: '4px solid #D97706' }}>
          <div className="card-row">
            <div className="card-icon"></div>
            <div>
              <div className="card-number" style={{ color: '#D97706' }}>{stats.laborantins}</div>
              <div className="card-label">Laborantins</div>
            </div>
          </div>
        </div>

        <div className="dashboard-card" style={{ borderLeft: '4px solid #D94F38' }}>
          <div className="card-row">
            <div className="card-icon"></div>
            <div>
              <div className="card-number" style={{ color: '#D94F38' }}>{stats.consultations}</div>
              <div className="card-label">Consultations aujourd'hui</div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-title">Derniers patients</div>
            <div>
              <button className="link-button" onClick={() => navigate('/admin/patients')}>Voir tous →</button>
            </div>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="skeleton">
                <div className="s-line" />
                <div className="s-line" />
                <div className="s-line" />
              </div>
            ) : error ? (
              <div className="error-msg">{error}</div>
            ) : latestPatients.length === 0 ? (
              <div className="empty-msg">Aucun patient enregistré.</div>
            ) : (
              <table className="patients-table">
                <thead>
                  <tr>
                    <th>Numéro dossier</th>
                    <th>Nom complet</th>
                    <th>Téléphone</th>
                    <th>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {latestPatients.map((p) => (
                    <tr key={p.id || p.numeroDossier || p.nomUtilisateur} onClick={() => navigate(`/admin/patients/${p.id}`)} style={{ cursor: 'pointer' }}>
                      <td className="mono">{p.numeroDossier || p.id || 'DPI-XXXX'}</td>
                      <td className="name">{`${p.nom || ''} ${p.prenom || ''}`.trim()}</td>
                      <td className="phone">{p.telephone || p.phone || '-'}</td>
                      <td>
                        { (p.statut || 'ACTIF') === 'ACTIF' ? (
                          <span className="badge-actif">ACTIF</span>
                        ) : (
                          <span className="badge-inactif">INACTIF</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div className="dashboard-card-title">Actions rapides</div>
          </div>
          <div className="card-body action-list">
            <button className="primary-btn" onClick={() => navigate('/admin/patients/nouveau')}>+ Nouveau patient</button>
            <button className="outline-btn" onClick={() => navigate('/admin/doctors/nouveau')}>+ Nouveau médecin</button>
            <button className="outline-btn" onClick={() => navigate('/admin/laborantins/nouveau')}>+ Nouveau laborantin</button>
          </div>
        </div>
      </section>
    </div>
  );
}
