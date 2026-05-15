# 🌤️ AI Weather Forecast Dashboard

> A beautiful, beginner-friendly full-stack weather app with AI-powered insights — perfect for your portfolio!

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node.js-18-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green) ![AI](https://img.shields.io/badge/AI-Hugging%20Face-yellow)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Register/Login with JWT tokens |
| 🌡️ **Live Weather** | Real-time data from OpenWeatherMap |
| 📅 **5-Day Forecast** | Daily & hourly forecast cards |
| 🤖 **AI Insights** | Smart tips powered by Hugging Face AI |
| 👗 **Clothing Tips** | What to wear based on weather |
| 🥤 **Food & Drink** | Hydration & meal suggestions |
| 🛡️ **Safety Alerts** | Heat, storm, cold weather warnings |
| 🏃 **Activities** | What to do (or avoid) today |
| ⭐ **Favorites** | Save up to 10 favorite cities |
| 🕐 **Search History** | Last 10 searched cities |
| 📍 **Geolocation** | Auto-detect your location |

---

## 🗂️ Project Structure

```
ai-weather-app/
├── backend/
│   ├── controllers/
│   │   ├── authController.js      ← Login/Register logic
│   │   ├── weatherController.js   ← Fetch weather from API
│   │   ├── aiController.js        ← AI insights generation
│   │   └── favoritesController.js ← Save/delete favorites
│   ├── middleware/
│   │   └── auth.js               ← JWT verification
│   ├── models/
│   │   └── User.js               ← MongoDB user schema
│   ├── routes/
│   │   ├── auth.js               ← /api/auth routes
│   │   ├── weather.js            ← /api/weather routes
│   │   ├── ai.js                 ← /api/ai routes
│   │   └── favorites.js          ← /api/favorites routes
│   ├── .env.example              ← Environment variables template
│   ├── package.json
│   └── server.js                 ← Main entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js          ← Top navigation bar
    │   │   ├── SearchBar.js       ← City search input
    │   │   ├── CurrentWeather.js  ← Main weather card
    │   │   ├── Forecast.js        ← 5-day & hourly forecast
    │   │   ├── AIInsights.js      ← AI recommendations
    │   │   ├── AuthModal.js       ← Login/Register popup
    │   │   └── LoadingSpinner.js  ← Loading animation
    │   ├── context/
    │   │   ├── AuthContext.js     ← Global auth state
    │   │   └── WeatherContext.js  ← Global weather state
    │   ├── pages/
    │   │   └── Dashboard.js       ← Main dashboard page
    │   ├── utils/
    │   │   └── api.js             ← API helper functions
    │   ├── App.js                 ← Root component
    │   └── index.js               ← App entry point
    └── package.json
```

---

## 🚀 Quick Start (Local Setup)

### Step 1: Get API Keys (FREE)

#### OpenWeatherMap API Key
1. Go to [openweathermap.org](https://openweathermap.org/api)
2. Click **Sign Up** and create a free account
3. Go to **API Keys** section in your dashboard
4. Copy your default API key (or create a new one)
5. ⚠️ New keys take up to 2 hours to activate!

#### Hugging Face API Key
1. Go to [huggingface.co](https://huggingface.co)
2. Sign up for a free account
3. Go to **Settings → Access Tokens**
4. Click **New Token** → Give it a name → Select "Read" role
5. Copy the token (starts with `hf_...`)

#### MongoDB Atlas (Free Database)
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free account
3. Create a **Free Cluster** (M0 Sandbox)
4. Under **Database Access**: Add a user with password
5. Under **Network Access**: Add IP `0.0.0.0/0` (allow all)
6. Under **Databases**: Click **Connect** → **Connect your application**
7. Copy the connection string (looks like: `mongodb+srv://...`)

---

### Step 2: Setup Backend

```bash
# Navigate to backend folder
cd ai-weather-app/backend

# Install dependencies
npm install

# Create your .env file (copy from example)
cp .env.example .env
```

Now open `.env` in any text editor and fill in your values:

```env
MONGODB_URI=mongodb+srv://YourUsername:YourPassword@cluster0.xxxxx.mongodb.net/weatherapp
JWT_SECRET=any_long_random_string_like_this_xK9mN2pQ7rT4wY8z
JWT_EXPIRE=7d
OPENWEATHER_API_KEY=paste_your_openweathermap_key_here
HUGGINGFACE_API_KEY=hf_paste_your_huggingface_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

```bash
# Start the backend server
npm run dev

# You should see:
# ✅ Connected to MongoDB Atlas successfully!
# 🚀 Server running on port 5000
```

---

### Step 3: Setup Frontend

Open a **new terminal window**:

```bash
# Navigate to frontend folder
cd ai-weather-app/frontend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Your frontend `.env` should look like:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_NAME=AI Weather Dashboard
```

```bash
# Start the frontend
npm start

# Browser will open at http://localhost:3000
```

---

## 🎮 How to Use

1. **Search a city** — Type any city name and press Search (or Enter)
2. **Use your location** — Click the 📍 pin icon to auto-detect
3. **View weather** — See temperature, humidity, wind, pressure, visibility
4. **Check forecast** — Switch between 5-day and hourly tabs
5. **Read AI insights** — Scroll down for clothing, food, safety & activity tips
6. **Register/Login** — Click "Login / Register" to create an account
7. **Save favorites** — Click ⭐ star on any weather card to save the city
---

## 🔌 API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login and get token |
| GET | `/api/auth/me` | Get current user profile |

### Weather
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/weather/current?city=Mumbai` | Current weather |
| GET | `/api/weather/current?lat=17.4&lon=78.5` | Weather by GPS |
| GET | `/api/weather/forecast?city=Delhi` | 5-day forecast |

### AI Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/insights` | Get AI weather advice |

### Favorites (requires login)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | Get saved cities |
| POST | `/api/favorites` | Add a favorite city |
| DELETE | `/api/favorites/:cityName` | Remove a city |

---

## 🌐 Deployment Guide

### Deploy Backend to Render (Free)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) and sign up
3. Click **New → Web Service**
4. Connect your GitHub repository
5. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
6. Under **Environment Variables**, add all your `.env` variables
7. Change `FRONTEND_URL` to your Vercel URL (add after step below)
8. Click **Create Web Service**

### Deploy Frontend to Vercel (Free)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click **New Project** → Import your repository
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add environment variable:
   - `REACT_APP_API_URL` = your Render backend URL (e.g., `https://ai-weather-backend.onrender.com`)
5. Click **Deploy**

### MongoDB Atlas (Already set up above)
- Your Atlas database works for production too!
- Just make sure **Network Access** allows `0.0.0.0/0`

---

## 🛠️ Troubleshooting

**"City not found" error**
→ Check the city spelling. Try adding country code: `Mumbai,IN`

**"Weather API key is invalid"**
→ Check your `.env` file. New OpenWeatherMap keys take up to 2 hours.

**MongoDB connection failed**
→ Check your connection string in `.env`. Make sure IP whitelist is set to `0.0.0.0/0` in Atlas.

**AI insights not loading**
→ Hugging Face free models can be slow or unavailable. The app automatically falls back to smart built-in advice.

**CORS error in browser**
→ Make sure `FRONTEND_URL` in your backend `.env` matches exactly where your frontend runs.

---

## 📸 Screenshots Section

> Add your screenshots here after running the app!

```
screenshots/
├── home-screen.png
├── weather-result.png
├── ai-insights.png
├── dark-mode.png
└── mobile-view.png
```

---

## 🧰 Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React.js 18 | UI framework |
| Styling | Tailwind CSS | Utility-first CSS |
| HTTP Client | Axios | API calls |
| Icons | React Icons | Weather & UI icons |
| Backend | Node.js + Express | REST API server |
| Database | MongoDB Atlas | User data storage |
| Auth | JWT (jsonwebtoken) | Secure authentication |
| Password | bcryptjs | Password hashing |
| Weather API | OpenWeatherMap | Real weather data |
| AI API | Hugging Face | AI text generation |

---

## 👨‍💻 Built for Beginners

This project is designed to be:
- ✅ Clean, readable code with comments everywhere
- ✅ Simple folder structure — easy to navigate
- ✅ Understandable variable names
- ✅ Each feature is in its own file
- ✅ Free APIs and hosting options
- ✅ Portfolio-ready UI design
- ✅ Full-stack experience (perfect for resume!)

---

## 📝 License

MIT License — Free to use for learning and portfolio projects!

---

*Built with ❤️ for beginner developers learning full-stack development*
