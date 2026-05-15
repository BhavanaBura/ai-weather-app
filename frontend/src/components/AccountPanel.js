// ============================================
// AccountPanel - Clickable Account Dropdown
// ============================================
// Shows profile info, favorite cities, recent searches.
// Opens when the user clicks their name in the navbar.

import React, { useState, useEffect, useRef } from 'react';
import {
  FiUser, FiLogOut, FiStar, FiClock, FiTrash2,
  FiChevronDown, FiChevronUp, FiMapPin, FiX
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWeather } from '../context/WeatherContext';
import { favoritesAPI } from '../utils/api';

const AccountPanel = () => {
  const { user, logout } = useAuth();
  const { searchWeather } = useWeather();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [totalSearchCount, setTotalSearchCount] = useState(0); // lifetime total, never capped
  const [loadingFav, setLoadingFav] = useState(false);
  const [removingCity, setRemovingCity] = useState('');

  const panelRef = useRef(null);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Load favorites + recents when panel opens
  useEffect(() => {
    if (open) loadData();
  }, [open]);

  const loadData = async () => {
    setLoadingFav(true);
    try {
      const res = await favoritesAPI.getAll();
      setFavorites(res.data.favorites || []);
      setRecentSearches(res.data.recentSearches || []);
      // Use lifetime total count from backend, not recentSearches.length (which caps at 10)
      setTotalSearchCount(res.data.totalSearchCount || 0);
    } catch (err) {
      console.error('Could not load favorites:', err);
    } finally {
      setLoadingFav(false);
    }
  };

  const handleCityClick = (cityName) => {
    searchWeather(cityName);
    setOpen(false);
  };

  const handleRemoveFavorite = async (cityName) => {
    setRemovingCity(cityName);
    try {
      await favoritesAPI.remove(cityName);
      setFavorites(prev => prev.filter(f => f.cityName !== cityName));
    } catch (err) {
      alert('Could not remove city. Try again.');
    } finally {
      setRemovingCity('');
    }
  };

  // Format the join date
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="relative" ref={panelRef}>
      {/* ---- TRIGGER BUTTON (Clickable Name) ---- */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 glass rounded-full px-4 py-2 hover:bg-white/25 transition-all group"
        title="Click to view your account"
      >
        {/* Avatar circle */}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-white text-sm font-medium max-w-[100px] truncate">{user?.name}</span>
        {open
          ? <FiChevronUp className="text-white/60 text-sm flex-shrink-0" />
          : <FiChevronDown className="text-white/60 text-sm flex-shrink-0" />
        }
      </button>

      {/* ---- DROPDOWN PANEL ---- */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden shadow-2xl z-50 animate-slide-up"
          style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 100%)', border: '1px solid rgba(148,163,184,0.15)' }}
        >

          {/* ---- PROFILE HEADER ---- */}
          <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg"
                  style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.4)' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold text-base leading-tight">{user?.name}</p>
                  <p className="text-blue-200 text-xs">{user?.email}</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white">
                <FiX />
              </button>
            </div>

            {/* Stats row */}
            <div className="flex gap-3 mt-2">
              <div className="flex-1 text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <p className="text-white font-bold text-lg">{favorites.length}</p>
                <p className="text-blue-200 text-xs">Favorites</p>
              </div>
              <div className="flex-1 text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                {/* totalSearchCount = lifetime total searches, always accurate even beyond 10 */}
                <p className="text-white font-bold text-lg">{totalSearchCount}</p>
                <p className="text-blue-200 text-xs">Searches</p>
              </div>
              <div className="flex-1 text-center py-2 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
                <p className="text-white font-bold text-xs leading-tight mt-1">{joinDate}</p>
                <p className="text-blue-200 text-xs">Joined</p>
              </div>
            </div>
          </div>

          {/* ---- TAB SWITCHER ---- */}
          <div className="flex border-b" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
            {[
              { key: 'favorites', label: '⭐ Favorites' },
              { key: 'recent',    label: '🕐 Recent' },
              { key: 'profile',   label: '👤 Profile' },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex-1 py-2.5 text-xs font-semibold transition-all"
                style={{
                  color: tab === t.key ? '#60a5fa' : 'rgba(148,163,184,0.6)',
                  borderBottom: tab === t.key ? '2px solid #60a5fa' : '2px solid transparent',
                  background: 'transparent'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ---- TAB CONTENT ---- */}
          <div className="overflow-y-auto" style={{ maxHeight: '280px' }}>

            {loadingFav && (
              <div className="py-8 text-center">
                <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-2" />
                <p className="text-slate-400 text-xs">Loading...</p>
              </div>
            )}

            {/* FAVORITES TAB */}
            {!loadingFav && tab === 'favorites' && (
              <div className="p-3">
                {favorites.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="text-3xl mb-2">⭐</div>
                    <p className="text-slate-400 text-sm font-medium">No favorites yet</p>
                    <p className="text-slate-500 text-xs mt-1">Search a city and click the ⭐ star to save it here</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {favorites.map((fav, i) => (
                      <div key={i}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all group">
                        {/* Click city name to load weather */}
                        <button
                          onClick={() => handleCityClick(fav.cityName)}
                          className="flex items-center gap-2 flex-1 text-left"
                        >
                          <FiMapPin className="text-yellow-400 text-sm flex-shrink-0" />
                          <div>
                            <p className="text-white text-sm font-medium">{fav.cityName}</p>
                            <p className="text-slate-500 text-xs">{fav.country}</p>
                          </div>
                        </button>
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveFavorite(fav.cityName)}
                          disabled={removingCity === fav.cityName}
                          className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                          title="Remove from favorites"
                        >
                          {removingCity === fav.cityName
                            ? <div className="w-3 h-3 border border-red-400/40 border-t-red-400 rounded-full animate-spin" />
                            : <FiTrash2 className="text-xs" />
                          }
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* RECENT TAB */}
            {!loadingFav && tab === 'recent' && (
              <div className="p-3">
                {recentSearches.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="text-3xl mb-2">🕐</div>
                    <p className="text-slate-400 text-sm font-medium">No recent searches</p>
                    <p className="text-slate-500 text-xs mt-1">Your searched cities will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {recentSearches.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleCityClick(s.cityName)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left"
                      >
                        <FiClock className="text-blue-400 text-sm flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{s.cityName}</p>
                          {s.searchedAt && (
                            <p className="text-slate-500 text-xs">
                              {new Date(s.searchedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PROFILE TAB */}
            {tab === 'profile' && (
              <div className="p-4 space-y-3">
                <div className="rounded-xl p-3 space-y-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="flex items-center gap-3">
                    <FiUser className="text-blue-400 text-sm" />
                    <div>
                      <p className="text-slate-400 text-xs">Full Name</p>
                      <p className="text-white text-sm font-medium">{user?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 text-sm">✉️</span>
                    <div>
                      <p className="text-slate-400 text-xs">Email</p>
                      <p className="text-white text-sm font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 text-sm">📅</span>
                    <div>
                      <p className="text-slate-400 text-xs">Member Since</p>
                      <p className="text-white text-sm font-medium">{joinDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 text-sm">⭐</span>
                    <div>
                      <p className="text-slate-400 text-xs">Saved Cities</p>
                      <p className="text-white text-sm font-medium">{favorites.length} {favorites.length === 1 ? 'city' : 'cities'} saved</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-blue-400 text-sm">🔍</span>
                    <div>
                      <p className="text-slate-400 text-xs">Total Searches</p>
                      <p className="text-white text-sm font-medium">{totalSearchCount} {totalSearchCount === 1 ? 'search' : 'searches'} made</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ---- FOOTER: LOGOUT ---- */}
          <div className="p-3 border-t" style={{ borderColor: 'rgba(148,163,184,0.1)' }}>
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
            >
              <FiLogOut />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPanel;
