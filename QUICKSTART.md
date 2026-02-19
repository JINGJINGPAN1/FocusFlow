# Quick Start Guide

## Initial Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up MongoDB (Local MongoDB)**

   ✅ `.env` file is created and configured for local MongoDB

   If MongoDB is not installed yet, install it first:

   **macOS (using Homebrew)**:

   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   ```

   See detailed guide: `docs/mongodb-local-setup.md`

   **Start MongoDB** (if not already running):

   ```bash
   # Using Homebrew
   brew services start mongodb-community

   # Or run directly
   mongod
   ```

   **Verify MongoDB is running**:

   ```bash
   mongosh
   # If connection succeeds, type exit to quit
   ```

   Option B: MongoDB Atlas (Cloud)
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a cluster and get connection string
   - Create `.env` file:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
     DB_NAME=focusflow
     PORT=3000
     ```

3. **Start the server**

   ```bash
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## Using the Application

### Creating Tasks

1. Click the "+ Add Task" button
2. Enter task description in the modal
3. Click "Add Task"

### Starting a Focus Session

1. Find a task in the list
2. Click the play button (▶) next to the task
3. Set duration in minutes
4. Click "Start Session"
5. Timer will count down
6. Use pause/stop buttons as needed

### Viewing Statistics

1. Click the "Stats" tab
2. View your productivity metrics
3. See recent focus sessions

## Development Commands

```bash
# Run server
npm start

# Run with auto-reload (Node 18+)
npm run dev

# Run linter
npm run lint

# Format code
npm run format
```

## Troubleshooting

### MongoDB Connection Error (EPERM)

**Problem**: `Failed to connect to MongoDB: connect EPERM`

**Solutions**:

1. **Start MongoDB service**:

   ```bash
   # Method 1: Use the provided script
   ./start-mongodb.sh

   # Method 2: Using Homebrew
   brew services start mongodb-community

   # Method 3: Manual start
   mongod
   ```

2. **Verify MongoDB is running**:

   ```bash
   # Check service status
   brew services list | grep mongodb

   # Check port
   lsof -i :27017

   # Try to connect
   mongosh
   ```

3. **If still failing**:
   - Check MONGODB_URI in `.env` (should be `mongodb://localhost:27017`)
   - Check firewall settings
   - View MongoDB logs: `tail -f /usr/local/var/log/mongodb/mongo.log`

**Port Already in Use**

- Change PORT in `.env` file
- Or stop other process using port 3000

**Module Not Found Errors**

- Run `npm install` again
- Ensure Node.js version is 18+
