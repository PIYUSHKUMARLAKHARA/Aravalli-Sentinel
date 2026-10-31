import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingLoginPage } from './pages/LandingLoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';
import { AuthorityDashboardPage } from './pages/AuthorityDashboardPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { ReportThreatPage } from './pages/ReportThreatPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { IncidentDossierPage } from './pages/IncidentDossierPage';
import { AboutPage } from './pages/AboutPage';
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
              {/* Starting Page — Landing & Dual-Portal Selection Screen */}
              <Route path="/" element={<LandingLoginPage />} />

              {/* Portal Dedicated Sub-Routes */}
              <Route path="/login" element={<LandingLoginPage />} />
              <Route path="/citizen/login" element={<LandingLoginPage />} />
              <Route path="/citizen/register" element={<LandingLoginPage />} />
              <Route path="/officer/login" element={<LandingLoginPage />} />

              {/* Citizen Routes */}
              <Route
                path="/citizen/dashboard"
                element={
                  <RequireAuth>
                    <CitizenDashboardPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <DashboardPage />
                  </RequireAuth>
                }
              />
              <Route path="/overview" element={<Navigate to="/citizen/dashboard" replace />} />
              <Route
                path="/report"
                element={
                  <RequireAuth>
                    <ReportThreatPage />
                  </RequireAuth>
                }
              />

              {/* Forest Authority & Officer Routes */}
              <Route
                path="/officer/dashboard"
                element={
                  <RequireAuthority>
                    <AuthorityDashboardPage />
                  </RequireAuthority>
                }
              />
              <Route
                path="/authority"
                element={
                  <RequireAuthority>
                    <Navigate to="/officer/dashboard" replace />
                  </RequireAuthority>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireAuthority>
                    <AdminDashboardPage />
                  </RequireAuthority>
                }
              />

              {/* Authenticated Internal Routes */}
              <Route
                path="/map"
                element={
                  <RequireAuth>
                    <RiskMapPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/incident/:id"
                element={
                  <RequireAuth>
                    <IncidentDossierPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/about"
                element={
                  <RequireAuth>
                    <AboutPage />
                  </RequireAuth>
                }
              />
              <Route path="/access-denied" element={<AccessDeniedPage />} />

              {/* Legacy Aliases & Fallbacks */}
              <Route path="/ask" element={<Navigate to="/about" replace />} />
              <Route path="/dataset" element={<Navigate to="/about" replace />} />
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
