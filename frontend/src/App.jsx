import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { ReportThreatPage } from './pages/ReportThreatPage';
import { AuthorityDashboardPage } from './pages/AuthorityDashboardPage';
import { AskAravalliPage } from './pages/AskAravalliPage';
import { IncidentDossierPage } from './pages/IncidentDossierPage';
import { DatasetMethodologyPage } from './pages/DatasetMethodologyPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { RequireAuth, RequireAuthority } from './components/ProtectedRoute';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<RequireAuth><CitizenDashboardPage /></RequireAuth>} />
              <Route path="/map" element={<RiskMapPage />} />
              <Route path="/report" element={<RequireAuth><ReportThreatPage /></RequireAuth>} />
              <Route path="/authority" element={<RequireAuthority><AuthorityDashboardPage /></RequireAuthority>} />
              <Route path="/ask" element={<AskAravalliPage />} />
              <Route path="/dataset" element={<DatasetMethodologyPage />} />
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
