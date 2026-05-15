// ============================================
// AIInsights Component - AI Weather Assistant
// ============================================

import React from 'react';
import { useWeather } from '../context/WeatherContext';

const AIInsights = () => {
  const { aiInsights, aiLoading, currentWeather } = useWeather();

  if (!currentWeather) return null;

  // Loading skeleton while AI thinks
  if (aiLoading) {
    return (
      <div className="glass rounded-3xl p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 skeleton rounded-full" />
          <div className="h-6 w-48 skeleton rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-32 skeleton rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!aiInsights) return null;

  // Each insight card configuration
  const insightCards = [
    {
      emoji: '🌡️',
      title: 'Weather Summary',
      content: aiInsights.summary,
      gradient: 'from-blue-500/20 to-cyan-500/20',
      border: 'border-blue-400/30'
    },
    {
      emoji: '👗',
      title: 'Clothing Suggestions',
      content: aiInsights.clothing,
      gradient: 'from-purple-500/20 to-pink-500/20',
      border: 'border-purple-400/30'
    },
    {
      emoji: '🥤',
      title: 'Food & Drink Tips',
      content: aiInsights.foodDrink,
      gradient: 'from-orange-500/20 to-yellow-500/20',
      border: 'border-orange-400/30'
    },
    {
      emoji: '🛡️',
      title: 'Safety Tips',
      content: aiInsights.safety,
      gradient: 'from-red-500/20 to-orange-500/20',
      border: 'border-red-400/30'
    },
    {
      emoji: '🏃',
      title: 'Activity Recommendations',
      content: aiInsights.activities,
      gradient: 'from-green-500/20 to-teal-500/20',
      border: 'border-green-400/30'
    }
  ];

  return (
    <div className="glass rounded-3xl p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-xl">
          🤖
        </div>
        <div>
          <h3 className="text-white font-bold text-xl">AI Weather Assistant</h3>
          <p className="text-white/50 text-sm">
            Smart insights for {currentWeather.city} • {currentWeather.temperature}°C
          </p>
        </div>
        <div className="ml-auto">
          <span className="bg-green-500/20 text-green-300 text-xs px-3 py-1 rounded-full border border-green-500/30">
            ✨ AI Powered
          </span>
        </div>
      </div>

      {/* Insight Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insightCards.map((card, index) => (
          card.content && (
            <div
              key={index}
              className={`bg-gradient-to-br ${card.gradient} border ${card.border} rounded-2xl p-4 animate-slide-up hover:scale-[1.02] transition-transform`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{card.emoji}</span>
                <h4 className="text-white font-semibold text-sm">{card.title}</h4>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">{card.content}</p>
            </div>
          )
        ))}
      </div>

      {/* Footer Note */}
      <p className="text-white/30 text-xs mt-4 text-center">
        AI insights are generated based on current weather conditions and may vary.
      </p>
    </div>
  );
};

export default AIInsights;
