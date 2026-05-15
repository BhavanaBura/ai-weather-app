// Loading Spinner Component
import React from 'react';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
    {/* Animated weather icon stack */}
    <div className="relative w-20 h-20 mb-6">
      <div className="absolute inset-0 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      <div className="absolute inset-3 rounded-full border-4 border-white/10 border-t-blue-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      <div className="absolute inset-0 flex items-center justify-center text-3xl">🌤️</div>
    </div>
    <p className="text-white font-semibold text-lg">Fetching Weather...</p>
    <p className="text-white/50 text-sm mt-1">Getting latest data for you</p>
  </div>
);

export default LoadingSpinner;
