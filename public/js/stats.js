import * as api from './api.js';

export async function initStats() {
  await loadStats();
  await loadRecentSessions();
}

function getDateString(d) {
  return d.toISOString().slice(0, 10);
}

function getWeekStartDate() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now);
  monday.setDate(diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function computeWeeklyCompletedTasks(tasks) {
  const weekStart = getWeekStartDate();
  const weekStartStr = getDateString(weekStart);
  const today = new Date();
  const todayStr = getDateString(today);

  return tasks.filter((t) => {
    if (!t.completed) return false;
    const taskDate = t.date || getDateString(new Date(t.updatedAt || t.createdAt));
    return taskDate >= weekStartStr && taskDate <= todayStr;
  }).length;
}

function computeWeeklyFocusTime(sessions) {
  const weekStart = getWeekStartDate();
  const weekStartTime = weekStart.getTime();

  return sessions
    .filter((s) => s.completed && new Date(s.createdAt).getTime() >= weekStartTime)
    .reduce((sum, s) => sum + (s.duration || 0), 0);
}

function computeCompletionStreak(tasks) {
  const completedByDate = new Set();
  for (const t of tasks) {
    if (!t.completed) continue;
    const date = t.date || getDateString(new Date(t.updatedAt || t.createdAt));
    completedByDate.add(date);
  }

  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = getDateString(d);
    if (completedByDate.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

async function loadStats() {
  try {
    const [tasks, sessions] = await Promise.all([
      api.fetchTasks(),
      api.fetchSessions(),
    ]);

    const weeklyCompleted = computeWeeklyCompletedTasks(tasks);
    const weeklyFocusSeconds = computeWeeklyFocusTime(sessions);
    const weeklyFocusMinutes = Math.floor(weeklyFocusSeconds / 60);
    const streak = computeCompletionStreak(tasks);

    const weeklyEl = document.getElementById('weeklyCompletedTasks');
    const focusEl = document.getElementById('weeklyFocusMinutes');
    const streakEl = document.getElementById('completionStreak');

    if (weeklyEl) weeklyEl.textContent = weeklyCompleted;
    if (focusEl) focusEl.textContent = weeklyFocusMinutes;
    if (streakEl) streakEl.textContent = streak;
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function loadRecentSessions() {
  try {
    const sessions = await api.fetchSessions();
    const recentSessions = sessions.slice(0, 10);
    const contentEl = document.getElementById('recentSessionsContent');

    if (recentSessions.length === 0) {
      contentEl.innerHTML =
        '<div class="recent-sessions-empty">No focus sessions yet. Complete your first session to see stats!</div>';
      return;
    }

    contentEl.innerHTML = recentSessions
      .map((session) => {
        const date = new Date(session.createdAt);
        const duration = Math.floor(session.duration / 60);
        const status = session.completed ? '✅ Completed' : '⏸ Incomplete';
        return `
          <div class="session-item">
            <div class="session-date">${date.toLocaleDateString()}</div>
            <div class="session-details">
              <span>${duration} minutes</span>
              <span>${status}</span>
            </div>
          </div>
        `;
      })
      .join('');
  } catch (error) {
    console.error('Error loading recent sessions:', error);
    document.getElementById('recentSessionsContent').innerHTML =
      '<div class="recent-sessions-empty">Failed to load sessions</div>';
  }
}

export async function updateStats() {
  await loadStats();
  await loadRecentSessions();
}

window.updateStats = updateStats;
