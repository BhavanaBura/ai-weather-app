// ============================================
// Weather Controller - Fetches Weather Data
// ============================================
// Uses OpenWeatherMap API to get real weather data

const axios = require('axios');
const User = require('../models/User');

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = process.env.OPENWEATHER_API_KEY;

// ---- GET CURRENT WEATHER ----
// GET /api/weather/current?city=Hyderabad
const getCurrentWeather = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    // Build the API URL - can search by city name OR coordinates
    let url;
    let resolvedCity = null; // Will hold the best city name when using coords

    if (lat && lon) {
      // Step 1: Use OWM Reverse Geocoding to get the CORRECT city name
      // This gives a much more accurate city name than the /weather endpoint alone.
      try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=3&appid=${API_KEY}`;
        const geoRes = await axios.get(geoUrl);
        if (geoRes.data && geoRes.data.length > 0) {
          // OWM returns local_names (language variants) — prefer English name
          const place = geoRes.data[0];
          resolvedCity = (place.local_names && place.local_names.en) || place.name;
          console.log(`📍 Reverse geocode: ${lat},${lon} → ${resolvedCity}`);
        }
      } catch (geoErr) {
        console.warn('Reverse geocode failed, falling back to direct coords:', geoErr.message);
      }

      // Step 2: Fetch weather. If we resolved a city name, use it (more accurate).
      if (resolvedCity) {
        url = `${OPENWEATHER_BASE_URL}/weather?q=${encodeURIComponent(resolvedCity)}&appid=${API_KEY}&units=metric`;
      } else {
        url = `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
      }
    } else if (city) {
      url = `${OPENWEATHER_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`;
    } else {
      return res.status(400).json({ message: 'Please provide a city name or coordinates' });
    }

    // Fetch weather data from OpenWeatherMap
    const response = await axios.get(url);
    const data = response.data;

    // Format the data in a clean structure for our frontend
    const weatherData = {
      city: data.name,
      country: data.sys.country,
      lat: data.coord.lat,
      lon: data.coord.lon,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: Math.round(data.visibility / 1000), // Convert meters to km
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      timestamp: new Date()
    };

    // Save to user's recent searches if logged in
    if (req.user) {
      await saveRecentSearch(req.user._id, weatherData.city, weatherData.country, weatherData.lat, weatherData.lon);
    }

    res.json({ success: true, data: weatherData });

  } catch (error) {
    console.error('Weather fetch error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'City not found. Please check the city name.' });
    }
    if (error.response?.status === 401) {
      return res.status(500).json({ message: 'Weather API key is invalid. Please check your .env file.' });
    }
    res.status(500).json({ message: 'Failed to fetch weather data' });
  }
};

// ---- GET 5-DAY FORECAST ----
// GET /api/weather/forecast?city=Hyderabad
const getForecast = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    let url;
    if (lat && lon) {
      // Use reverse geocoding for accurate city name (same fix as getCurrentWeather)
      let resolvedCity = null;
      try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=3&appid=${API_KEY}`;
        const geoRes = await axios.get(geoUrl);
        if (geoRes.data && geoRes.data.length > 0) {
          const place = geoRes.data[0];
          resolvedCity = (place.local_names && place.local_names.en) || place.name;
        }
      } catch (e) { /* ignore, use coords */ }
      url = resolvedCity
        ? `${OPENWEATHER_BASE_URL}/forecast?q=${encodeURIComponent(resolvedCity)}&appid=${API_KEY}&units=metric`
        : `${OPENWEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else if (city) {
      url = `${OPENWEATHER_BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    } else {
      return res.status(400).json({ message: 'Please provide a city name or coordinates' });
    }

    const response = await axios.get(url);
    const forecastList = response.data.list;

    // OpenWeatherMap returns forecast every 3 hours (40 entries for 5 days)
    // Group them by day for 5-day forecast cards
    const dailyForecasts = {};

    forecastList.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toDateString(); // e.g., "Mon May 13 2024"

      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date: date,
          dateString: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
          temps: [],
          conditions: [],
          icons: [],
          humidity: [],
          windSpeed: []
        };
      }

      dailyForecasts[dateKey].temps.push(item.main.temp);
      dailyForecasts[dateKey].conditions.push(item.weather[0].main);
      dailyForecasts[dateKey].icons.push(item.weather[0].icon);
      dailyForecasts[dateKey].humidity.push(item.main.humidity);
      dailyForecasts[dateKey].windSpeed.push(item.wind.speed);
    });

    // Calculate daily min/max and most common condition
    const formattedForecast = Object.values(dailyForecasts).slice(0, 5).map(day => ({
      date: day.dateString,
      maxTemp: Math.round(Math.max(...day.temps)),
      minTemp: Math.round(Math.min(...day.temps)),
      condition: getMostCommon(day.conditions), // Most frequent weather condition
      icon: day.icons[Math.floor(day.icons.length / 2)], // Middle of day icon
      iconUrl: `https://openweathermap.org/img/wn/${day.icons[Math.floor(day.icons.length / 2)]}@2x.png`,
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b, 0) / day.windSpeed.length * 10) / 10
    }));

    // Also send hourly data (next 8 entries = 24 hours)
    const hourlyForecast = forecastList.slice(0, 8).map(item => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: item.weather[0].icon,
      iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed
    }));

    res.json({
      success: true,
      city: response.data.city.name,
      country: response.data.city.country,
      data: { daily: formattedForecast, hourly: hourlyForecast }
    });

  } catch (error) {
    console.error('Forecast fetch error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ message: 'City not found.' });
    }
    res.status(500).json({ message: 'Failed to fetch forecast data' });
  }
};

// ---- HELPER: Get most common value in array ----
const getMostCommon = (arr) => {
  const counts = {};
  arr.forEach(item => { counts[item] = (counts[item] || 0) + 1; });
  return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
};

// ---- HELPER: Save recent search to user profile ----
const saveRecentSearch = async (userId, cityName, country, lat, lon) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // Always increment the lifetime total counter (never resets)
    user.totalSearchCount = (user.totalSearchCount || 0) + 1;

    // Remove duplicate if city already in recent searches list
    user.recentSearches = user.recentSearches.filter(s => s.cityName !== cityName);

    // Add new search at beginning of the list
    user.recentSearches.unshift({ cityName, country, lat, lon, searchedAt: new Date() });

    // Keep only last 10 entries in the recent list (but totalSearchCount keeps counting)
    user.recentSearches = user.recentSearches.slice(0, 10);

    await user.save();
  } catch (err) {
    console.error('Error saving recent search:', err);
  }
};

module.exports = { getCurrentWeather, getForecast };
