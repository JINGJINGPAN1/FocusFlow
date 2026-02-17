# FocusFlow - Design Document

## Approved Project Proposal (#project)

*Submitted to John Alexis Guerra Gomez (Teacher)*

**Project Name:** FocusFlow – Task-Centric Focus & Pomodoro Tracker

**Members:**

- **Jingjing Pan** – Todo Management & Frontend Rendering  
  *(Collections: todos)*
- **Yingyi Kong** – Focus Timer & Session Tracking  
  *(Collections: focus_sessions)*

**Description:**

FocusFlow is a task-centric focus management web application designed to help students stay productive by combining task tracking with Pomodoro-style focus sessions. Users create a list of tasks and select one task at a time to start a focused work session. Each completed focus session is recorded and linked to its corresponding task, allowing users to review their productivity over time.

Unlike calendar-based productivity tools that rely on time-block scheduling, FocusFlow emphasizes execution over planning. By centering the experience around tasks and short, intentional focus intervals, the application helps users avoid multitasking and track real progress. The app is especially useful for students managing multiple assignments who want a simple, distraction-free way to focus and understand how they spend their study time.

**User Personas (from proposal):**

1. **College Student** – Manages multiple assignments and exams; needs a simple way to focus on one task at a time.
2. **Procrastinating Student** – Struggles with starting tasks; benefits from short, structured focus sessions.
3. **Productivity-Oriented User** – Wants to track how much time is spent on each task; uses productivity data to improve study habits.

**User Stories (from proposal):**

*Jingjing Pan – Todo Management*

- As a student, I want to create a todo item, so I can organize what I need to work on.
- As a student, I want to view a list of my todos, so I can see all my tasks in one place.
- As a student, I want to mark a todo as completed, so I can track finished work.
- As a student, I want to delete a todo, so I can remove tasks that are no longer relevant.

*Yingyi Kong – Focus Timer & Session Tracking*

- As a student, I want to start a focus session for a specific todo, so I can concentrate on one task.
- As a student, I want to use a Pomodoro-style timer, so I can work in focused intervals.
- As a student, I want each completed focus session to be saved, so I can review my productivity history.
- As a student, I want to see how many focus sessions I completed today, so I understand my study effort.

**Technology Stack:** Node.js and Express backend with MongoDB for data persistence; client-side rendered frontend built with HTML5, CSS, and vanilla JavaScript.

---

The sections below expand on this proposal with detailed personas, user stories (including acceptance criteria), design mockups, and technical architecture. Implementation uses the `tasks` and `sessions` collections (aligned with the proposed todos and focus_sessions scope).

---

## Project Description

FocusFlow is a web-based productivity application designed to help users manage their tasks and maintain focus through structured work sessions. The application combines task management capabilities with a Pomodoro-style timer system, allowing users to organize their work and track their productivity over time.

The application is built using Node.js and Express.js for the backend, MongoDB for data persistence, and vanilla JavaScript for client-side rendering. It follows modern web development practices with modular code organization, ES modules, and a clean separation of concerns.

### Core Functionality

1. **Task Management**: Users can create, read, update, and delete tasks
2. **Focus Sessions**: Users can start timed focus sessions for specific tasks
3. **Statistics Tracking**: The application tracks and displays productivity metrics
4. **User Interface**: A clean, modern interface with three main views (Tasks, Focus, Stats)

## User Personas

### Persona 1: Sarah - The Student

**Age**: 22  
**Occupation**: College Student  
**Tech Savviness**: High  
**Goals**: Manage coursework, study sessions, and assignments efficiently  
**Pain Points**: 
- Difficulty staying focused during study sessions
- Losing track of assignments and deadlines
- No clear way to measure study productivity

**How FocusFlow Helps**: Sarah can create tasks for each assignment, use focus sessions to maintain concentration during study time, and track how many productive sessions she completes each day.

### Persona 2: Mark - The Remote Worker

**Age**: 35  
**Occupation**: Software Developer (Remote)  
**Tech Savviness**: Very High  
**Goals**: Stay productive while working from home, manage multiple projects  
**Pain Points**:
- Distractions at home
- Difficulty tracking time spent on different projects
- Need for structured work breaks

**How FocusFlow Helps**: Mark can organize work tasks, use focus sessions to maintain deep work periods, and review statistics to understand his productivity patterns throughout the week.

### Persona 3: Lisa - The Freelancer

**Age**: 28  
**Occupation**: Graphic Designer (Freelance)  
**Tech Savviness**: Medium  
**Goals**: Balance multiple client projects, track billable hours  
**Pain Points**:
- Juggling multiple client projects
- Need to track time for billing purposes
- Staying focused on creative work

**How FocusFlow Helps**: Lisa can create tasks for each client project, use focus sessions to track time spent, and review statistics to understand her work patterns and bill clients accurately.

## User Stories

### Task Management Stories

**Story 1: Creating a Task**
- **As a** user  
- **I want to** create a new task with a description  
- **So that** I can keep track of things I need to do  
- **Acceptance Criteria**:
  - User can click "Add Task" button
  - A modal form appears
  - User can enter task description
  - Task is saved and appears in the task list
  - Form validates that task text is not empty

**Story 2: Completing a Task**
- **As a** user  
- **I want to** mark tasks as completed  
- **So that** I can track my progress  
- **Acceptance Criteria**:
  - User can check a checkbox next to a task
  - Task is marked as completed
  - Completed tasks are visually distinct
  - Task count updates accordingly

**Story 3: Editing a Task**
- **As a** user  
- **I want to** edit existing tasks  
- **So that** I can update task descriptions  
- **Acceptance Criteria**:
  - User can click edit button on a task
  - A prompt appears with current task text
  - User can modify and save changes
  - Updated task appears in the list

**Story 4: Deleting a Task**
- **As a** user  
- **I want to** delete tasks I no longer need  
- **So that** I can keep my task list clean  
- **Acceptance Criteria**:
  - User can click delete button
  - Confirmation dialog appears
  - Task is removed upon confirmation
  - Task list updates immediately

**Story 5: Filtering Tasks**
- **As a** user  
- **I want to** filter tasks by status (all/active/completed)  
- **So that** I can focus on relevant tasks  
- **Acceptance Criteria**:
  - User can click filter buttons
  - Task list shows only filtered tasks
  - Counts update for each filter
  - Active filter is visually highlighted

### Focus Session Stories

**Story 6: Starting a Focus Session**
- **As a** user  
- **I want to** start a focus session for a specific task  
- **So that** I can work on it without distractions  
- **Acceptance Criteria**:
  - User selects a task and clicks play button
  - User is navigated to Focus page
  - User can set session duration
  - Timer starts counting down
  - Session is saved to database

**Story 7: Pausing a Focus Session**
- **As a** user  
- **I want to** pause an active focus session  
- **So that** I can take breaks when needed  
- **Acceptance Criteria**:
  - User can click pause button
  - Timer stops counting
  - User can resume by clicking play again
  - Session state is preserved

**Story 8: Completing a Focus Session**
- **As a** user  
- **I want to** complete a focus session  
- **So that** it counts toward my productivity stats  
- **Acceptance Criteria**:
  - When timer reaches zero, session completes automatically
  - User receives confirmation message
  - Session is marked as completed in database
  - Statistics update accordingly

**Story 9: Stopping a Focus Session**
- **As a** user  
- **I want to** stop a focus session early  
- **So that** I can end sessions when needed  
- **Acceptance Criteria**:
  - User can click stop button
  - Confirmation dialog appears
  - Session is deleted or marked incomplete
  - User returns to no-session view

### Statistics Stories

**Story 10: Viewing Daily Statistics**
- **As a** user  
- **I want to** see my productivity statistics  
- **So that** I can track my progress  
- **Acceptance Criteria**:
  - User navigates to Stats page
  - Sees sessions completed today
  - Sees total minutes focused
  - Sees Pomodoros completed (25-minute sessions)

**Story 11: Viewing Recent Sessions**
- **As a** user  
- **I want to** see my recent focus sessions  
- **So that** I can review my work history  
- **Acceptance Criteria**:
  - Recent sessions list displays on Stats page
  - Shows session date, duration, and completion status
  - Sessions are sorted by most recent first
  - Empty state shown when no sessions exist

## Design Mockups

### Tasks Page

```
┌─────────────────────────────────────┐
│  📋 Tasks    ⏱ Focus    📊 Stats   │
├─────────────────────────────────────┤
│                                     │
│  Tasks                    [+ Add]  │
│                                     │
│  All (5)  Active (3)  Completed(2) │
│  ─────────────────────────────────  │
│                                     │
│  ☐ Complete project proposal    ▶✎🗑│
│  ☐ Review design mockups        ▶✎🗑│
│  ☑ Submit assignment            ▶✎🗑│
│                                     │
└─────────────────────────────────────┘
```

### Focus Page (No Session)

```
┌─────────────────────────────────────┐
│  📋 Tasks    ⏱ Focus    📊 Stats   │
├─────────────────────────────────────┤
│                                     │
│         ╭─────────╮                 │
│         │    ▶    │                 │
│         ╰─────────╯                 │
│                                     │
│    No Active Focus Session          │
│                                     │
│  Select a task and click the play   │
│  button to start a focus session    │
│                                     │
└─────────────────────────────────────┘
```

### Focus Page (Active Session)

```
┌─────────────────────────────────────┐
│  📋 Tasks    ⏱ Focus    📊 Stats   │
├─────────────────────────────────────┤
│                                     │
│         Focus Session               │
│   Stay focused on your task         │
│                                     │
│  Complete project proposal          │
│                                     │
│         ╭─────────╮                 │
│         │  25:00  │                 │
│         ╰─────────╯                 │
│                                     │
│      ⏸    ▶    ⏹                  │
│                                     │
│  Duration (minutes)                 │
│  [25]                               │
│  [Start Session]                    │
│                                     │
└─────────────────────────────────────┘
```

### Statistics Page

```
┌─────────────────────────────────────┐
│  📋 Tasks    ⏱ Focus    📊 Stats   │
├─────────────────────────────────────┤
│                                     │
│  Statistics                          │
│  Track your productivity            │
│                                     │
│  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │  🎯 │  │  ⏰ │  │  📈 │        │
│  │  5  │  │ 125 │  │  3  │        │
│  │Today│  │Mins │  │Poms │        │
│  └─────┘  └─────┘  └─────┘        │
│                                     │
│  📅 Recent Sessions                 │
│  ────────────────────────           │
│  Feb 9, 2026    25 min  ✅         │
│  Feb 9, 2026    30 min  ✅         │
│  Feb 8, 2026    25 min  ✅         │
│                                     │
└─────────────────────────────────────┘
```

## Technical Architecture

### Backend Architecture

- **Server**: Express.js running on Node.js
- **Database**: MongoDB with native driver (no Mongoose)
- **Module System**: ES Modules (import/export)
- **API**: RESTful API with JSON responses
- **Collections**: 
  - `tasks` collection for task management
  - `sessions` collection for focus session tracking

### Frontend Architecture

- **Rendering**: Client-side rendering with vanilla JavaScript
- **Module System**: ES Modules
- **Styling**: CSS Modules (separate files per component)
- **State Management**: Local JavaScript modules
- **API Communication**: Fetch API for HTTP requests

### Data Flow

1. User interacts with UI
2. JavaScript module handles event
3. API module makes HTTP request
4. Express route processes request
5. Database module performs CRUD operation
6. Response sent back to client
7. UI updates with new data

## Design Principles

1. **Simplicity**: Clean, uncluttered interface
2. **Modularity**: Code organized into logical modules
3. **Responsiveness**: Works on various screen sizes
4. **Accessibility**: Uses semantic HTML and standard form elements
5. **Performance**: Efficient client-side rendering
6. **Maintainability**: Well-organized code structure
