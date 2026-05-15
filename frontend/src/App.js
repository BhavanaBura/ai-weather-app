// ============================================
// App.js - Root Component
// ============================================

import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { WeatherProvider } from './context/WeatherContext';
import Dashboard from './pages/Dashboard';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <Dashboard />
      </WeatherProvider>
    </AuthProvider>
  );
}

export default App;
