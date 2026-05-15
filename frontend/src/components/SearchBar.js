// ============================================
// SearchBar Component
// ============================================

import React, { useState } from 'react';
import { FiSearch, FiStar, FiClock } from 'react-icons/fi';
import { useWeather } from '../context/WeatherContext';
import { useAuth } from '../context/AuthContext';
import { favoritesAPI } from '../utils/api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const { searchWeather, loading } = useWeather();
  const { isAuthenticated } = useAuth();

  const handleFocus = async () => {
    setShowDropdown(true);
    if (isAuthenticated) {
      try {
        const res = await favoritesAPI.getAll();
        setFavorites(res.data.favorites || []);
        setRecentSearches(res.data.recentSearches || []);
      } catch (err) { /* ignore */ }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchWeather(query.trim());
    setShowDropdown(false);
  };

  const handleCityClick = (cityName) => {
    setQuery(cityName);
    searchWeather(cityName);
    setShowDropdown(false);
  };

  return (
    <div className="relative max-w-2xl mx-auto px-4">
      <form onSubmit={handleSearch} className="flex gap-2">

        {/* Search Input */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-lg" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            placeholder="Search city… (e.g., Hyderabad, Mumbai)"
            className="w-full pl-12 pr-4 py-4 glass rounded-2xl text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/40 text-base"
          />
        </div>

        {/* Search Button */}
        <button
          type="submit"
          disabled={loading}
          className="glass rounded-2xl px-6 py-4 text-white font-semibold hover:bg-white/20 transition-all disabled:opacity-50"
        >
          {loading
            ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : 'Search'
          }
        </button>
      </form>

      {/* Dropdown — Favorites & Recent Searches */}
      {showDropdown && isAuthenticated && (favorites.length > 0 || recentSearches.length > 0) && (
        <div
          className="absolute top-full left-4 right-4 mt-2 rounded-2xl overflow-hidden z-50 animate-fade-in shadow-2xl"
          style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          {favorites.length > 0 && (
            <div className="p-3">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 px-2">⭐ Favorites</p>
              {favorites.slice(0, 5).map((fav, i) => (
                <button key={i} onClick={() => handleCityClick(fav.cityName)}
                  className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-white/10 transition-all flex items-center gap-2">
                  <FiStar className="text-yellow-400 text-sm flex-shrink-0" />
                  <span>{fav.cityName}, {fav.country}</span>
                </button>
              ))}
            </div>
          )}
          {recentSearches.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-2 px-2">🕐 Recent</p>
              {recentSearches.slice(0, 5).map((s, i) => (
                <button key={i} onClick={() => handleCityClick(s.cityName)}
                  className="w-full text-left px-3 py-2 rounded-xl text-white hover:bg-white/10 transition-all flex items-center gap-2">
                  <FiClock className="text-blue-300 text-sm flex-shrink-0" />
                  <span>{s.cityName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
