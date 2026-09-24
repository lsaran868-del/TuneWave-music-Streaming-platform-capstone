import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('tunewave_user');
    const savedToken = localStorage.getItem('tunewave_jwt_token');
    if (savedToken && savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('tunewave_jwt_token'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check health and validate existing JWT token on startup
  useEffect(() => {
    let isMounted = true;

    const checkSystemAndAuth = async () => {
      // 1. Check live backend health
      const isLive = await api.checkHealth();
      if (isMounted) setIsBackendConnected(isLive);

      // 2. Validate token with backend /api/auth/me if token exists
      const storedToken = localStorage.getItem('tunewave_jwt_token');
      if (storedToken) {
        try {
          const freshProfile = await api.getMe();
          if (isMounted) {
            setUser(freshProfile);
            localStorage.setItem('tunewave_user', JSON.stringify(freshProfile));
          }
        } catch (err) {
          console.warn('Session expired or invalid JWT token. Clearing credentials:', err.message);
          if (isMounted) {
            setToken(null);
            setUser(null);
            localStorage.removeItem('tunewave_jwt_token');
            localStorage.removeItem('tunewave_user');
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
        }
      }

      if (isMounted) setIsCheckingAuth(false);
    };

    checkSystemAndAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    if (data && data.token) {
      setToken(data.token);
      localStorage.setItem('tunewave_jwt_token', data.token);
      setUser(data.user);
      localStorage.setItem('tunewave_user', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return data;
    }
    throw new Error('Invalid authentication response from server');
  };

  const register = async (email, password, username) => {
    const data = await api.register(email, password, username);
    if (data && data.token) {
      setToken(data.token);
      localStorage.setItem('tunewave_jwt_token', data.token);
      setUser(data.user);
      localStorage.setItem('tunewave_user', JSON.stringify(data.user));
      setIsAuthModalOpen(false);
      return data;
    }
    throw new Error('Invalid registration response from server');
  };

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tunewave_jwt_token');
    localStorage.removeItem('tunewave_user');
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authMode,
      setAuthMode,
      isBackendConnected,
      isCheckingAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
