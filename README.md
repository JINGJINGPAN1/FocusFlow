# FocusFlow - Task & Focus Management Application

## Author

[Your Name]

## Class Link

[Your Class Link]

## Project Objective

FocusFlow is a productivity application that helps users manage their tasks and maintain focus through timed work sessions. The application combines task management with a Pomodoro-style focus timer to help users stay productive and track their work habits.

### Key Features

- **Task Management**: Create, update, delete, and organize tasks
- **Focus Sessions**: Start timed focus sessions for specific tasks
- **Statistics**: Track productivity metrics including sessions completed, total minutes focused, and Pomodoros
- **Modern UI**: Clean, responsive interface built with vanilla JavaScript

## Screenshot

![FocusFlow Application Screenshot](docs/screenshot.png)

## Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (native driver, no Mongoose)
- **Frontend**: HTML5 + Vanilla JavaScript (client-side rendering)
- **Styling**: CSS Modules
- **Module System**: ES Modules (ESM)

## Instructions to Build

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation Steps

1. **Clone or navigate to the project directory**
   ```bash
   cd focusflow-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   DB_NAME=focusflow
   PORT=3000
   ```
   
   For MongoDB Atlas, use:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
   DB_NAME=focusflow
   PORT=3000
   ```

4. **Start MongoDB**
   
   If using local MongoDB:
   ```bash
   mongod
   ```
   
   Or ensure your MongoDB Atlas cluster is running.

5. **Start the application**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

6. **Access the application**
   
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## How to Use

### Tasks Page
- **Add a task**: Click "+ Add Task" or the "+" next to a time period (Anytime, Morning, Afternoon, Evening). Fill in the description, date, duration, and time of day, then click "Add Task".
- **Complete a task**: Check the checkbox next to a task to mark it done.
- **Edit a task**: Click the pencil (✎) icon on a task card.
- **Delete a task**: Click the trash (🗑) icon and confirm.
- **Start focus from a task**: Click the play (▶) button on a task to start a focus session with that task's duration.
- **Filter tasks**: Use "All", "Active", or "Completed" to filter the list.
- **Change date**: Use the date picker in the header to view tasks for different days.

### Focus Page
- **Start a session**: Choose a duration (15, 25, 45, or 60 min) or enter a custom value (1–120 min), then click "Start".
- **During a session**: Click the play (▶) button to start the timer and white noise. Click again to pause.
- **Adjust volume**: Use the volume slider to control white noise volume.
- **When complete**: The app shows a completion screen with your focus time. Click "Start Another Session" to begin another session.

### Stats Page
- **Day Streak**: Consecutive days with at least one completed task.
- **Weekly metrics**: Tasks completed and focus minutes this week.
- **Charts**: Bar chart of tasks per weekday; completion by time of day (Morning, Afternoon, Evening).

### Running Linter and Formatter

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Project Structure

```
focusflow-app/
├── src/
│   └── server/
│       ├── db/
│       │   └── database.js          # MongoDB connection module
│       ├── routes/
│       │   ├── tasks.js             # Tasks API routes (CRUD)
│       │   └── sessions.js          # Focus sessions API routes (CRUD)
│       └── index.js                 # Express server setup
├── public/
│   ├── index.html                   # Main HTML page
│   ├── css/
│   │   ├── modules/                 # CSS modules
│   │   │   ├── variables.css
│   │   │   ├── base.css
│   │   │   ├── navigation.css
│   │   │   ├── tasks.css
│   │   │   ├── focus.css
│   │   │   ├── stats.css
│   │   │   └── modal.css
│   │   └── main.css                 # Main CSS import file
│   └── js/
│       ├── api.js                   # API client module
│       ├── tasks.js                 # Tasks management module
│       ├── focus.js                 # Focus session module
│       ├── stats.js                 # Statistics module
│       └── main.js                  # Main application entry
├── docs/
│   └── design-document.md           # Design document
├── package.json
├── .eslintrc.json                   # ESLint configuration
├── .prettierrc                      # Prettier configuration
├── LICENSE                          # MIT License
└── README.md
```

## API Endpoints

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a single task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Focus Sessions

- `GET /api/sessions` - Get all sessions
- `GET /api/sessions/:id` - Get a single session
- `POST /api/sessions` - Create a new session
- `PUT /api/sessions/:id` - Update a session
- `DELETE /api/sessions/:id` - Delete a session
- `GET /api/sessions/stats/summary` - Get statistics summary

## MongoDB Collections

1. **tasks** - Stores user tasks
   - `_id`: ObjectId
   - `text`: String (task description)
   - `completed`: Boolean
   - `createdAt`: Date
   - `updatedAt`: Date

2. **sessions** - Stores focus sessions
   - `_id`: ObjectId
   - `taskId`: String (reference to task)
   - `duration`: Number (duration in seconds)
   - `completed`: Boolean
   - `createdAt`: Date
   - `updatedAt`: Date

## Features Implemented

✅ Node.js + Express.js backend  
✅ MongoDB with native driver (no Mongoose)  
✅ ES Modules (no CommonJS/require)  
✅ Client-side rendering with vanilla JavaScript  
✅ At least 2 MongoDB collections with full CRUD operations  
✅ Form implementation (task creation form, session form)  
✅ CSS organized by modules  
✅ ESLint configuration  
✅ Prettier configuration  
✅ MIT License  
✅ Proper code organization  
✅ No exposed credentials (uses environment variables)  

## License

This project is licensed under the MIT License - see the LICENSE file for details.
