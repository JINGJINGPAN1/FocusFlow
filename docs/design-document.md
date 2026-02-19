# FocusFlow – Design Document

## 1. Project Description

**FocusFlow** is a web-based productivity application that helps users manage tasks and maintain focus through structured, timed work sessions. It combines task management with a Pomodoro-style focus timer, enabling users to organize their work, stay concentrated, and track productivity over time.

Unlike calendar-based tools that emphasize scheduling, FocusFlow centers on **execution over planning**. Users create tasks, choose a focus duration, and start working. Each completed session is recorded and contributes to productivity insights. The app is designed for students, remote workers, and anyone who wants a simple, distraction-free way to focus and understand how they spend their time.

### Core Features

| Feature                | Description                                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Task Management**    | Create, edit, delete, and complete tasks. Organize by date and time of day (Anytime, Morning, Afternoon, Evening).                |
| **Focus Sessions**     | Start timed focus sessions with preset durations (15, 25, 45, 60 min) or custom length. Optional white noise. Play/pause control. |
| **Session Completion** | Clear completion state with success feedback, duration display, and "Start Another Session" button.                               |
| **Statistics**         | Day streak, weekly completed tasks, weekly focus minutes, bar chart by weekday, and completion by time of day.                    |

### Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (native driver)
- **Frontend**: HTML5, Vanilla JavaScript (ES Modules), client-side rendering
- **Styling**: CSS modules (variables, base, navigation, tasks, focus, stats, modal)

---

## 2. User Personas

### Persona 1: Sarah – The College Student

**Age**: 22  
**Occupation**: College Student  
**Tech Savviness**: High

**Goals**: Manage coursework, study for exams, and complete assignments on time.

**Pain Points**:

- Struggles to stay focused during long study sessions
- Loses track of assignments across multiple classes
- Has no clear way to measure study productivity

**How FocusFlow Helps**: Sarah creates tasks for each assignment, uses focus sessions to maintain concentration, and reviews statistics to see how much she accomplished each week.

---

### Persona 2: Mark – The Remote Worker

**Age**: 35  
**Occupation**: Software Developer (Remote)  
**Tech Savviness**: Very High

**Goals**: Stay productive at home, manage multiple projects, and maintain deep work periods.

**Pain Points**:

- Distractions at home (family, notifications)
- Difficulty tracking time spent on different projects
- Needs structured work intervals and breaks

**How FocusFlow Helps**: Mark organizes work tasks by time of day, uses focus sessions for deep work, and reviews weekly charts to understand his productivity patterns.

---

### Persona 3: Lisa – The Procrastinator

**Age**: 24  
**Occupation**: Graduate Student  
**Tech Savviness**: Medium

**Goals**: Overcome procrastination and build consistent study habits.

**Pain Points**:

- Hard to start tasks; often feels overwhelmed
- Benefits from short, structured sessions rather than long blocks
- Wants visible progress to stay motivated

**How FocusFlow Helps**: Lisa uses short focus sessions (15–25 min) to break work into manageable chunks. The completion screen and day streak give her a sense of achievement and encourage consistency.

---

## 3. User Stories

User stories are written in narrative form: _As a [role], I want to [action], so that [benefit]._

### Task Management

**Story 1: Creating a Task**  
_As a student, I want to create a task with a description, date, duration, and time of day, so that I can organize what I need to work on and when._

- User clicks "+ Add Task" or the "+" in a period section.
- A modal opens with fields: task description, date, duration (5–180 min), and time of day (Anytime, Morning, Afternoon, Evening).
- On submit, the task is saved and appears in the corresponding period section.
- The progress ring and filter counts update.

**Story 2: Viewing and Filtering Tasks**  
_As a user, I want to view my tasks and filter by All, Active, or Completed, so that I can focus on what matters right now._

- Tasks are grouped by time of day (Anytime, Morning, Afternoon, Evening).
- Filter buttons show counts and toggle the visible task list.
- A date picker allows viewing tasks for different days.
- A progress ring shows daily completion (e.g., 2/5 tasks).

**Story 3: Completing a Task**  
_As a user, I want to mark a task as completed, so that I can track my progress and feel a sense of accomplishment._

- User checks the checkbox next to a task.
- The task is marked completed and moves to the completed filter.
- The progress ring and period progress update.

**Story 4: Editing and Deleting a Task**  
_As a user, I want to edit or delete tasks, so that I can keep my list accurate and up to date._

- Edit: User clicks the edit button, modal opens with current values, user saves changes.
- Delete: User clicks delete, confirmation dialog appears, task is removed on confirm.

**Story 5: Starting Focus from a Task**  
_As a student, I want to start a focus session for a specific task, so that I can concentrate on one thing at a time._

- User clicks the play (▶) button on a task card.
- The app navigates to the Focus page and starts a session with the task’s duration.
- The timer and white noise are ready to use.

---

### Focus Sessions

**Story 6: Starting a Focus Session**  
_As a user, I want to choose a duration and start a focus session anytime, so that I can focus even when I don’t have a specific task._

- User goes to the Focus tab and sees "Focus Session" with "How long do you want to focus?"
- User selects a preset (15, 25, 45, 60 min) or enters a custom duration.
- User clicks "Start" and the focus view appears with a countdown and play button.
- User clicks play to start the timer and optional white noise.

**Story 7: Pausing and Resuming a Focus Session**  
_As a user, I want to pause and resume a focus session, so that I can take breaks when needed without losing my place._

- User clicks the play/pause button to toggle.
- When paused, the timer stops and white noise stops.
- When resumed, both continue from where they left off.

**Story 8: Completing a Focus Session**  
_As a user, I want to see a clear completion state when a session ends, so that I feel rewarded and know what I achieved._

- When the timer reaches zero, the completion view appears.
- User sees a success icon, "Session Complete," the completed duration (e.g., "25 min"), and "You focused for 25 minutes."
- User can click "Start Another Session" to return to the duration selection screen.

---

### Statistics

**Story 9: Viewing Productivity Statistics**  
_As a user, I want to see my productivity statistics, so that I can understand my habits and improve over time._

- User navigates to the Stats tab.
- User sees: day streak, weekly completed tasks, weekly focus minutes.
- User sees a bar chart of tasks completed per weekday.
- User sees completion distribution by time of day (Morning, Afternoon, Evening).

---

## 4. Design Mockups

### 4.1 Tasks Page

```
┌──────────────────────────────────────────────────────────────────┐
│  📋 Tasks          ⏱ Focus          📊 Stats                    │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Tuesday        [📅 2026-02-17]         ╭──────╮           │  │
│  │                                          │ 60% │           │  │
│  │                                          │ 3/5 │           │  │
│  │                                          ╰──────╯           │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  Tasks                                    [+ Add Task]      │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  All (5)    Active (2)    Completed (3)                    │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  Anytime                                        0/1    [+]  │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │ ☐ Review design doc                    [▶] [✎] [🗑] │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  │  Morning                                         1/2   [+]  │  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │ ☑ Submit assignment                   [▶] [✎] [🗑] │   │  │
│  │  │ ☐ Study for exam                       [▶] [✎] [🗑] │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  │  Afternoon                                       1/1   [+]  │  │
│  │  Evening                                         0/1   [+]  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4.2 Focus Page – Duration Selection (No Session)

```
┌──────────────────────────────────────────────────────────────────┐
│  📋 Tasks          ⏱ Focus          📊 Stats                    │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │                    ╭─────────╮                               │  │
│  │                    │    ▶    │                               │  │
│  │                    ╰─────────╯                               │  │
│  │                                                              │  │
│  │                  Focus Session                               │  │
│  │           How long do you want to focus?                     │  │
│  │                                                              │  │
│  │              [15]  [25]  [45]  [60]                         │  │
│  │                   [Custom] min                               │  │
│  │                                                              │  │
│  │                  [▶ Start]                                  │  │
│  │                                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4.3 Focus Page – Active Session

```
┌──────────────────────────────────────────────────────────────────┐
│  📋 Tasks          ⏱ Focus          📊 Stats                    │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                  Focus Music                                │  │
│  │            Play music to help you concentrate               │  │
│  │                                                              │  │
│  │                    ╭─────────────╮                          │  │
│  │                    │  ◉ vinyl    │                          │  │
│  │                    │   record    │                          │  │
│  │                    ╰─────────────╯                          │  │
│  │                                                              │  │
│  │                      24:35                                   │  │
│  │                    remaining                                 │  │
│  │                                                              │  │
│  │                    [  ⏸  ]                                  │  │
│  │                                                              │  │
│  │  🔊 ████████████░░░░░░░░  70%                                │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4.4 Focus Page – Session Complete

```
┌──────────────────────────────────────────────────────────────────┐
│  📋 Tasks          ⏱ Focus          📊 Stats                    │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                                                              │  │
│  │                      ╭─────╮                                 │  │
│  │                      │  ✓  │   (green circle)                │  │
│  │                      ╰─────╯                                 │  │
│  │                                                              │  │
│  │                 Session Complete                             │  │
│  │                                                              │  │
│  │                      25 min                                  │  │
│  │                                                              │  │
│  │            You focused for 25 minutes                        │  │
│  │                                                              │  │
│  │            [Start Another Session]                           │  │
│  │                                                              │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4.5 Statistics Page

```
┌──────────────────────────────────────────────────────────────────┐
│  📋 Tasks          ⏱ Focus          📊 Stats                    │
├──────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  Statistics                                                 │  │
│  │  Your productivity insights                                  │  │
│  ├────────────────────────────────────────────────────────────┤  │
│  │  ┌─────────────────────────────────────────────────────┐   │  │
│  │  │                    5                                 │   │  │
│  │  │              Day Streak                              │   │  │
│  │  │  Consecutive days with at least one completed task   │   │  │
│  │  └─────────────────────────────────────────────────────┘   │  │
│  │                                                              │  │
│  │  ┌──────────────┐  ┌──────────────┐                        │  │
│  │  │  🎯  12      │  │  ⏰  180     │                        │  │
│  │  │ Tasks this   │  │ Focus time   │                        │  │
│  │  │ week         │  │ this week    │                        │  │
│  │  └──────────────┘  └──────────────┘                        │  │
│  │                                                              │  │
│  │  Tasks Completed This Week                                   │  │
│  │  ████  Mon  Tue  Wed  Thu  Fri  Sat  Sun  (bar chart)       │  │
│  │                                                              │  │
│  │  Completion by Time of Day                                  │  │
│  │  Morning ████  Afternoon ██████  Evening ██                  │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 4.6 Add Task Modal

```
┌──────────────────────────────────────────────────────────────────┐
│  Add New Task                                              [×]   │
├──────────────────────────────────────────────────────────────────┤
│  Task Description                                                │  │
│  ┌────────────────────────────────────────────────────────────┐ │  │
│  │ Enter task description                                      │ │  │
│  └────────────────────────────────────────────────────────────┘ │  │
│                                                                   │  │
│  Date                                                             │  │
│  ┌────────────────────────────────────────────────────────────┐ │  │
│  │ 2026-02-17                                                  │ │  │
│  └────────────────────────────────────────────────────────────┘ │  │
│                                                                   │  │
│  Duration                                                         │  │
│  [−]  25 min  [+]                                                │  │
│                                                                   │  │
│  Time of Day                                                      │  │
│  ○ Anytime  ○ Morning  ○ Afternoon  ○ Evening                    │  │
│                                                                   │  │
│                    [Cancel]  [Add Task]                           │  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5. Design Principles

1. **Simplicity** – Clean, uncluttered interface with minimal cognitive load.
2. **Execution-focused** – Emphasize starting and completing work over planning.
3. **Rewarding feedback** – Clear completion states and statistics to motivate users.
4. **Flexibility** – Focus sessions can be started with or without a linked task.
5. **Accessibility** – Semantic HTML, ARIA labels, and keyboard-friendly interactions.
6. **Responsiveness** – Layout adapts to different screen sizes.

---

## 6. Technical Architecture Summary

- **Backend**: Express.js REST API; MongoDB for `tasks` and `sessions` collections.
- **Frontend**: Vanilla JavaScript (ES modules), client-side rendering.
- **Styling**: CSS modules (variables, base, navigation, tasks, focus, stats, modal).
- **Data flow**: User action → JS handler → API fetch → Express route → MongoDB → Response → UI update.
