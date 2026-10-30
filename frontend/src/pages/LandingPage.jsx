import React from 'react';
import { DashboardPage } from './DashboardPage';

/**
 * LandingPage
 * Unified into the single, clean, role-tailored DashboardPage.
 * Preserved for full backward compatibility across the codebase.
 */
export function LandingPage() {
  return <DashboardPage />;
}

export default LandingPage;
