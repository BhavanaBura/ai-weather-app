// ============================================
// Auth Context - Global Authentication State
// ============================================
// React Context lets us share auth state across all components
// without passing props down through every level (prop drilling)

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Base API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL;

// ---- AUTH PROVIDER COMPONENT ----
// Wrap your app with this to provide auth state everywhere
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('weatherToken'));
  const [loading, setLoading] = useState(true);

  // Set auth token in axios headers for all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      setLoading(false);
    }
  }, [token]);

  // Fetch current user profile if token exists
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`);
      setUser(response.data.user);
    } catch (error) {
      // Token is invalid or expired
      logout();
    } finally {
      setLoading(false);
    }
  };

  // ---- LOGIN FUNCTION ----
  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const { token: newToken, user: userData } = response.data;

    // Save token to localStorage so it persists on page refresh
    localStorage.setItem('weatherToken', newToken);
    setToken(newToken);
    setUser(userData);

    return response.data;
  };

  // ---- REGISTER FUNCTION ----
  const register = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/api/auth/register`, { name, email, password });
    const { token: newToken, user: userData } = response.data;

    localStorage.setItem('weatherToken', newToken);
    setToken(newToken);
    setUser(userData);

    return response.data;
  };

  // ---- LOGOUT FUNCTION ----
  const logout = () => {
    localStorage.removeItem('weatherToken');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Value object that will be available to all child components
  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

export default AuthContext;
