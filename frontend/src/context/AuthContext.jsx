import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginDemoUser,
  loginCitizen as apiLoginCitizen,
  registerCitizen as apiRegisterCitizen,
  registerAuthority as apiRegisterAuthority,
  resetCitizenPassword,
  logoutUser,
} from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('aravalli_auth_user');
      const token = localStorage.getItem('aravalli_auth_token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        // Pre-initialize demo persona if first visit
        const defaultCitizen = {
          uid: 'demo-citizen-01',
          name: 'Aarav Mehta',
          email: 'citizen@aravalli.sentinel',
          role: 'citizen',
          badge: 'Citizen Sentinel',
        };
        setUser(defaultCitizen);
        localStorage.setItem('aravalli_auth_token', 'demo-token-citizen-valid');
        localStorage.setItem('aravalli_auth_user', JSON.stringify(defaultCitizen));
      }
    } catch (e) {
      console.error('Failed to load session:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const switchPersona = async (targetRole) => {
    setLoading(true);
    try {
      const result = await loginDemoUser(targetRole);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const loginCitizenWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const result = await apiLoginCitizen(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const registerCitizenAccount = async (email, fullName, password) => {
    setLoading(true);
    try {
      const result = await apiRegisterCitizen(email, fullName, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const loginAuthorityAccount = async (payload) => {
    setLoading(true);
    try {
      const result = await apiRegisterAuthority(payload);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    return await resetCitizenPassword(email);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const isAuthority = user?.role === 'authority' || user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthority,
        switchPersona,
        loginCitizen: loginCitizenWithEmail,
        registerCitizen: registerCitizenAccount,
        loginAuthority: loginAuthorityAccount,
        forgotPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
