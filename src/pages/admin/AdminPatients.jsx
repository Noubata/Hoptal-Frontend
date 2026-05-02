import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchPatients, getRecentPatients, getAllPatients } from '../../api/patientApi.js';

const bloodTypeMap = {
  A_POSITIF: 'A+', A_NEGATIF: 'A-',
  B_POSITIF: 'B+', B_NEGATIF: 'B-',
  O_POSITIF: 'O+', O_NEGATIF: 'O-',
  AB_POSITIF: 'AB+', AB_NEGATIF: 'AB-'
};

export default function AdminPatients() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadRecent() {
      setLoading(true);
      setError('');
      try {
        const response = await getAllPatients();  // ← changed here
        const data = response.data?.data ?? response.data ?? [];
        setPatients(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Impossible de charger les patients récents.');
      } finally {
        setLoading(false);
      }
    }

    loadRecent();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      return;
    }

    const timer = setTimeout(() => {
      async function search() {
        setLoading(true);
        setError('');
        try {
          const response = await searchPatients(query.trim());
          const data = response.data ?? [];
          setPatients(Array.isArray(data) ? data : []);
        } catch (err) {
          setError('Erreur lors de la recherche.');
        } finally {
          setLoading(false);
        }
      }

      search();
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const filteredPatients = useMemo(() => {
    if (!statusFilter) return patients;
    return patients.filter(
      p => (p.statut || 'ACTIF').toLowerCase() === statusFilter.toLowerCase()
    );
  }, [patients, statusFilter]);

  const getStatusBadge = (statut) => {
    const status = statut || 'ACTIF';

    if (status === 'ACTIF') return { bg: '#E8F5EE', color: '#1B6B45' };
    if (status === 'INACTIF') return { bg: '#FEF0EE', color: '#D94F38' };
    if (status === 'EN_ATTENTE') return { bg: '#FEF3C7', color: '#D97706' };
    if (status === 'DECEDE') return { bg: '#F3F4F6', color: '#374151' };

    return { bg: '#E8F5EE', color: '#1B6B45' };
  };

  return (
    <section style={{ background: '#F9FAFB', padding: '0 28px 28px' }}>

      {/* HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: '10px', color: '#6B7280', textTransform: 'uppercase' }}>
            Patients
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 'bold' }}>
            Liste des patients
          </h1>
        </div>

        <button
          onClick={() => navigate('/admin/patients/nouveau')}
          style={{
            background: '#1B6B45',
            color: 'white',
            padding: '9px 18px',
            borderRadius: '7px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          + Nouveau patient
        </button>
      </header>

      {/* BARRE DE RECHERCHE */}
  <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'white', border: '1.5px solid #E5E7EB',
    borderRadius: 8, padding: '0 14px', flex: 1, maxWidth: 480
  }}>
    <span style={{ fontSize: 16, color: '#9CA3AF' }}>🔍</span>
    <input
      type="search"
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Rechercher par nom, prénom ou numéro de dossier..."
      style={{
        border: 'none', outline: 'none', fontSize: 14,
        fontFamily: "'DM Sans', sans-serif", color: '#111827',
        padding: '10px 0', flex: 1, background: 'transparent'
      }}
    />
  </div>
  <select
    value={statusFilter}
    onChange={e => setStatusFilter(e.target.value)}
    style={{
      width: 180, padding: '10px 14px',
      border: '1.5px solid #E5E7EB', borderRadius: 8,
      fontSize: 13, fontFamily: "'DM Sans', sans-serif",
      color: '#374151', background: 'white', cursor: 'pointer'
    }}
  >
    <option value="">Tous les statuts</option>
    <option value="ACTIF">Actif</option>
    <option value="INACTIF">Inactif</option>
    <option value="EN_ATTENTE">En attente</option>
    <option value="DECEDE">Décédé</option>
  </select>
</div>

<div style={{
  background: 'white', borderRadius: 12,
  border: '1px solid #E5E7EB',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)', overflow: 'hidden'
}}>
  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
    <thead>
      <tr style={{ background: '#F9FAFB' }}>
        {[
          { label: 'NO. DOSSIER',     width: '140px' },
          { label: 'PRENOM',    width: '120px' },
          { label: 'NOM',   width: '120px' },
          { label: 'DATE DE NAISSANCE',width: '130px' },
          { label: 'TELEPHONE',        width: '160px' },
          { label: 'GROUPE SANGUIN',   width: '100px' },
          { label: 'STATUT',       width: '100px' },
          { label: 'ACTIONS',             width: '80px'  },
        ].map(col => (
          <th key={col.label} style={{
            textAlign: 'left',
            padding: '10px 16px',
            fontSize: '11px',
            fontWeight: 600,
            color: '#9CA3AF',
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '0.8px',
            borderBottom: '1px solid #E5E7EB',
            width: col.width,
            whiteSpace: 'nowrap'
          }}>{col.label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {filteredPatients.map((p, idx) => (
  <tr
    key={p.id || `patient-${idx}`}
          style={{
            borderBottom: idx < filteredPatients.length - 1 ? '1px solid #F3F4F6' : 'none',
            transition: 'background 0.1s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
          onMouseLeave={e => e.currentTarget.style.background = 'white'}
        >
          {/* FILE NO */}
          <td style={{
            padding: '14px 16px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '13px',
            fontWeight: 600,
            color: '#374151'
          }}>
            {p.numeroDossier || '—'}
          </td>

          {/* NOM */}
          <td style={{ padding: '14px 16px', fontSize: '14px', fontWeight: 600, color: '#111827' }}>
            {p.nom || '—'}
          </td>

          {/* PRÉNOM */}
          <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>
            {p.prenom || '—'}
          </td>

          {/* DATE NAISSANCE */}
          <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>
            {p.dateDeNaissance
              ? new Date(p.dateDeNaissance).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
              : '—'}
          </td>

          {/* TÉLÉPHONE */}
          <td style={{ padding: '14px 16px', fontSize: '13px', color: '#374151' }}>
            {p.telephone || '—'}
          </td>

          {/* GROUPE SANGUIN */}
          <td style={{ padding: '14px 16px' }}>
            {p.typeSang ? (
              <span style={{
                background: '#DBEAFE',
                color: '#1D4ED8',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace"
              }}>
                {bloodTypeMap[p.typeSang] || p.typeSang}
              </span>
            ) : '—'}
          </td>

          {/* STATUT */}
          <td style={{ padding: '14px 16px' }}>
            <span style={{
              background: p.statut === 'INACTIF' ? '#FEF0EE'
                        : p.statut === 'EN_ATTENTE' ? '#FEF3C7'
                        : '#DCFCE7',
              color: p.statut === 'INACTIF' ? '#DC2626'
                   : p.statut === 'EN_ATTENTE' ? '#D97706'
                   : '#16A34A',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600
            }}>
              {p.statut === 'ACTIF' ? 'Active'
               : p.statut === 'INACTIF' ? 'Inactive'
               : p.statut || 'Active'}
            </span>
          </td>

          {/* ACTION */}
          <td style={{ padding: '14px 16px' }}>
            <button
              onClick={() => navigate(`/admin/patients/${p.id}`)}
              style={{
                background: 'white',
                color: '#374151',
                border: '1px solid #E5E7EB',
                padding: '5px 14px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif"
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              View
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* COMPTEUR */}
  <div style={{
    padding: '12px 16px',
    fontSize: '13px',
    color: '#6B7280',
    borderTop: '1px solid #F3F4F6',
    fontFamily: "'DM Sans', sans-serif"
  }}>
    Showing {filteredPatients.length} of {patients.length} patients
  </div>
</div>
</section>
  );}