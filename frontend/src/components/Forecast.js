// ============================================
// Forecast Component - 5-Day & Hourly Forecast
// ============================================

import React, { useState } from 'react';
import { WiHumidity, WiStrongWind } from 'react-icons/wi';
import { useWeather } from '../context/WeatherContext';

const Forecast = () => {
  const { forecast } = useWeather();
  const [activeTab, setActiveTab] = useState('daily'); // 'daily' or 'hourly'

  if (!forecast) return null;

  const { daily, hourly } = forecast;

  return (
    <div className="animate-fade-in">
      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('daily')}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
            activeTab === 'daily'
              ? 'bg-white text-blue-900 shadow-lg'
              : 'glass text-white hover:bg-white/20'
          }`}
        >
          5-Day Forecast
        </button>
        <button
          onClick={() => setActiveTab('hourly')}
          className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
            activeTab === 'hourly'
              ? 'bg-white text-blue-900 shadow-lg'
              : 'glass text-white hover:bg-white/20'
          }`}
        >
          Hourly (24h)
        </button>
      </div>

      {/* 5-Day Forecast Cards */}
      {activeTab === 'daily' && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {daily.map((day, index) => (
            <div key={index}
              className="glass rounded-2xl p-4 text-white text-center hover:bg-white/20 transition-all animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}>

              {/* Date */}
              <p className="text-white/60 text-sm font-medium mb-2">{day.date}</p>

              {/* Weather Icon */}
              <img src={day.iconUrl} alt={day.condition} className="w-14 h-14 mx-auto" />

              {/* Condition */}
              <p className="text-white/80 text-sm capitalize mb-2">{day.condition}</p>

              {/* Temp Range */}
              <div className="flex justify-center gap-2">
                <span className="text-white font-bold text-lg">{day.maxTemp}°</span>
                <span className="text-white/50 font-medium text-lg">{day.minTemp}°</span>
              </div>

              {/* Additional Details */}
              <div className="mt-3 pt-3 border-t border-white/10 flex justify-around text-xs">
                <div className="flex items-center gap-1 text-blue-200">
                  <WiHumidity className="text-base" />
                  <span>{day.humidity}%</span>
                </div>
                <div className="flex items-center gap-1 text-blue-200">
                  <WiStrongWind className="text-base" />
                  <span>{day.windSpeed}m/s</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Hourly Forecast */}
      {activeTab === 'hourly' && (
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-3 min-w-max">
            {hourly.map((hour, index) => (
              <div key={index}
                className="glass rounded-2xl p-4 text-white text-center min-w-[100px] hover:bg-white/20 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}>

                <p className="text-white/60 text-xs font-medium mb-2">{hour.time}</p>
                <img src={hour.iconUrl} alt={hour.condition} className="w-12 h-12 mx-auto" />
                <p className="text-white font-bold text-xl mt-1">{hour.temp}°</p>
                <p className="text-white/50 text-xs capitalize mt-1">{hour.condition}</p>

                <div className="mt-2 pt-2 border-t border-white/10 text-xs text-blue-200">
                  <div className="flex items-center justify-center gap-1">
                    <WiHumidity className="text-sm" />
                    <span>{hour.humidity}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Forecast;
