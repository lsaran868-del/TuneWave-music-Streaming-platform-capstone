import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('tunewave_jwt_token'));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    // Initialize default demo user if token exists or local storage session
    const savedUser = localStorage.getItem('tunewave_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        setUser(defaultDemoUser);
      }
    } else {
      setUser(defaultDemoUser);
    }

    // Ping backend to check live API connection status
    fetch('/api/songs')
      .then(res => setIsBackendConnected(res.ok))
      .catch(() => setIsBackendConnected(false));
  }, []);

  const defaultDemoUser = {
    id: 'usr-demo',
    email: 'alex.listener@tunewave.io',
    username: 'Alex Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    plan: 'Premium Pro',
    totalHoursListened: 142.5,
    topGenre: 'Synthwave'
  };

  const login = async (email, password) => {
    const data = await api.login(email, password);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('tunewave_jwt_token', data.token);
      const userObj = data.user || defaultDemoUser;
      setUser(userObj);
      localStorage.setItem('tunewave_user', JSON.stringify(userObj));
      setIsAuthModalOpen(false);
    }
  };

  const register = async (email, password, username) => {
    const data = await api.register(email, password, username);
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('tunewave_jwt_token', data.token);
      const userObj = data.user || { ...defaultDemoUser, email, username };
      setUser(userObj);
      localStorage.setItem('tunewave_user', JSON.stringify(userObj));
      setIsAuthModalOpen(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('tunewave_jwt_token');
    localStorage.removeItem('tunewave_user');
  };

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
      isBackendConnected
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
