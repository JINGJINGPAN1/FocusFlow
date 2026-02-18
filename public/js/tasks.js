import * as api from './api.js';

const PERIODS = ['anytime', 'morning', 'afternoon', 'evening'];

let tasks = [];
let currentFilter = 'all';

export function initTasks() {
  updateDateHeader();
  loadTasks();
  setupEventListeners();
}

function updateDateHeader() {
  const now = new Date();
  const weekdayEl = document.getElementById('tasksWeekday');
  const dateEl = document.getElementById('tasksDate');

  if (weekdayEl) {
    weekdayEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long' });
  }
  if (dateEl) {
    dateEl.textContent = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
}

function setupEventListeners() {
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskForm = document.getElementById('taskForm');
  const closeModal = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const filterItems = document.querySelectorAll('.filter-item');
  const sectionAddBtns = document.querySelectorAll('.section-add-btn');

  const openModal = (preselectedPeriod = 'anytime') => {
    const radio = document.querySelector(`input[name="period"][value="${preselectedPeriod}"]`);
    if (radio) radio.checked = true;
    document.getElementById('taskModal').style.display = 'flex';
  };

  addTaskBtn?.addEventListener('click', () => openModal());

  sectionAddBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.period || 'anytime');
    });
  });

  closeModal?.addEventListener('click', closeTaskModal);
  cancelBtn?.addEventListener('click', closeTaskModal);

  setupDurationSelector();

  taskForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('text');
    const period = formData.get('period') || 'anytime';
    const duration = parseInt(document.getElementById('taskDuration').value, 10) || 25;

    try {
      await api.createTask({ text, period, duration });
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

const DURATION_MIN = 5;
const DURATION_MAX = 180;
const DURATION_STEP = 5;
const DURATION_DEFAULT = 25;

function setupDurationSelector() {
  const minusBtn = document.getElementById('durationMinus');
  const plusBtn = document.getElementById('durationPlus');
  const displayEl = document.getElementById('durationDisplay');
  const hiddenInput = document.getElementById('taskDuration');

  const updateDuration = (value) => {
    const clamped = Math.max(DURATION_MIN, Math.min(DURATION_MAX, value));
    if (hiddenInput) hiddenInput.value = clamped;
    if (displayEl) displayEl.textContent = `${clamped} min`;
    if (minusBtn) minusBtn.disabled = clamped <= DURATION_MIN;
    if (plusBtn) plusBtn.disabled = clamped >= DURATION_MAX;
  };

  minusBtn?.addEventListener('click', () => {
    const current = parseInt(hiddenInput?.value || DURATION_DEFAULT, 10);
    updateDuration(current - DURATION_STEP);
  });

  plusBtn?.addEventListener('click', () => {
    const current = parseInt(hiddenInput?.value || DURATION_DEFAULT, 10);
    updateDuration(current + DURATION_STEP);
  });

  updateDuration(parseInt(hiddenInput?.value || DURATION_DEFAULT, 10));
}

function closeTaskModal() {
  document.getElementById('taskModal').style.display = 'none';
  document.getElementById('taskForm').reset();
  resetDurationSelector();
}

function resetDurationSelector() {
  const hiddenInput = document.getElementById('taskDuration');
  const displayEl = document.getElementById('durationDisplay');
  const minusBtn = document.getElementById('durationMinus');
  const plusBtn = document.getElementById('durationPlus');
  if (hiddenInput) hiddenInput.value = DURATION_DEFAULT;
  if (displayEl) displayEl.textContent = `${DURATION_DEFAULT} min`;
  if (minusBtn) minusBtn.disabled = false;
  if (plusBtn) plusBtn.disabled = false;
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
  let filteredTasks = tasks;
  if (currentFilter === 'active') {
    filteredTasks = tasks.filter((t) => !t.completed);
  } else if (currentFilter === 'completed') {
    filteredTasks = tasks.filter((t) => t.completed);
  }

  PERIODS.forEach((period) => {
    const list = document.querySelector(`.todo-list[data-period="${period}"]`);
    if (!list) return;

    const periodTasks = filteredTasks.filter(
      (t) => (t.period || 'anytime') === period
    );

    list.innerHTML = '';

    if (periodTasks.length === 0) {
      list.innerHTML = `
        <li class="period-empty-placeholder">
          <span class="placeholder-text">No tasks yet</span>
        </li>
      `;
    } else {
      periodTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'task-card';
        li.setAttribute('data-status', task.completed ? 'completed' : 'active');
        const durationHtml = task.duration
          ? `<span class="task-card-duration">${task.duration} min</span>`
          : '';
        li.innerHTML = `
          <input type="checkbox" class="task-card-checkbox" ${
            task.completed ? 'checked' : ''
          } data-task-id="${task._id}" aria-label="Mark complete">
          <div class="task-card-body">
            <h4 class="task-card-title">${escapeHtml(task.text)}</h4>
            ${durationHtml}
          </div>
          <div class="task-card-actions">
            <button class="task-card-btn task-card-btn-start" data-task-id="${task._id}" title="Start focus session" aria-label="Start focus">
              <span class="btn-icon">▶</span>
            </button>
            <button class="task-card-btn task-card-btn-edit" data-task-id="${task._id}" title="Edit task" aria-label="Edit">
              <span class="btn-icon">✎</span>
            </button>
            <button class="task-card-btn task-card-btn-delete" data-task-id="${task._id}" title="Delete task" aria-label="Delete">
              <span class="btn-icon">🗑</span>
            </button>
          </div>
        `;
        list.appendChild(li);
      });
    }
  });

  attachTaskEventListeners();
  updateTaskCounts();
  updatePeriodProgress();
}

function updatePeriodProgress() {
  PERIODS.forEach((period) => {
    const periodTasks = tasks.filter((t) => (t.period || 'anytime') === period);
    const completed = periodTasks.filter((t) => t.completed).length;
    const total = periodTasks.length;

    const progressEl = document.querySelector(
      `.period-progress[data-period="${period}"]`
    );
    if (progressEl) progressEl.textContent = `${completed} / ${total}`;
  });
}

function attachTaskEventListeners() {
  const checkboxes = document.querySelectorAll('.task-card-checkbox');
  const deleteBtns = document.querySelectorAll('.task-card-btn-delete');
  const editBtns = document.querySelectorAll('.task-card-btn-edit');
  const startBtns = document.querySelectorAll('.task-card-btn-start');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', async (e) => {
      const taskId = e.currentTarget.dataset.taskId;
      const task = tasks.find((t) => t._id === taskId);
      if (task) {
        try {
          await api.updateTask(taskId, { completed: !task.completed });
          await loadTasks();
        } catch (error) {
          alert('Failed to update task: ' + error.message);
          e.currentTarget.checked = task.completed;
        }
      }
    });
  });

  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const taskId = e.currentTarget.dataset.taskId;
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
      const taskId = e.currentTarget.dataset.taskId;
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
      const taskId = e.currentTarget.dataset.taskId;
      const task = tasks.find((t) => t._id === taskId);
      if (task && !task.completed) {
        window.startFocusSession(taskId, task.text, task.duration);
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
