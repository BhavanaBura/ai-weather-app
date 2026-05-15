// ============================================
// FavoritesSection — Dashboard Favorites Panel
// ============================================
// IMPORTANT: All hooks must be called BEFORE any early return
// to follow React's Rules of Hooks.

import React, { useState, useEffect } from 'react';
import { FiStar, FiClock, FiTrash2, FiMapPin, FiRefreshCw } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWeather } from '../context/WeatherContext';
import { favoritesAPI } from '../utils/api';

const FavoritesSection = () => {
  const { isAuthenticated } = useAuth();
  const { searchWeather } = useWeather();

  // ---- ALL HOOKS MUST COME FIRST — before any conditional return ----
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [removingCity, setRemovingCity] = useState('');
  const [activeTab, setActiveTab] = useState('favorites');

  // Load data whenever auth status changes
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]); // eslint-disable-line

  // ---- Early return AFTER all hooks ----
  if (!isAuthenticated) return null;

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await favoritesAPI.getAll();
      setFavorites(res.data.favorites || []);
      setRecentSearches(res.data.recentSearches || []);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCityClick = (cityName) => {
    searchWeather(cityName);
  };

  const handleRemove = async (cityName) => {
    setRemovingCity(cityName);
    try {
      await favoritesAPI.remove(cityName);
      setFavorites(prev => prev.filter(f => f.cityName !== cityName));
    } catch (err) {
      alert('Could not remove city. Please try again.');
    } finally {
      setRemovingCity('');
    }
  };

  return (
    <div className="glass rounded-3xl p-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg flex items-center gap-2">
          <FiStar className="text-yellow-400" /> My Cities
        </h3>
        <button
          onClick={loadData}
          className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
          title="Refresh"
        >
          <FiRefreshCw className={`text-sm ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('favorites')}
          className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background: activeTab === 'favorites' ? 'rgba(250,204,21,0.2)' : 'transparent',
            color: activeTab === 'favorites' ? '#fbbf24' : 'rgba(255,255,255,0.4)',
            border: activeTab === 'favorites' ? '1px solid rgba(250,204,21,0.4)' : '1px solid rgba(255,255,255,0.1)'
          }}
        >
          ⭐ Favorites ({favorites.length})
        </button>
        <button
          onClick={() => setActiveTab('recent')}
          className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background: activeTab === 'recent' ? 'rgba(96,165,250,0.2)' : 'transparent',
            color: activeTab === 'recent' ? '#60a5fa' : 'rgba(255,255,255,0.4)',
            border: activeTab === 'recent' ? '1px solid rgba(96,165,250,0.4)' : '1px solid rgba(255,255,255,0.1)'
          }}
        >
          🕐 Recent ({recentSearches.length})
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 skeleton rounded-2xl" />
          ))}
        </div>
      )}

      {/* ---- FAVORITES TAB ---- */}
      {!loading && activeTab === 'favorites' && (
        <>
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">⭐</div>
              <p className="text-white/50 text-sm font-medium">No favorite cities yet</p>
              <p className="text-white/30 text-xs mt-1">
                Search any city and click the ⭐ star on the weather card to save it here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {favorites.map((fav, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl p-3 transition-all hover:scale-105"
                  style={{ background: 'rgba(250,204,21,0.08)', border: '1px solid rgba(250,204,21,0.2)' }}
                >
                  <button onClick={() => handleCityClick(fav.cityName)} className="w-full text-left">
                    <div className="flex items-start gap-2">
                      <FiMapPin className="text-yellow-400 text-sm mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{fav.cityName}</p>
                        <p className="text-white/40 text-xs">{fav.country}</p>
                      </div>
                    </div>
                  </button>
                  {/* Delete on hover */}
                  <button
                    onClick={() => handleRemove(fav.cityName)}
                    disabled={removingCity === fav.cityName}
                    className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-white/30 hover:text-red-400 p-0.5"
                    title="Remove"
                  >
                    {removingCity === fav.cityName
                      ? <div className="w-3 h-3 border border-red-400/50 border-t-red-400 rounded-full animate-spin" />
                      : <FiTrash2 className="text-xs" />
                    }
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ---- RECENT TAB ---- */}
      {!loading && activeTab === 'recent' && (
        <>
          {recentSearches.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🕐</div>
              <p className="text-white/50 text-sm font-medium">No recent searches</p>
              <p className="text-white/30 text-xs mt-1">Your searched cities will appear here automatically</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {recentSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleCityClick(s.cityName)}
                  className="text-left rounded-2xl p-3 transition-all hover:scale-105"
                  style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)' }}
                >
                  <div className="flex items-start gap-2">
                    <FiClock className="text-blue-400 text-sm mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold truncate">{s.cityName}</p>
                      {s.searchedAt && (
                        <p className="text-white/40 text-xs">
                          {new Date(s.searchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FavoritesSection;
