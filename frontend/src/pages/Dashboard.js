// ============================================
// Dashboard Page - Main App View
// ============================================

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import CurrentWeather from '../components/CurrentWeather';
import Forecast from '../components/Forecast';
import AIInsights from '../components/AIInsights';
import FavoritesSection from '../components/FavoritesSection';
import LoadingSpinner from '../components/LoadingSpinner';
import AuthModal from '../components/AuthModal';
import { useWeather } from '../context/WeatherContext';
import { useAuth } from '../context/AuthContext';

// Welcome/hero screen shown before any search
const WelcomeScreen = ({ onShowAuth, isAuthenticated }) => (
  <div className="text-center py-16 animate-fade-in">
    <div className="text-8xl mb-6 animate-pulse-slow">🌍</div>
    <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
      AI-Powered Weather Insights
    </h2>
    <p className="text-white/60 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
      Search any city to get real-time weather data, 5-day forecast,
      and personalized AI recommendations for food, clothing, safety &amp; activities!
    </p>

    {/* Feature Pills */}
    <div className="flex flex-wrap justify-center gap-3 mb-10">
      {[
        { emoji: '🌡️', text: 'Real-time Weather' },
        { emoji: '📅', text: '5-Day Forecast' },
        { emoji: '🤖', text: 'AI Insights' },
        { emoji: '👗', text: 'Clothing Tips' },
        { emoji: '🥤', text: 'Food & Drink Advice' },
        { emoji: '🛡️', text: 'Safety Alerts' },
      ].map((feature, i) => (
        <span key={i}
          className="glass rounded-full px-4 py-2 text-white text-sm flex items-center gap-2 animate-slide-up"
          style={{ animationDelay: `${i * 0.1}s` }}>
          <span>{feature.emoji}</span>
          <span>{feature.text}</span>
        </span>
      ))}
    </div>

    {!isAuthenticated && (
      <button
        onClick={onShowAuth}
        className="px-6 py-3 rounded-full text-white font-semibold text-sm transition-all"
        style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)' }}
      >
        ✨ Login to Save Favorites & More
      </button>
    )}
  </div>
);

// Divider with label
const SectionDivider = ({ label }) => (
  <div className="flex items-center gap-3">
    <div className="h-px flex-1 bg-white/10" />
    <span className="text-white/50 text-sm font-medium">{label}</span>
    <div className="h-px flex-1 bg-white/10" />
  </div>
);

const Dashboard = () => {
  const { loading, error, currentWeather, forecast } = useWeather();
  const { isAuthenticated } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  return (
    // Single fixed dark gradient — no dark/light toggle
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg,#0f172a 0%,#1e1b4b 40%,#0f172a 100%)' }}>

      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
          style={{ background: 'rgba(59,130,246,0.15)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl animate-pulse-slow"
          style={{ background: 'rgba(124,58,237,0.12)', animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-3xl"
          style={{ background: 'rgba(99,102,241,0.08)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Navbar */}
        <Navbar onShowAuth={() => setShowAuth(true)} />

        {/* Search Bar */}
        <div className="mt-2 mb-6">
          <SearchBar />
        </div>

        {/* Main Content */}
        <div className="px-4 pb-12 space-y-6">

          {/* ---- FAVORITES SECTION (always visible when logged in) ---- */}
          <FavoritesSection />

          {/* Error Message */}
          {error && (
            <div className="glass rounded-2xl p-4 text-center animate-fade-in border"
              style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)' }}>
              <p className="text-red-300 font-medium">⚠️ {error}</p>
              <p className="text-white/40 text-sm mt-1">Please check the city name and try again</p>
            </div>
          )}

          {/* Loading State */}
          {loading && <LoadingSpinner />}

          {/* ---- WEATHER DATA ---- */}
          {!loading && currentWeather && (
            <>
              <SectionDivider label="🌡️ Current Weather" />
              <CurrentWeather />

              <SectionDivider label="📅 Forecast" />
              {forecast && <Forecast />}

              <SectionDivider label="🤖 AI Insights" />
              <AIInsights />
            </>
          )}

          {/* Welcome Screen */}
          {!loading && !currentWeather && !error && (
            <WelcomeScreen
              onShowAuth={() => setShowAuth(true)}
              isAuthenticated={isAuthenticated}
            />
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  );
};

export default Dashboard;
