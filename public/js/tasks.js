import * as api from './api.js';

const PERIODS = ['anytime', 'morning', 'afternoon', 'evening'];

let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;
let deletingTaskId = null;
let selectedDate = new Date().toISOString().slice(0, 10);

export function initTasks() {
  initDatePicker();
  updateDateHeader();
  loadTasks();
  setupEventListeners();
}

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

function initDatePicker() {
  const picker = document.getElementById('tasksDatePicker');
  if (picker) {
    picker.value = selectedDate;
    picker.addEventListener('change', (e) => {
      selectedDate = e.target.value;
      updateDateHeader();
      loadTasks();
    });
  }
}

function updateDateHeader() {
  const d = new Date(selectedDate + 'T12:00:00');
  const weekdayEl = document.getElementById('tasksWeekday');
  if (weekdayEl) {
    weekdayEl.textContent = d.toLocaleDateString('en-US', { weekday: 'long' });
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
    editingTaskId = null;
    setModalMode('add');
    document.getElementById('taskForm').reset();
    const dateInput = document.getElementById('taskDate');
    if (dateInput) dateInput.value = selectedDate;
    const radio = document.querySelector(`input[name="period"][value="${preselectedPeriod}"]`);
    if (radio) radio.checked = true;
    resetDurationSelector();
    document.getElementById('taskModal').style.display = 'flex';
  };

  const openModalForEdit = (task) => {
    editingTaskId = task._id;
    setModalMode('edit');
    document.getElementById('taskText').value = task.text;
    const dateInput = document.getElementById('taskDate');
    if (dateInput) dateInput.value = task.date || getTodayDateString();
    const radio = document.querySelector(`input[name="period"][value="${task.period || 'anytime'}"]`);
    if (radio) radio.checked = true;
    const duration = task.duration || DURATION_DEFAULT;
    const hiddenInput = document.getElementById('taskDuration');
    const displayEl = document.getElementById('durationDisplay');
    const minusBtn = document.getElementById('durationMinus');
    const plusBtn = document.getElementById('durationPlus');
    if (hiddenInput) hiddenInput.value = duration;
    if (displayEl) displayEl.textContent = `${duration} min`;
    if (minusBtn) minusBtn.disabled = duration <= DURATION_MIN;
    if (plusBtn) plusBtn.disabled = duration >= DURATION_MAX;
    document.getElementById('taskModal').style.display = 'flex';
  };

  addTaskBtn?.addEventListener('click', () => openModal());

  sectionAddBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      openModal(btn.dataset.period || 'anytime');
    });
  });

  const openDeleteModal = (task) => {
    deletingTaskId = task._id;
    const messageEl = document.getElementById('deleteModalMessage');
    if (messageEl) {
      messageEl.textContent = `Are you sure you want to delete "${task.text}"?`;
    }
    document.getElementById('deleteModal').style.display = 'flex';
  };

  window.openModalForEdit = openModalForEdit;
  window.openDeleteModal = openDeleteModal;

  closeModal?.addEventListener('click', closeTaskModal);
  cancelBtn?.addEventListener('click', closeTaskModal);

  const closeDeleteModalEl = document.getElementById('closeDeleteModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  const closeDeleteModal = () => {
    document.getElementById('deleteModal').style.display = 'none';
    deletingTaskId = null;
  };

  closeDeleteModalEl?.addEventListener('click', closeDeleteModal);
  cancelDeleteBtn?.addEventListener('click', closeDeleteModal);

  confirmDeleteBtn?.addEventListener('click', async () => {
    if (deletingTaskId) {
      try {
        await api.deleteTask(deletingTaskId);
        closeDeleteModal();
        await loadTasks();
      } catch (error) {
        alert('Failed to delete task: ' + error.message);
      }
    }
  });

  setupDurationSelector();

  taskForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('text');
    const period = formData.get('period') || 'anytime';
    const duration = parseInt(document.getElementById('taskDuration').value, 10) || 25;
    const date = document.getElementById('taskDate').value || getTodayDateString();

    try {
      if (editingTaskId) {
        await api.updateTask(editingTaskId, { text, period, duration, date });
      } else {
        await api.createTask({ text, period, duration, date });
        if (date !== selectedDate) {
          selectedDate = date;
          const picker = document.getElementById('tasksDatePicker');
          if (picker) picker.value = date;
          updateDateHeader();
        }
      }
      closeTaskModal();
      await loadTasks();
      e.target.reset();
    } catch (error) {
      alert('Failed to save task: ' + error.message);
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

function setModalMode(mode) {
  const titleEl = document.getElementById('taskModalTitle');
  const submitBtn = document.getElementById('taskSubmitBtn');
  if (mode === 'edit') {
    if (titleEl) titleEl.textContent = 'Edit Task';
    if (submitBtn) submitBtn.textContent = 'Save';
  } else {
    if (titleEl) titleEl.textContent = 'Add New Task';
    if (submitBtn) submitBtn.textContent = 'Add Task';
  }
}

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
  editingTaskId = null;
  setModalMode('add');
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
    tasks = await api.fetchTasks(selectedDate);
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
    btn.addEventListener('click', (e) => {
      const taskId = e.currentTarget.dataset.taskId;
      const task = tasks.find((t) => t._id === taskId);
      if (task && window.openDeleteModal) {
        window.openDeleteModal(task);
      }
    });
  });

  editBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const taskId = e.currentTarget.dataset.taskId;
      const task = tasks.find((t) => t._id === taskId);
      if (task && window.openModalForEdit) {
        window.openModalForEdit(task);
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

  updateProgressRing();
}

function updateProgressRing() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const percentEl = document.getElementById('progressRingPercent');
  const labelEl = document.getElementById('progressRingLabel');
  const fillEl = document.getElementById('progressRingFill');

  if (percentEl) percentEl.textContent = `${percent}%`;
  if (labelEl) labelEl.textContent = `${completed} / ${total} tasks`;

  if (fillEl) {
    const radius = 52;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (circumference * (completed / total));
    fillEl.style.strokeDashoffset = total > 0 ? offset : circumference;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function getTaskById(taskId) {
  return tasks.find((t) => t._id === taskId);
}

export function getSelectedDate() {
  return selectedDate;
}
