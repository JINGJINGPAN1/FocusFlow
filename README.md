# FocusFlow - Task & Focus Management Application

## Author

**Jingjing Pan**  
Email: pan.jingj@northeastern.edu

**Yingyi Kong**  
Email: kong.yin@northeastern.edu

## Class Link

[CS5610 Web Development - Northeastern University](https://johnguerra.co/classes/webDevelopment_online_spring_2026/)

## Live Demo

> **Deployed URL**: `https://focusflow-wj9l.onrender.com/`

## Project Objective

FocusFlow is a web-based productivity application that helps users manage tasks and maintain focus through structured, timed work sessions. It combines task management with a Pomodoro-style focus timer, enabling users to organize their work, stay concentrated, and track productivity over time.

The app emphasizes **execution over planning**: users create tasks, choose a focus duration, and start working. Each completed session is recorded and contributes to productivity insights. FocusFlow is designed for students, remote workers, and anyone who wants a simple, distraction-free way to focus and understand how they spend their time.

### Key Features

- **Task Management**: Create, edit, delete, and complete tasks. Organize by date and time of day (Anytime, Morning, Afternoon, Evening).
- **Focus Sessions**: Start timed focus sessions with preset durations (15, 25, 45, 60 min) or custom length. Optional white noise. Play/pause control.
- **Session Completion**: Clear completion state with success feedback, duration display, and "Start Another Session" button.
- **Statistics**: Day streak, weekly completed tasks, weekly focus minutes, bar chart by weekday, and completion by time of day.

## Documentation

- **[Design Document](docs/design-document.md)** – Project description, user personas, user stories, and design mockups
- **[MongoDB Local Setup](docs/mongodb-local-setup.md)** – Guide for setting up MongoDB locally

## Video Introduction

> **Note:** Click the image above to watch the video on YouTube.

## Screenshot

![FocusFlow Application Screenshot](docs/screenshot.png)

_Main interface with Tasks, Focus, and Stats tabs. Place your app screenshot at `docs/screenshot.png`._

## Instructions to Build

### Prerequisites

- **Node.js** v18 or higher ([nodejs.org](https://nodejs.org))
- **MongoDB** – local installation or [MongoDB Atlas](https://www.mongodb.com/atlas) account

### Step 1: Clone and Install

```bash
# Navigate to the project directory
cd FocusFlow

# Install dependencies
npm install
```

### Step 2: Configure Environment

Create a `.env` file in the project root:

**Local MongoDB:**

```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=focusflow
PORT=3000
```

**MongoDB Atlas:**

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net
DB_NAME=focusflow
PORT=3000
```

### Step 3: Start MongoDB

**Local:** Ensure MongoDB is running (e.g., `mongod` or via your system service). See [MongoDB Local Setup](docs/mongodb-local-setup.md) for detailed instructions.

**Atlas:** Ensure your cluster is running and the connection string is correct.

### Step 4: Run the Application

```bash
# Start the server
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### Step 5: Seed Database (Optional)

To populate the database with 1000+ sample records (tasks and focus sessions):

```bash
npm run seed
```

### Step 6: Access the App

Open your browser and go to:

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

## Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: MongoDB (native driver, no Mongoose)
- **Frontend**: HTML5 + Vanilla JavaScript (client-side rendering)
- **Styling**: CSS Modules
- **Module System**: ES Modules (ESM)

## Project Structure

```
FocusFlow/
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

## Contact

For questions or feedback, please contact:

- Email: pan.jingj@northeastern.edu
- Email: kong.yin@northeastern.edu
