import * as api from './api.js';

let currentSession = null;
let timerInterval = null;
let remainingSeconds = 0;
let totalDuration = 25 * 60; // 25 minutes default
let isPlaying = false;
let currentTaskId = null;
let volume = 70;
let whiteNoiseAudio = null;

const FOCUS_DURATION_DEFAULT = 25;
// Test: set to 5 for 5-second focus, set to 0 to use normal duration
const TEST_DURATION_SECONDS = 0;

export function initFocus() {
  setupEventListeners();
  initWhiteNoise();
  setupFocusStartControls();
}

const FOCUS_DURATION_MIN = 1;
const FOCUS_DURATION_MAX = 120;

function setupFocusStartControls() {
  const durationBtns = document.querySelectorAll('.focus-segment');
  const customInput = document.getElementById('focusCustomDuration');
  const startBtn = document.getElementById('focusStartBtn');

  durationBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      durationBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      if (customInput) customInput.value = '';
    });
  });

  customInput?.addEventListener('input', () => {
    if (customInput.value) {
      durationBtns.forEach((b) => b.classList.remove('active'));
    }
  });

  customInput?.addEventListener('focus', () => {
    durationBtns.forEach((b) => b.classList.remove('active'));
  });

  startBtn?.addEventListener('click', () => {
    let minutes = FOCUS_DURATION_DEFAULT;
    const customVal = customInput?.value?.trim();
    if (customVal) {
      const parsed = parseInt(customVal, 10);
      if (
        !isNaN(parsed) &&
        parsed >= FOCUS_DURATION_MIN &&
        parsed <= FOCUS_DURATION_MAX
      ) {
        minutes = parsed;
      }
    } else {
      const activeBtn = document.querySelector('.focus-segment.active');
      minutes = activeBtn
        ? parseInt(activeBtn.dataset.minutes, 10)
        : FOCUS_DURATION_DEFAULT;
    }
    startFocusSession(null, 'Focus Session', minutes);
  });

  document
    .getElementById('focusStartAgainBtn')
    ?.addEventListener('click', () => {
      resetSession();
    });
}

function initWhiteNoise() {
  whiteNoiseAudio = document.getElementById('whiteNoiseAudio');
  if (whiteNoiseAudio) {
    // Set initial volume
    whiteNoiseAudio.volume = volume / 100;

    // Listen for audio end event for loop playback
    whiteNoiseAudio.addEventListener('ended', handleAudioEnded);

    // Listen for audio errors
    whiteNoiseAudio.addEventListener('error', (e) => {
      console.error('White noise audio error:', e);
    });
  }
}

function handleAudioEnded() {
  // If focus duration exceeds 60 minutes and still playing, auto loop
  if (totalDuration > 60 * 60 && isPlaying && remainingSeconds > 0) {
    if (whiteNoiseAudio) {
      whiteNoiseAudio.currentTime = 0;
      whiteNoiseAudio.play().catch((error) => {
        console.error('Error replaying white noise:', error);
      });
    }
  }
}

function setupEventListeners() {
  const playBtn = document.getElementById('masterPlayBtn');
  const volumeSlider = document.getElementById('volumeSlider');

  playBtn?.addEventListener('click', togglePlay);
  volumeSlider?.addEventListener('input', setVolume);
}

export function startFocusSession(taskId, _taskName, durationMinutes) {
  stopProgress();
  stopWhiteNoise();

  currentTaskId = taskId;
  currentSession = null;
  isPlaying = false;

  document.getElementById('noSessionView').style.display = 'none';
  document.getElementById('focusMusicView').style.display = 'block';

  // Use task duration if set, otherwise default to 25 minutes
  const minutes = durationMinutes && durationMinutes > 0 ? durationMinutes : 25;
  totalDuration =
    TEST_DURATION_SECONDS > 0 ? TEST_DURATION_SECONDS : minutes * 60;
  remainingSeconds = totalDuration;
  updateProgress();

  const playBtn = document.getElementById('masterPlayBtn');
  const playerWrapper = document.getElementById('playerWrapper');
  if (playBtn) playBtn.textContent = '▶';
  if (playerWrapper) playerWrapper.classList.remove('is-playing');

  const navTabs = document.querySelectorAll('.sidebar-nav-item');
  const pages = document.querySelectorAll('.page');
  navTabs.forEach((tab) => tab.classList.remove('active'));
  pages.forEach((page) => page.classList.remove('active'));

  document.querySelector('[data-page="focus"]').classList.add('active');
  document.getElementById('focusPage').classList.add('active');
}

function togglePlay() {
  isPlaying = !isPlaying;
  const playBtn = document.getElementById('masterPlayBtn');
  const playerWrapper = document.getElementById('playerWrapper');

  if (isPlaying) {
    playBtn.textContent = '⏸';
    playerWrapper.classList.add('is-playing');
    startProgress();
    startWhiteNoise();

    // Create session if not yet created
    if (!currentSession) {
      createSession();
    }
  } else {
    playBtn.textContent = '▶';
    playerWrapper.classList.remove('is-playing');
    stopProgress();
    stopWhiteNoise();
  }
}

function startWhiteNoise() {
  if (whiteNoiseAudio) {
    whiteNoiseAudio.volume = volume / 100;
    whiteNoiseAudio.currentTime = 0; // Start from beginning
    whiteNoiseAudio.play().catch((error) => {
      console.error('Error playing white noise:', error);
    });
  }
}

function stopWhiteNoise() {
  if (whiteNoiseAudio) {
    whiteNoiseAudio.pause();
    whiteNoiseAudio.currentTime = 0;
  }
}

function startProgress() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    if (isPlaying && remainingSeconds > 0) {
      remainingSeconds--;
      updateProgress();

      if (remainingSeconds === 0) {
        completeSession();
      }
    }
  }, 1000);
}

function stopProgress() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

async function createSession() {
  try {
    const sessionData = {
      taskId: currentTaskId,
      duration: totalDuration,
      completed: false,
    };
    currentSession = await api.createSession(sessionData);
  } catch (error) {
    console.error('Failed to create session:', error);
  }
}

async function completeSession() {
  isPlaying = false;
  stopProgress();
  stopWhiteNoise();

  const playBtn = document.getElementById('masterPlayBtn');
  const playerWrapper = document.getElementById('playerWrapper');
  if (playBtn) playBtn.textContent = '▶';
  if (playerWrapper) playerWrapper.classList.remove('is-playing');

  const actualDurationSeconds = totalDuration - remainingSeconds;

  if (currentSession) {
    try {
      await api.updateSession(currentSession._id, {
        completed: true,
        duration: actualDurationSeconds,
      });
      if (currentTaskId) {
        await api.updateTask(currentTaskId, {
          completed: true,
        });
      }
      showCompleteView(actualDurationSeconds);
      if (window.updateStats) {
        window.updateStats();
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  } else {
    try {
      await api.createSession({
        taskId: currentTaskId,
        duration: actualDurationSeconds,
        completed: true,
      });
      if (currentTaskId) {
        await api.updateTask(currentTaskId, {
          completed: true,
        });
      }
      showCompleteView(actualDurationSeconds);
      if (window.updateStats) {
        window.updateStats();
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  }
}

function showCompleteView(completedSeconds) {
  stopProgress();
  stopWhiteNoise();

  currentSession = null;
  isPlaying = false;
  currentTaskId = null;

  const playBtn = document.getElementById('masterPlayBtn');
  const playerWrapper = document.getElementById('playerWrapper');
  if (playBtn) playBtn.textContent = '▶';
  if (playerWrapper) playerWrapper.classList.remove('is-playing');

  const mins = Math.floor(completedSeconds / 60);
  const secs = completedSeconds % 60;
  const timeDisplay =
    secs > 0 ? `${mins} min ${secs} sec` : mins === 1 ? '1 min' : `${mins} min`;
  const subtitleText =
    mins === 1 && secs === 0
      ? 'You focused for 1 minute'
      : secs > 0
        ? `You focused for ${mins} minutes ${secs} seconds`
        : `You focused for ${mins} minutes`;

  document.getElementById('noSessionView').style.display = 'none';
  document.getElementById('focusMusicView').style.display = 'none';
  const completeView = document.getElementById('focusCompleteView');
  completeView.style.display = 'flex';
  document.getElementById('focusCompletedTime').textContent = timeDisplay;
  document.getElementById('focusCompletedSubtitle').textContent = subtitleText;
  completeView.offsetHeight; // trigger reflow for animation
  completeView.classList.add('focus-complete-visible');
}

export async function deleteSession() {
  if (currentSession) {
    try {
      await api.deleteSession(currentSession._id);
      resetSession();
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  } else {
    resetSession();
  }
}

function resetSession() {
  currentSession = null;
  totalDuration = FOCUS_DURATION_DEFAULT * 60;
  remainingSeconds = totalDuration;
  isPlaying = false;
  currentTaskId = null;

  stopProgress();
  stopWhiteNoise();

  const playBtn = document.getElementById('masterPlayBtn');
  const playerWrapper = document.getElementById('playerWrapper');
  if (playBtn) playBtn.textContent = '▶';
  if (playerWrapper) playerWrapper.classList.remove('is-playing');

  // Hide complete and music views first, then show duration selector
  const completeView = document.getElementById('focusCompleteView');
  const noSessionView = document.getElementById('noSessionView');
  const musicView = document.getElementById('focusMusicView');
  completeView.classList.remove('focus-complete-visible');
  completeView.style.display = 'none';
  if (musicView) musicView.style.display = 'none';
  if (noSessionView) noSessionView.style.display = 'block';

  // Reset duration selector to default (25 min)
  const durationBtns = document.querySelectorAll('.focus-segment');
  const customInput = document.getElementById('focusCustomDuration');
  durationBtns.forEach((b) => b.classList.remove('active'));
  const defaultBtn = document.querySelector('.focus-segment[data-minutes="25"]');
  if (defaultBtn) defaultBtn.classList.add('active');
  if (customInput) customInput.value = '';

  updateProgress();
}

function updateProgress() {
  const countdownEl = document.getElementById('focusCountdown');
  const remainingMins = Math.floor(remainingSeconds / 60);
  const remainingSecs = remainingSeconds % 60;
  if (countdownEl) {
    countdownEl.textContent = `${remainingMins}:${remainingSecs.toString().padStart(2, '0')}`;
  }
}

function setVolume(event) {
  const rangeInput = event.currentTarget;
  volume = parseInt(rangeInput.value, 10);
  const volumePercent = document.getElementById('volumePercent');

  if (volumePercent) volumePercent.textContent = volume + '%';

  if (whiteNoiseAudio) {
    whiteNoiseAudio.volume = volume / 100;
  }
}

window.startFocusSession = startFocusSession;

/** When leaving Focus tab: if session is paused, reset to duration selection so user sees it when returning */
export function onLeaveFocusPage() {
  const musicView = document.getElementById('focusMusicView');
  const noSessionView = document.getElementById('noSessionView');
  if (!musicView || !noSessionView) return;
  if (musicView.style.display !== 'none' && !isPlaying) {
    resetSession();
  }
}
