// ============================================
// AI Controller - Generates Weather Insights
// ============================================
// Uses Hugging Face API for AI-powered weather tips
// Includes food, clothing, safety, and activity recommendations

const axios = require('axios');

const HF_API_URL = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';

// ---- GENERATE AI WEATHER INSIGHTS ----
// POST /api/ai/insights
const getWeatherInsights = async (req, res) => {
  try {
    const { weatherData } = req.body;

    if (!weatherData) {
      return res.status(400).json({ message: 'Weather data is required' });
    }

    const { city, temperature, humidity, condition, windSpeed, description } = weatherData;

    // Build a detailed prompt for the AI
    const prompt = `<s>[INST] You are a friendly weather assistant. Based on the weather data below, give practical advice in exactly these 5 sections. Be specific, friendly, and helpful. Keep each section to 2-3 sentences max.

Weather Data:
- Location: ${city}
- Temperature: ${temperature}°C
- Condition: ${condition} (${description})
- Humidity: ${humidity}%
- Wind Speed: ${windSpeed} m/s

Provide advice in this exact format:

🌡️ WEATHER SUMMARY:
[Brief description of today's weather and how it feels]

👗 CLOTHING SUGGESTIONS:
[Specific clothing items to wear based on temperature and conditions]

🥤 FOOD & DRINK TIPS:
[What to eat and drink today - specific to the weather. Hot weather: water, fresh juices, light salads, cooling foods. Cold weather: hot soups, teas, warm meals. Rainy: comfort foods, hot drinks. Be specific about quantities like "drink 8-10 glasses of water"]

🛡️ SAFETY TIPS:
[Important safety warnings for current conditions - UV protection, storm warnings, ice, etc.]

🏃 ACTIVITY RECOMMENDATIONS:
[What outdoor/indoor activities are good or bad for today's weather]

Keep the tone friendly and conversational. [/INST]`;

    let insights;

    try {
      // Try Hugging Face API first
      const hfResponse = await axios.post(
        HF_API_URL,
        { inputs: prompt, parameters: { max_new_tokens: 600, temperature: 0.7, return_full_text: false } },
        {
          headers: {
            'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 // 30 second timeout
        }
      );

      const rawText = hfResponse.data[0]?.generated_text || '';
      insights = parseAIResponse(rawText, weatherData);

    } catch (hfError) {
      console.log('Hugging Face API unavailable, using smart fallback:', hfError.message);
      // Use our intelligent rule-based fallback
      insights = generateSmartInsights(weatherData);
    }

    res.json({ success: true, insights });

  } catch (error) {
    console.error('AI insights error:', error);
    // Always return something useful even if everything fails
    res.json({
      success: true,
      insights: generateSmartInsights(req.body.weatherData)
    });
  }
};

// ---- PARSE AI RESPONSE ----
// Extract sections from the AI's response text
const parseAIResponse = (text, weatherData) => {
  if (!text || text.length < 50) {
    return generateSmartInsights(weatherData);
  }

  const sections = {
    summary: extractSection(text, 'WEATHER SUMMARY') || extractSection(text, 'Summary'),
    clothing: extractSection(text, 'CLOTHING') || extractSection(text, 'Clothing'),
    foodDrink: extractSection(text, 'FOOD & DRINK') || extractSection(text, 'Food'),
    safety: extractSection(text, 'SAFETY') || extractSection(text, 'Safety'),
    activities: extractSection(text, 'ACTIVITY') || extractSection(text, 'Activities')
  };

  // If parsing fails, fall back to smart insights
  if (!sections.summary && !sections.clothing) {
    return generateSmartInsights(weatherData);
  }

  return sections;
};

const extractSection = (text, keyword) => {
  const regex = new RegExp(`${keyword}[:\\s]*([^🌡️👗🥤🛡️🏃]*?)(?=🌡️|👗|🥤|🛡️|🏃|$)`, 'is');
  const match = text.match(regex);
  return match ? match[1].trim().replace(/^\[|\]$/g, '') : null;
};

// ---- SMART FALLBACK INSIGHTS ----
// Rule-based insights when AI API is unavailable
// Covers detailed food, drink, clothing, and safety advice
const generateSmartInsights = (weatherData) => {
  const { city, temperature, humidity, condition, windSpeed } = weatherData;
  const temp = parseFloat(temperature);
  const cond = condition?.toLowerCase() || '';
  const isRain = cond.includes('rain') || cond.includes('drizzle');
  const isSnow = cond.includes('snow');
  const isStormy = cond.includes('storm') || cond.includes('thunder');
  const isClear = cond.includes('clear') || cond.includes('sunny');
  const isCloudy = cond.includes('cloud');
  const isWindy = parseFloat(windSpeed) > 10;

  let summary, clothing, foodDrink, safety, activities;

  // ---- WEATHER SUMMARY ----
  if (temp >= 35) {
    summary = `It's extremely hot in ${city} today at ${temperature}°C! This kind of heat can be dangerous, especially for children, elderly people, and those with health conditions. Try to stay in cool, shaded areas as much as possible.`;
  } else if (temp >= 28) {
    summary = `${city} is experiencing warm, ${cond} weather at ${temperature}°C today. The humidity of ${humidity}% makes it feel ${humidity > 70 ? 'much hotter and more uncomfortable' : 'warm but manageable'}. A typical hot day for the season.`;
  } else if (temp >= 20) {
    summary = `Pleasant weather in ${city} today! At ${temperature}°C with ${cond} conditions, it's a comfortable day. ${isClear ? 'Great sunshine to enjoy the outdoors.' : 'A mild and enjoyable day overall.'}`;
  } else if (temp >= 10) {
    summary = `Cool weather today in ${city} at ${temperature}°C. ${isRain ? 'Rain adds to the chill, so dress warm and stay dry.' : 'A crisp, cool day — perfect for light outdoor activities with proper clothing.'}`;
  } else {
    summary = `It's cold in ${city} today at ${temperature}°C! ${isSnow ? 'Snowfall makes conditions slippery and visibility poor.' : 'Bundle up well before heading outside.'} Minimize outdoor exposure during the coldest parts of the day.`;
  }

  // ---- CLOTHING SUGGESTIONS ----
  if (temp >= 35) {
    clothing = `Wear very light, loose-fitting cotton or linen clothes in light colors (white, pastels) to reflect heat. A wide-brimmed hat is essential for sun protection. Wear UV-protection sunglasses and open sandals or breathable shoes. Avoid dark colors, synthetic fabrics, and tight clothing that traps heat.`;
  } else if (temp >= 28) {
    clothing = `Light cotton t-shirts, linen shirts, or breathable summer clothes are ideal. Light shorts or cotton pants work well. ${isRain ? 'Keep a light raincoat or compact umbrella handy.' : 'Sunglasses and a cap will help with sun exposure.'} Avoid heavy fabrics that don't breathe well.`;
  } else if (temp >= 20) {
    clothing = `A light jacket or sweater over a t-shirt is perfect for this temperature. ${isRain ? 'Carry a waterproof jacket or umbrella — showers are likely.' : 'Comfortable jeans or light pants work great.'} Layers are ideal since temperatures may vary throughout the day.`;
  } else if (temp >= 10) {
    clothing = `Wear warm layers: a thermal or long-sleeve base layer, a warm sweater or fleece, and a jacket on top. ${isRain ? 'A waterproof outer layer is important today.' : ''} Closed-toe shoes and light gloves may be helpful in the evening. Avoid thin or single-layer clothing.`;
  } else {
    clothing = `Bundle up with heavy winter layers: thermal underwear, a thick sweater or fleece, and a heavy insulated coat. ${isSnow ? 'Waterproof boots are essential for snow and slush.' : 'Warm boots will protect your feet from the cold.'} Don't forget a warm hat, scarf, and gloves — exposed skin loses heat rapidly in this temperature.`;
  }

  // ---- FOOD & DRINK TIPS ----
  if (temp >= 35) {
    foodDrink = `🚰 Drink at least 10-12 glasses (3+ liters) of water today — dehydration happens fast in extreme heat! Great drinks: fresh lime water, coconut water, sugarcane juice, watermelon juice, and chilled buttermilk. Eat light, cooling foods like salads, cucumbers, yogurt, and fruits (watermelon, mango, citrus). Avoid heavy meals, fried food, alcohol, and excessive caffeine as they all increase dehydration. Eat smaller meals more frequently.`;
  } else if (temp >= 28) {
    foodDrink = `💧 Aim for 8-10 glasses of water throughout the day. Fresh fruit juices (orange, mango, pineapple), nimbu pani (lemon water with salt), and cold coconut water are excellent choices. Light meals like salads, grilled food, and fresh fruits keep energy up without making you feel heavy. Limit spicy and oily food as they make you feel hotter. Yogurt and lassi are great cooling foods.`;
  } else if (temp >= 20) {
    foodDrink = `Regular hydration is key — aim for 6-8 glasses of water. This comfortable temperature is perfect for enjoying both warm and cold beverages. A warm cup of tea or coffee in the morning followed by fresh juices later works well. You can enjoy a balanced diet with regular meals. Fresh salads, soups, and light snacks all work great today.`;
  } else if (temp >= 10) {
    foodDrink = `🍵 Warm drinks will keep you comfortable — hot tea, ginger tea, hot chocolate, or warm lemon honey water are wonderful choices. Enjoy hearty, warming meals like soups, stews, dal, and rice dishes. Drink at least 6-8 glasses of water (you still need hydration even when it's cold, as we often forget). Warm oatmeal or porridge for breakfast is excellent. Avoid ice-cold drinks and ice cream.`;
  } else {
    foodDrink = `☕ Hot drinks are essential — start your day with hot ginger tea, turmeric milk, or hot chocolate. Eat warming, nourishing foods: thick vegetable soups, lentil soups, hot porridge, and warm whole-grain bread. ${isSnow ? 'High-energy foods like nuts, seeds, and hearty stews help maintain body heat in snowy conditions.' : ''} Drink warm water throughout the day (aim for 6-8 glasses). Foods rich in Vitamin C (citrus fruits, amla) help boost immunity in cold weather.`;
  }

  // ---- SAFETY TIPS ----
  if (isStormy) {
    safety = `⚡ STORM ALERT: Stay indoors and away from windows during thunder and lightning. Avoid using electrical appliances. Do NOT stand under trees or hold metal objects outside. If driving, pull over safely and wait for the storm to pass. Avoid flood-prone areas and waterlogged roads.`;
  } else if (isSnow) {
    safety = `❄️ Snow Safety: Roads and footpaths will be slippery — walk carefully and wear non-slip boots. Drive slowly and increase following distance significantly. Keep an emergency kit in your car. Watch for signs of frostbite (numbness, pale skin) and hypothermia. Avoid unnecessary travel if snowfall is heavy.`;
  } else if (isRain) {
    safety = `🌧️ Carry a waterproof umbrella or raincoat. Watch for waterlogged roads and slippery surfaces. Avoid walking through flooded areas as depth can be deceptive. Keep electronics dry and protected. If lightning accompanies rain, stay indoors. Be cautious of falling branches in strong winds.`;
  } else if (temp >= 35) {
    safety = `🌡️ HEAT ALERT: Risk of heat exhaustion and heat stroke is HIGH today! Avoid outdoor activities between 11am-4pm. Never leave children or pets in a parked car. Watch for heat stroke signs: no sweating despite heat, confusion, rapid heartbeat. Seek shade frequently and use cooling towels if available. Apply SPF 50+ sunscreen every 2 hours outdoors.`;
  } else if (temp >= 28) {
    safety = `☀️ UV levels are high — apply SPF 30+ sunscreen 20 minutes before going outside. Reapply every 2 hours. Take breaks in shade during peak sun hours (11am-3pm). Watch for signs of mild heat exhaustion (heavy sweating, weakness, dizziness). Keep cooling water nearby for outdoor activities.`;
  } else if (temp <= 5) {
    safety = `🧊 Frostbite risk at this temperature! Cover all exposed skin. Check on elderly neighbors and vulnerable people nearby. Avoid icy patches when walking. Keep emergency supplies at home in case of power outages. Layer up before going outside — once you're cold, it takes a long time to warm up again.`;
  } else {
    safety = `${isWindy ? '💨 Strong winds today — secure loose outdoor items like patio furniture and decorations. Be cautious while driving, especially on open roads and bridges.' : 'Standard safety precautions apply for today.'} Stay weather-aware and check updates if conditions change throughout the day.`;
  }

  // ---- ACTIVITY RECOMMENDATIONS ----
  if (isStormy) {
    activities = `🏠 Indoor day! Perfect for reading, indoor workouts, board games, cooking, or learning something new online. Postpone outdoor plans, sports, and cycling. Great time for home projects, watching movies, or catching up with family. Avoid swimming and water sports until the storm passes completely.`;
  } else if (isRain && !isStormy) {
    activities = `☔ Light rain is fine for a quick walk with an umbrella, but avoid cycling or running in heavy rain. Museums, malls, cafes, and indoor sports are great options today. If you love the rain, a short gentle walk can be refreshing! Avoid hiking on muddy trails and water sports.`;
  } else if (temp >= 35) {
    activities = `🏊 If exercising, do it early morning (before 8am) or evening (after 6pm) to avoid peak heat. Swimming is the best outdoor activity today. Indoor gym, yoga, or home workouts are ideal. Outdoor sports and strenuous activities during midday are dangerous. Even a short outdoor walk should be in the shade with plenty of water.`;
  } else if (temp >= 22 && isClear) {
    activities = `🏃 Perfect weather for outdoor activities! Great for running, cycling, hiking, picnics, and team sports. Apply sunscreen for extended outdoor time. Morning or late afternoon activities are best. This is excellent weather for sightseeing, outdoor dining, and photography. Enjoy it — days like this are ideal!`;
  } else if (temp >= 10 && temp < 22) {
    activities = `🚶 Cool and comfortable for brisk walking, jogging, cycling, and outdoor sports. Great for hiking as the cooler air is refreshing. Dress in light layers so you can adjust as you warm up. Outdoor cafes and markets are enjoyable in this weather. A perfect day for being outside without overheating.`;
  } else {
    activities = `🏋️ Cold weather is great for indoor activities — gym sessions, yoga, indoor swimming, or home workouts keep you warm and active. If you enjoy cold weather, a brisk walk or light jog (properly dressed) is invigorating. Avoid long outdoor exposure. Cozy indoor time with hot drinks and good company sounds perfect for today!`;
  }

  return { summary, clothing, foodDrink, safety, activities };
};

module.exports = { getWeatherInsights };
