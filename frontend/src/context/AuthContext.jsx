import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginDemoUser, registerCitizen, registerAuthority, logoutUser } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted session from localStorage
    try {
      const storedUser = localStorage.getItem('aravalli_auth_user');
      const token = localStorage.getItem('aravalli_auth_token');
      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        // Default to citizen demo persona for seamless zero-barrier experience
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
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  };

  const loginCitizen = async (email, fullName, password) => {
    const result = await registerCitizen(email, fullName, password);
    if (result.success) {
      setUser(result.user);
    }
    return result;
  };

  const loginAuthority = async (payload) => {
    const result = await registerAuthority(payload);
    if (result.success) {
      setUser(result.user);
    }
    return result;
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
        loginCitizen,
        loginAuthority,
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
