#!/bin/bash
# ============================================
# AI Weather Dashboard - Quick Setup Script
# ============================================
# Run this script to set up the project quickly!
# Usage: chmod +x setup.sh && ./setup.sh

echo "🌤️  AI Weather Dashboard Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "   Please install Node.js from: https://nodejs.org"
    echo "   (Download the LTS version)"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js found: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please reinstall Node.js"
    exit 1
fi

echo "✅ npm found: $(npm -v)"
echo ""

# Setup Backend
echo "📦 Installing backend dependencies..."
cd backend
npm install
echo "✅ Backend dependencies installed!"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo ""
    echo "📝 Created backend/.env file from template"
    echo "   ⚠️  IMPORTANT: Open backend/.env and fill in your API keys!"
else
    echo "ℹ️  backend/.env already exists (skipping)"
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
echo "✅ Frontend dependencies installed!"

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "📝 Created frontend/.env file from template"
else
    echo "ℹ️  frontend/.env already exists (skipping)"
fi

cd ..

echo ""
echo "🎉 Setup Complete!"
echo "================================"
echo ""
echo "📋 NEXT STEPS:"
echo ""
echo "1. Get your FREE API keys:"
echo "   • OpenWeatherMap: https://openweathermap.org/api"
echo "   • Hugging Face:   https://huggingface.co/settings/tokens"
echo "   • MongoDB Atlas:  https://cloud.mongodb.com"
echo ""
echo "2. Fill in your API keys:"
echo "   • Edit: backend/.env"
echo "   • Edit: frontend/.env (just update REACT_APP_API_URL if needed)"
echo ""
echo "3. Start the backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start the frontend (Terminal 2):"
echo "   cd frontend && npm start"
echo ""
echo "5. Open your browser at: http://localhost:3000"
echo ""
echo "📖 Read README.md for detailed setup instructions"
echo ""
