import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '../pages/auth/Login.jsx';
import LandingPage from '../pages/LandingPage.jsx';
import AdminDoctorDetails from '../pages/admin/AdminDoctorDetails.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Layout from '../components/Layout/Layout.jsx';
import DoctorLayout from '../components/Layout/DoctorLayout.jsx';
import LabLayout from '../components/Layout/LabLayout.jsx';
import PatientLayout from '../components/Layout/PatientLayout.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';
import AdminPatients from '../pages/admin/AdminPatients.jsx';
import NouveauPatient from '../pages/admin/NouveauPatient.jsx';
import AdminPatientDetails from '../pages/admin/AdminPatientDetails.jsx';
import AdminDoctors from '../pages/admin/AdminDoctors.jsx';
import NouveauDoctor from '../pages/admin/NouveauDoctor.jsx';
import AdminLaborantins from '../pages/admin/AdminLaborantins.jsx';
import NouveauLaborantin from '../pages/admin/NouveauLaborantin.jsx';
import AdminDepartements from '../pages/admin/AdminDepartements.jsx';
import NouveauDepartement from '../pages/admin/NouveauDepartement.jsx';
import DoctorDashboard from '../pages/doctor/DoctorDashboard.jsx';
import RechercherPatient from '../pages/doctor/RechercherPatient.jsx';
import DossierPatient from '../pages/doctor/DossierPatient.jsx';
import NouvelleConsultation from '../pages/doctor/NouvelleConsultation.jsx';
import AjouterAllergie from '../pages/doctor/AjouterAllergie.jsx';
import AjouterAntecedent from '../pages/doctor/AjouterAntecedent.jsx';
import LabDashboard from '../pages/laborantin/LabDashboard.jsx';
import SaisirResultat from '../pages/laborantin/SaisirResultat.jsx';
import MonDossier from '../pages/patient/MonDossier.jsx';

// function ProtectedRoute({ children, allowedRoles }) {
//   const { token, role, loading } = useAuth();

//   if (loading) {
//     return <div className="loading-screen">Chargement...</div>;
//   }

//   if (!token) { 
//     return <Navigate to="/login" replace />;
//   }

//   const userRole = role?.toUpperCase();
//   if (allowedRoles && !allowedRoles.includes(userRole)) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// }

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/admin"
        element={
          //<ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout />
          //</ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="patients" element={<AdminPatients />} />
        <Route path="patients/nouveau" element={<NouveauPatient />} />
        <Route path="patients/:id" element={<AdminPatientDetails />} />
        <Route path="doctors/:id" element={<AdminDoctorDetails />} />
        <Route path="doctors" element={<AdminDoctors />} />
        <Route path="doctors/nouveau" element={<NouveauDoctor />} />
        <Route path="laborantins" element={<AdminLaborantins />} />
        <Route path="laborantins/nouveau" element={<NouveauLaborantin />} />
        <Route path="departements" element={<AdminDepartements />} />
        <Route path="departements/nouveau" element={<NouveauDepartement />} />
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Route>

      <Route
        path="/doctor"
        element={
          //<ProtectedRoute allowedRoles={['DOCTOR']}>
            <DoctorLayout />
          //</ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DoctorDashboard />} />
        <Route path="rechercher-patient" element={<RechercherPatient />} />
        <Route path="patients/:id/dossier" element={<DossierPatient />} />
        <Route path="patients/:id/nouvelle-consultation" element={<NouvelleConsultation />} />
        <Route path="patients/:id/allergies/ajouter" element={<AjouterAllergie />} />
        <Route path="patients/:id/antecedents/ajouter" element={<AjouterAntecedent />} />
      </Route>

      <Route
        path="/laborantin"
        element={
          //<ProtectedRoute allowedRoles={['LABORANTIN']}>
            <LabLayout />
          //</ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<LabDashboard />} />
        <Route path="resultats/:id/saisir" element={<SaisirResultat />} />
      </Route>

      <Route
        path="/patient"
        element={
          //<ProtectedRoute allowedRoles={['PATIENT']}>
            <PatientLayout />
          //</ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="mon-dossier" replace />} />
        <Route path="mon-dossier" element={<MonDossier />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRouter;