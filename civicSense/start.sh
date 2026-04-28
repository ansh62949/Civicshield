#!/bin/bash
# Quick start script for CivicSense

echo "🛡️ CivicSense - Installing & Starting..."
echo ""

# Navigate to project directory
cd "$(dirname "$0")" || exit

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    
    echo "📦 Installing globe dependencies..."
    npm install react-globe.gl three
else
    echo "✓ Dependencies already installed"
fi

echo ""
echo "🚀 Starting development server..."
npm run dev
