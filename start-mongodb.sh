#!/bin/bash

# MongoDB startup script

echo "Checking MongoDB status..."

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB is not installed"
    echo "Please install MongoDB first:"
    echo "  brew tap mongodb/brew"
    echo "  brew install mongodb-community"
    exit 1
fi

# Check if already running
if lsof -i :27017 &> /dev/null; then
    echo "✅ MongoDB is already running"
    exit 0
fi

# Try to start with Homebrew
if command -v brew &> /dev/null; then
    echo "Starting MongoDB with Homebrew..."
    brew services start mongodb-community
    
    # Wait a few seconds for service to start
    sleep 3
    
    # Check if started successfully
    if lsof -i :27017 &> /dev/null; then
        echo "✅ MongoDB started successfully!"
        echo "Port: 27017"
    else
        echo "⚠️  Startup may have failed, please check manually:"
        echo "  brew services list | grep mongodb"
        echo "  Or try manual start: mongod"
    fi
else
    echo "⚠️  Homebrew not found, please start MongoDB manually:"
    echo "  mongod"
fi
