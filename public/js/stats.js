import * as api from './api.js';

export async function initStats() {
  await loadStats();
  await loadRecentSessions();
}

async function loadStats() {
  try {
    const stats = await api.fetchStats();
    document.getElementById('sessionsToday').textContent = stats.sessionsToday || 0;
    document.getElementById('totalMinutes').textContent = stats.totalMinutes || 0;
    document.getElementById('pomodoros').textContent = stats.pomodoros || 0;
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
