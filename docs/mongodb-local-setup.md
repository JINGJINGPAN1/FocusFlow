# Local MongoDB Setup Guide

## Install MongoDB on macOS

### Method 1: Using Homebrew (Recommended)

```bash
# Install Homebrew (if not already installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Or start manually (foreground)
mongod --config /usr/local/etc/mongod.conf
```

### Method 2: Using MongoDB Official Installer

1. Visit https://www.mongodb.com/try/download/community
2. Select macOS version
3. Download and install the .tgz file
4. Follow the installation wizard

## Verify MongoDB is Running

```bash
# Check MongoDB service status
brew services list | grep mongodb

# Or try to connect
mongosh
# On success, you will see the MongoDB shell
```

## Start MongoDB

If MongoDB is not running:

```bash
# Using Homebrew
brew services start mongodb-community

# Or run directly
mongod
```

## Configure Project to Use Local MongoDB

1. **Ensure .env file exists** (already created in project root)

   ```
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=focusflow
   PORT=3000
   ```

2. **Start MongoDB** (if not already running)

   ```bash
   brew services start mongodb-community
   ```

3. **Start the app**
   ```bash
   cd focusflow-app
   npm install
   npm start
   ```

## Common Issues

### MongoDB Connection Failed

**Error**: `Failed to connect to MongoDB`

**Solutions**:

1. Check if MongoDB is running:
   ```bash
   brew services list | grep mongodb
   ```
2. If not running, start it:
   ```bash
   brew services start mongodb-community
   ```
3. Check if port 27017 is in use:
   ```bash
   lsof -i :27017
   ```

### Permission Errors

If you encounter permission issues:

```bash
# Ensure data directory has correct permissions
sudo chown -R $(whoami) /usr/local/var/mongodb
sudo chown -R $(whoami) /usr/local/var/log/mongodb
```

### View MongoDB Logs

```bash
# View log file
tail -f /usr/local/var/log/mongodb/mongo.log
```

## Using MongoDB Shell to View Data

```bash
# Connect to MongoDB
mongosh

# Switch to focusflow database
use focusflow

# List all collections
show collections

# View tasks collection data
db.tasks.find().pretty()

# View sessions collection data
db.sessions.find().pretty()

# Exit
exit
```

## Reset Database (if needed)

```bash
# Connect to MongoDB
mongosh

# Switch to focusflow database
use focusflow

# Drop all collections
db.tasks.drop()
db.sessions.drop()

# Exit
exit
```
