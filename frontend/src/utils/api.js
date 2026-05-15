// ============================================
// API Utility - Favorites API calls
// ============================================

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const favoritesAPI = {
  getAll: () => axios.get(`${API_URL}/api/favorites`),
  add: (data) => axios.post(`${API_URL}/api/favorites`, data),
  remove: (cityName) => axios.delete(`${API_URL}/api/favorites/${encodeURIComponent(cityName)}`),
  updatePreferences: (prefs) => axios.put(`${API_URL}/api/favorites/preferences`, prefs)
};
