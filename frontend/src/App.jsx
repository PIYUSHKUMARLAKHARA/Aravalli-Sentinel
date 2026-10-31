import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { ReportThreatPage } from './pages/ReportThreatPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CaseTrackingPage } from './pages/CaseTrackingPage';
import { RewardWalletPage } from './pages/RewardWalletPage';
import { IncidentDossierPage } from './pages/IncidentDossierPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { RequireAuth, RequireAuthority } from './components/ProtectedRoute';

function RootRoute() {
  const { user, isAuthority, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-xs font-mono text-[#526A59]">
        <div className="w-5 h-5 border-2 border-[#1B5E3B] border-t-transparent rounded-full animate-spin mr-2" />
        <span>Initializing Aravalli Sentinel Security Portal...</span>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  if (isAuthority) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#F5F7F0] text-[#26382D] selection:bg-[#1B5E3B] selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Root starting point: Professional Portal Login or Role-Redirect */}
              <Route path="/" element={<RootRoute />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Citizen Portal Routes (Standard & Contest /user/ Aliases) */}
              <Route
                path="/dashboard"
                element={
                  <RequireAuth>
                    <DashboardPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/report"
                element={
                  <RequireAuth>
                    <ReportThreatPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/user/report"
                element={
                  <RequireAuth>
                    <ReportThreatPage />
                  </RequireAuth>
                }
              />
              <Route path="/track" element={<CaseTrackingPage />} />
              <Route path="/user/track-case" element={<CaseTrackingPage />} />
              <Route
                path="/rewards"
                element={
                  <RequireAuth>
                    <RewardWalletPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/user/rewards"
                element={
                  <RequireAuth>
                    <RewardWalletPage />
                  </RequireAuth>
                }
              />

              {/* Geospatial & Authority Routes */}
              <Route path="/map" element={<RiskMapPage />} />
              
              {/* Forest Authority Command Center Routes */}
              <Route
                path="/admin"
                element={
                  <RequireAuthority>
                    <AdminDashboardPage initialTab="dashboard" />
                  </RequireAuthority>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAuthority>
                    <AdminDashboardPage initialTab="dashboard" />
                  </RequireAuthority>
                }
              />
              <Route
                path="/admin/map"
                element={
                  <RequireAuthority>
                    <AdminDashboardPage initialTab="map" />
                  </RequireAuthority>
                }
              />
              <Route
                path="/admin/triage"
                element={
                  <RequireAuthority>
                    <AdminDashboardPage initialTab="triage" />
                  </RequireAuthority>
                }
              />
              <Route
                path="/admin/dossier"
                element={
                  <RequireAuthority>
                    <AdminDashboardPage initialTab="dossier" />
                  </RequireAuthority>
                }
              />
              <Route path="/authority" element={<Navigate to="/admin?tab=triage" replace />} />

              {/* Legal Dossier & Static */}
              <Route path="/incident/:id" element={<IncidentDossierPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/access-denied" element={<AccessDeniedPage />} />

              {/* Safety Fallbacks */}
              <Route path="/overview" element={<Navigate to="/dashboard" replace />} />
              <Route path="/ask" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dataset" element={<Navigate to="/dashboard" replace />} />
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
