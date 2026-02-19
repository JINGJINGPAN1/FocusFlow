import * as api from './api.js';

export async function initStats() {
  await loadStats();
}

function getDateString(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
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
    const taskDate =
      t.date || getDateString(new Date(t.updatedAt || t.createdAt));
    return taskDate >= weekStartStr && taskDate <= todayStr;
  }).length;
}

function computeWeeklyFocusTime(sessions) {
  const weekStart = getWeekStartDate();
  const weekStartTime = weekStart.getTime();

  return sessions
    .filter(
      (s) => s.completed && new Date(s.createdAt).getTime() >= weekStartTime
    )
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

function computeTasksPerDay(tasks) {
  const weekStart = getWeekStartDate();
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const result = dayNames.map((name) => ({ day: name, count: 0 }));

  for (const t of tasks) {
    if (!t.completed) continue;
    const taskDate =
      t.date || getDateString(new Date(t.updatedAt || t.createdAt));
    const d = new Date(taskDate + 'T12:00:00');
    const diffDays = Math.floor((d - weekStart) / (24 * 60 * 60 * 1000));
    if (diffDays >= 0 && diffDays < 7) {
      result[diffDays].count++;
    }
  }
  return result;
}

function computePeriodDistribution(tasks) {
  const completed = tasks.filter((t) => t.completed);
  const total = completed.length;
  const counts = { morning: 0, afternoon: 0, evening: 0, anytime: 0 };

  for (const t of completed) {
    const period = (t.period || 'anytime').toLowerCase();
    if (counts[period] !== undefined) counts[period]++;
  }

  return [
    {
      label: 'Morning',
      count: counts.morning,
      percent: total > 0 ? (counts.morning / total) * 100 : 0,
    },
    {
      label: 'Afternoon',
      count: counts.afternoon,
      percent: total > 0 ? (counts.afternoon / total) * 100 : 0,
    },
    {
      label: 'Evening',
      count: counts.evening,
      percent: total > 0 ? (counts.evening / total) * 100 : 0,
    },
  ];
}

function renderWeeklyChart(tasksPerDay) {
  const container = document.getElementById('weeklyChart');
  if (!container) return;

  const maxCount = Math.max(1, ...tasksPerDay.map((d) => d.count));

  container.innerHTML = tasksPerDay
    .map(
      (d) => `
    <div class="chart-bar-wrapper">
      <div class="chart-bar-container">
        <div class="chart-bar" style="height: ${(d.count / maxCount) * 100}%"></div>
      </div>
      <span class="chart-bar-value">${d.count}</span>
      <span class="chart-bar-label">${d.day}</span>
    </div>
  `
    )
    .join('');
}

function renderPeriodDistribution(distribution) {
  const container = document.getElementById('periodDistribution');
  if (!container) return;

  container.innerHTML = distribution
    .map(
      (d) => `
    <div class="period-bar-row">
      <span class="period-bar-label">${d.label}</span>
      <div class="period-bar-track">
        <div class="period-bar-fill" style="width: ${d.percent}%"></div>
      </div>
      <span class="period-bar-percent">${Math.round(d.percent)}%</span>
    </div>
  `
    )
    .join('');
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
    const tasksPerDay = computeTasksPerDay(tasks);
    const periodDistribution = computePeriodDistribution(tasks);

    const weeklyEl = document.getElementById('weeklyCompletedTasks');
    const focusEl = document.getElementById('weeklyFocusMinutes');
    const streakEl = document.getElementById('completionStreak');

    if (weeklyEl) weeklyEl.textContent = weeklyCompleted;
    if (focusEl) focusEl.textContent = weeklyFocusMinutes;
    if (streakEl) streakEl.textContent = streak;

    renderWeeklyChart(tasksPerDay);
    renderPeriodDistribution(periodDistribution);
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

export async function updateStats() {
  await loadStats();
}

window.updateStats = updateStats;
