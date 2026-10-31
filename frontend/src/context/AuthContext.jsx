import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginDemoUser,
  loginCitizen as apiLoginCitizen,
  loginAuthority as apiLoginAuthority,
  loginAdmin as apiLoginAdmin,
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
        setUser(null);
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

  const loginAuthorityWithCredentials = async (emailOrPayload, password) => {
    // If called with an object containing inviteSecret (provisioning call)
    if (typeof emailOrPayload === 'object' && emailOrPayload !== null) {
      if (emailOrPayload.inviteSecret) {
        return provisionAuthorityAccount(emailOrPayload);
      }
      return loginAuthorityWithCredentials(emailOrPayload.email, emailOrPayload.password);
    }

    setLoading(true);
    try {
      const result = await apiLoginAuthority(emailOrPayload, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const provisionAuthorityAccount = async (payload) => {
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

  const loginAdminAccount = async (email, password) => {
    setLoading(true);
    try {
      const result = await apiLoginAdmin(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email, newPassword) => {
    return await resetCitizenPassword(email, newPassword);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  const isAuthority = user?.role === 'authority' || user?.role === 'admin';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthority,
        isAdmin,
        switchPersona,
        loginCitizen: loginCitizenWithEmail,
        registerCitizen: registerCitizenAccount,
        loginAuthority: loginAuthorityWithCredentials,
        loginAdmin: loginAdminAccount,
        provisionAuthority: provisionAuthorityAccount,
        loginAuthorityAccount: provisionAuthorityAccount,
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
