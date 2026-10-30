import React from 'react';
import { AdminDashboardPage } from './AdminDashboardPage';

/**
 * AuthorityDashboardPage
 * Moved into the unified Admin & Authority Operations Command Vault.
 * Preserved for full backward compatibility across the codebase.
 */
export function AuthorityDashboardPage() {
  return <AdminDashboardPage initialTab="triage" />;
}

export default AuthorityDashboardPage;
