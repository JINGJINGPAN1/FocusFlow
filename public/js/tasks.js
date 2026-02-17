import * as api from './api.js';

let tasks = [];
let currentFilter = 'all';

export function initTasks() {
  loadTasks();
  setupEventListeners();
}

function setupEventListeners() {
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskForm = document.getElementById('taskForm');
  const closeModal = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const filterItems = document.querySelectorAll('.filter-item');

  addTaskBtn?.addEventListener('click', () => {
    document.getElementById('taskModal').style.display = 'flex';
  });

  closeModal?.addEventListener('click', closeTaskModal);
  cancelBtn?.addEventListener('click', closeTaskModal);

  taskForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('text');

    try {
      await api.createTask({ text });
      closeTaskModal();
      await loadTasks();
      e.target.reset();
    } catch (error) {
      alert('Failed to create task: ' + error.message);
    }
  });

  filterItems.forEach((item) => {
    item.addEventListener('click', () => {
      filterItems.forEach((i) => i.classList.remove('active'));
      item.classList.add('active');
      currentFilter = item.dataset.filter;
      renderTasks();
    });
  });
}

function closeTaskModal() {
  document.getElementById('taskModal').style.display = 'none';
  document.getElementById('taskForm').reset();
}

async function loadTasks() {
  try {
    tasks = await api.fetchTasks();
    renderTasks();
  } catch (error) {
    console.error('Error loading tasks:', error);
    alert('Failed to load tasks');
  }
}

function renderTasks() {
  const list = document.getElementById('todoList');
  if (!list) return;

  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter((t) => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  list.innerHTML = '';

  if (filteredTasks.length === 0) {
    list.innerHTML = '<li class="empty-state">No tasks found</li>';
    updateTaskCounts();
    return;
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.setAttribute('data-status', task.completed ? 'completed' : 'active');
    li.innerHTML = `
      <input type="checkbox" class="todo-checkbox" ${
        task.completed ? 'checked' : ''
      } data-task-id="${task._id}">
      <span class="todo-text">${escapeHtml(task.text)}</span>
      <div class="todo-actions">
        <button class="action-btn" data-task-id="${
          task._id
        }" title="Start focus session">▶</button>
        <button class="action-btn edit" data-task-id="${
          task._id
        }" title="Edit task">✎</button>
        <button class="action-btn delete" data-task-id="${
          task._id
        }" title="Delete task">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });

  attachTaskEventListeners();
  updateTaskCounts();
}

function attachTaskEventListeners() {
  const checkboxes = document.querySelectorAll('.todo-checkbox');
  const deleteBtns = document.querySelectorAll('.action-btn.delete');
  const editBtns = document.querySelectorAll('.action-btn.edit');
  const startBtns = document.querySelectorAll('.action-btn:not(.delete):not(.edit)');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', async (e) => {
      const taskId = e.target.dataset.taskId;
      const task = tasks.find((t) => t._id === taskId);
      if (task) {
        try {
          await api.updateTask(taskId, { completed: !task.completed });
          await loadTasks();
        } catch (error) {
          alert('Failed to update task: ' + error.message);
          e.target.checked = task.completed;
        }
      }
    });
  });

  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const taskId = e.target.dataset.taskId;
      if (confirm('Are you sure you want to delete this task?')) {
        try {
          await api.deleteTask(taskId);
          await loadTasks();
        } catch (error) {
          alert('Failed to delete task: ' + error.message);
        }
      }
    });
  });

  editBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const taskId = e.target.dataset.taskId;
      const task = tasks.find((t) => t._id === taskId);
      if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText !== null && newText.trim()) {
          try {
            await api.updateTask(taskId, { text: newText.trim() });
            await loadTasks();
          } catch (error) {
            alert('Failed to update task: ' + error.message);
          }
        }
      }
    });
  });

  startBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const taskId = e.target.dataset.taskId;
      const task = tasks.find((t) => t._id === taskId);
      if (task && !task.completed) {
        window.startFocusSession(taskId, task.text);
      }
    });
  });
}

function updateTaskCounts() {
  const all = tasks.length;
  const active = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed).length;

  const allCountEl = document.getElementById('allCount');
  const activeCountEl = document.getElementById('activeCount');
  const completedCountEl = document.getElementById('completedCount');

  if (allCountEl) allCountEl.textContent = all;
  if (activeCountEl) activeCountEl.textContent = active;
  if (completedCountEl) completedCountEl.textContent = completed;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function getTaskById(taskId) {
  return tasks.find((t) => t._id === taskId);
}
