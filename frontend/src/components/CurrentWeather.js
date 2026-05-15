// ============================================
// CurrentWeather Component
// ============================================

import React, { useState } from 'react';
import {
  WiHumidity, WiStrongWind, WiBarometer, WiFog,
  WiSunrise, WiSunset, WiThermometer
} from 'react-icons/wi';
import { FiStar, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useWeather } from '../context/WeatherContext';
import { favoritesAPI } from '../utils/api';

// Maps weather condition to a background class
const getWeatherBg = (condition) => {
  const c = condition?.toLowerCase() || '';
  if (c.includes('clear') || c.includes('sunny')) return 'bg-weather-clear';
  if (c.includes('rain') || c.includes('drizzle')) return 'bg-weather-rain';
  if (c.includes('snow')) return 'bg-weather-snow';
  if (c.includes('storm') || c.includes('thunder')) return 'bg-weather-storm';
  if (c.includes('cloud')) return 'bg-weather-clouds';
  return 'bg-weather-default';
};

const CurrentWeather = () => {
  const { currentWeather } = useWeather();
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  if (!currentWeather) return null;

  const {
    city, country, temperature, feelsLike, humidity,
    pressure, visibility, windSpeed, condition, description,
    iconUrl, sunrise, sunset, timestamp
  } = currentWeather;

  const bgClass = getWeatherBg(condition);

  const handleAddFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please login to save favorite cities!');
      return;
    }
    setFavLoading(true);
    try {
      await favoritesAPI.add({
        cityName: city,
        country,
        lat: currentWeather.lat,
        lon: currentWeather.lon
      });
      setIsFavorited(true);
      setTimeout(() => setIsFavorited(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not add to favorites');
    } finally {
      setFavLoading(false);
    }
  };

  // Detail stat card
  const StatCard = ({ icon, label, value }) => (
    <div className="glass rounded-2xl p-4 flex flex-col items-center gap-1 animate-slide-up">
      <div className="text-blue-200 text-2xl">{icon}</div>
      <p className="text-white/60 text-xs font-medium uppercase tracking-wider">{label}</p>
      <p className="text-white font-bold text-lg">{value}</p>
    </div>
  );

  return (
    <div className={`${bgClass} rounded-3xl p-6 md:p-8 text-white shadow-2xl animate-fade-in`}>

      {/* Header Row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold">{city}</h2>
          <p className="text-white/70 text-lg">{country}</p>
          <p className="text-white/50 text-sm mt-1">
            {new Date(timestamp).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleAddFavorite}
          disabled={favLoading}
          className="glass rounded-full p-3 hover:bg-white/20 transition-all"
          title="Add to favorites"
        >
          {isFavorited ? (
            <FiCheck className="text-green-300 text-xl" />
          ) : (
            <FiStar className={`text-xl ${favLoading ? 'opacity-50' : 'text-yellow-300'}`} />
          )}
        </button>
      </div>

      {/* Main Temperature */}
      <div className="flex items-center gap-4 mb-8">
        <img src={iconUrl} alt={condition} className="w-24 h-24 drop-shadow-lg" />
        <div>
          <div className="text-7xl md:text-8xl font-extrabold leading-none">
            {temperature}°
          </div>
          <p className="text-white/80 text-xl capitalize mt-1">{description}</p>
          <p className="text-white/60 flex items-center gap-1 mt-1">
            <WiThermometer className="text-xl" />
            Feels like {feelsLike}°C
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard icon={<WiHumidity />} label="Humidity" value={`${humidity}%`} />
        <StatCard icon={<WiStrongWind />} label="Wind" value={`${windSpeed} m/s`} />
        <StatCard icon={<WiBarometer />} label="Pressure" value={`${pressure} hPa`} />
        <StatCard icon={<WiFog />} label="Visibility" value={`${visibility} km`} />
        <StatCard icon={<WiSunrise />} label="Sunrise" value={sunrise} />
        <StatCard icon={<WiSunset />} label="Sunset" value={sunset} />
      </div>
    </div>
  );
};

export default CurrentWeather;
