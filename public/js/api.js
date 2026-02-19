const API_BASE_URL = '/api';

export async function fetchTasks(date, options = {}) {
  const url = date
    ? `${API_BASE_URL}/tasks?date=${encodeURIComponent(date)}`
    : `${API_BASE_URL}/tasks`;
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }
  return response.json();
}

export async function createTask(taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create task');
  }
  return response.json();
}

export async function updateTask(taskId, taskData) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update task');
  }
  return response.json();
}

export async function deleteTask(taskId) {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete task');
  }
  return response.json();
}

export async function fetchSessions(options = {}) {
  const response = await fetch(`${API_BASE_URL}/sessions`, options);
  if (!response.ok) {
    throw new Error('Failed to fetch sessions');
  }
  return response.json();
}

export async function createSession(sessionData) {
  const response = await fetch(`${API_BASE_URL}/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create session');
  }
  return response.json();
}

export async function updateSession(sessionId, sessionData) {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sessionData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update session');
  }
  return response.json();
}

export async function deleteSession(sessionId) {
  const response = await fetch(`${API_BASE_URL}/sessions/${sessionId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete session');
  }
  return response.json();
}

export async function fetchStats() {
  const response = await fetch(`${API_BASE_URL}/sessions/stats/summary`);
  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }
  return response.json();
}
