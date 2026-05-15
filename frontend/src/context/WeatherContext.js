// ============================================
// Weather Context - Global Weather State
// ============================================

import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const WeatherContext = createContext();
const API_URL = process.env.REACT_APP_API_URL;

export const WeatherProvider = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchWeather = async (city) => {
    setLoading(true);
    setError(null);
    setAiInsights(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${API_URL}/api/weather/current?city=${encodeURIComponent(city)}`),
        axios.get(`${API_URL}/api/weather/forecast?city=${encodeURIComponent(city)}`)
      ]);
      setCurrentWeather(weatherRes.data.data);
      setForecast(forecastRes.data.data);
      fetchAIInsights(weatherRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'City not found. Please check the city name.');
    } finally {
      setLoading(false);
    }
  };

  const searchByCoords = async (lat, lon) => {
    setLoading(true);
    setError(null);
    setAiInsights(null);
    try {
      const [weatherRes, forecastRes] = await Promise.all([
        axios.get(`${API_URL}/api/weather/current?lat=${lat}&lon=${lon}`),
        axios.get(`${API_URL}/api/weather/forecast?lat=${lat}&lon=${lon}`)
      ]);
      setCurrentWeather(weatherRes.data.data);
      setForecast(forecastRes.data.data);
      fetchAIInsights(weatherRes.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch weather for your location.');
    } finally {
      setLoading(false);
    }
  };

  // High-accuracy geolocation — returns Promise
  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by your browser.'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => {
          const msgs = {
            1: 'Location access denied. Please allow location in browser settings.',
            2: 'Location unavailable. Try searching manually.',
            3: 'Location timed out. Try again.',
          };
          reject(new Error(msgs[err.code] || 'Could not get location.'));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  };

  const fetchAIInsights = async (weatherData) => {
    setAiLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/ai/insights`, { weatherData });
      setAiInsights(response.data.insights);
    } catch (err) {
      setAiInsights(null);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <WeatherContext.Provider value={{
      currentWeather, forecast, aiInsights,
      loading, aiLoading, error,
      searchWeather, searchByCoords, getUserLocation
    }}>
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used inside WeatherProvider');
  return context;
};

export default WeatherContext;
