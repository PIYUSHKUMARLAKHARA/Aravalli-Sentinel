import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { ReportThreatPage } from './pages/ReportThreatPage';
import { AuthorityDashboardPage } from './pages/AuthorityDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { IncidentDossierPage } from './pages/IncidentDossierPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { RequireAuth, RequireAuthority, RequireAdmin } from './components/ProtectedRoute';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/overview" element={<Navigate to="/dashboard" replace />} />
              <Route path="/map" element={<RiskMapPage />} />
              <Route path="/report" element={<RequireAuth><ReportThreatPage /></RequireAuth>} />
              <Route path="/authority" element={<Navigate to="/admin?tab=triage" replace />} />
              <Route path="/admin" element={<RequireAuthority><AdminDashboardPage /></RequireAuthority>} />
              <Route path="/ask" element={<Navigate to="/" replace />} />
              <Route path="/dataset" element={<Navigate to="/" replace />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/access-denied" element={<AccessDeniedPage />} />
              <Route path="/incident/:id" element={<IncidentDossierPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
