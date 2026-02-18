import * as api from './api.js';

let currentSession = null;
let timerInterval = null;
let remainingSeconds = 0;
let totalDuration = 25 * 60; // 25 minutes default
let isPlaying = false;
let currentTaskId = null;
let currentTaskName = '';
let volume = 70;
let isShuffle = false;
let isRepeat = false;
let whiteNoiseAudio = null;
let audioLoopCount = 0;

const FOCUS_DURATION_DEFAULT = 25;

export function initFocus() {
  setupEventListeners();
  initWhiteNoise();
  setupFocusStartControls();
}

const FOCUS_DURATION_MIN = 1;
const FOCUS_DURATION_MAX = 120;

function setupFocusStartControls() {
  const durationBtns = document.querySelectorAll('.focus-duration-btn');
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
      if (!isNaN(parsed) && parsed >= FOCUS_DURATION_MIN && parsed <= FOCUS_DURATION_MAX) {
        minutes = parsed;
      }
    } else {
      const activeBtn = document.querySelector('.focus-duration-btn.active');
      minutes = activeBtn ? parseInt(activeBtn.dataset.minutes, 10) : FOCUS_DURATION_DEFAULT;
    }
    startFocusSession(null, 'Focus Session', minutes);
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
    audioLoopCount++;
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
  const shuffleBtn = document.getElementById('shuffleBtn');
  const repeatBtn = document.getElementById('repeatBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progressBar');
  const volumeSlider = document.getElementById('volumeSlider');

  playBtn?.addEventListener('click', togglePlay);
  shuffleBtn?.addEventListener('click', toggleShuffle);
  repeatBtn?.addEventListener('click', toggleRepeat);
  prevBtn?.addEventListener('click', previousTrack);
  nextBtn?.addEventListener('click', nextTrack);
  progressBar?.addEventListener('click', seekProgress);
  volumeSlider?.addEventListener('click', setVolume);
}

export function startFocusSession(taskId, taskName, durationMinutes) {
  stopProgress();
  stopWhiteNoise();

  currentTaskId = taskId;
  currentTaskName = taskName;
  currentSession = null;
  isPlaying = false;

  document.getElementById('noSessionView').style.display = 'none';
  document.getElementById('focusMusicView').style.display = 'block';

  // Use task duration if set, otherwise default to 25 minutes
  const minutes = durationMinutes && durationMinutes > 0 ? durationMinutes : 25;
  totalDuration = minutes * 60;
  remainingSeconds = totalDuration;
  audioLoopCount = 0;
  updateProgress();

  const playBtn = document.getElementById('masterPlayBtn');
  const playerWrapper = document.getElementById('playerWrapper');
  if (playBtn) playBtn.textContent = '▶';
  if (playerWrapper) playerWrapper.classList.remove('is-playing');

  const navTabs = document.querySelectorAll('.nav-tab');
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
        if (isRepeat) {
          remainingSeconds = totalDuration;
        } else {
          completeSession();
        }
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

  if (currentSession) {
    try {
      const actualDuration = totalDuration - remainingSeconds;
      await api.updateSession(currentSession._id, {
        completed: true,
        duration: actualDuration,
      });
      alert('Focus session completed! Great job!');
      resetSession();
      if (window.updateStats) {
        window.updateStats();
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  } else {
    // If session wasn't created yet, create it as completed (works for both task and general focus)
    try {
      await api.createSession({
        taskId: currentTaskId,
        duration: totalDuration - remainingSeconds,
        completed: true,
      });
      alert('Focus session completed! Great job!');
      resetSession();
      if (window.updateStats) {
        window.updateStats();
      }
    } catch (error) {
      console.error('Error completing session:', error);
    }
  }
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
  remainingSeconds = totalDuration;
  isPlaying = false;
  currentTaskId = null;
  currentTaskName = '';
  audioLoopCount = 0;

  stopProgress();
  stopWhiteNoise();

  const playBtn = document.getElementById('masterPlayBtn');
  const playerWrapper = document.getElementById('playerWrapper');
  if (playBtn) playBtn.textContent = '▶';
  if (playerWrapper) playerWrapper.classList.remove('is-playing');

  document.getElementById('noSessionView').style.display = 'block';
  document.getElementById('focusMusicView').style.display = 'none';
  updateProgress();
}

function updateProgress() {
  // Progress bar: show remaining (drains as countdown)
  const remainingPercent = totalDuration > 0 ? (remainingSeconds / totalDuration) * 100 : 0;
  const progressFill = document.getElementById('progressFill');
  const progressHandle = document.getElementById('progressHandle');

  if (progressFill) progressFill.style.width = remainingPercent + '%';
  if (progressHandle) progressHandle.style.left = remainingPercent + '%';

  // Countdown display: remaining time
  const countdownEl = document.getElementById('focusCountdown');
  const remainingMins = Math.floor(remainingSeconds / 60);
  const remainingSecs = remainingSeconds % 60;
  if (countdownEl) {
    countdownEl.textContent = `${remainingMins}:${remainingSecs.toString().padStart(2, '0')}`;
  }
}

function seekProgress(event) {
  const bar = event.currentTarget;
  const rect = bar.getBoundingClientRect();
  const percent = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
  const newTime = Math.floor((percent / 100) * totalDuration);
  remainingSeconds = totalDuration - newTime;
  updateProgress();
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  // Visual feedback can be added here
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  // Visual feedback can be added here
}

function previousTrack() {
  remainingSeconds = totalDuration;
  updateProgress();
}

function nextTrack() {
  remainingSeconds = 0;
  updateProgress();
  if (isPlaying) {
    completeSession();
  }
}

function setVolume(event) {
  const bar = event.currentTarget;
  const rect = bar.getBoundingClientRect();
  volume = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
  const volumeFill = document.getElementById('volumeFill');
  const volumeHandle = document.getElementById('volumeHandle');
  const volumePercent = document.getElementById('volumePercent');

  if (volumeFill) volumeFill.style.width = volume + '%';
  if (volumeHandle) volumeHandle.style.left = volume + '%';
  if (volumePercent) volumePercent.textContent = Math.round(volume) + '%';

  // Sync white noise volume
  if (whiteNoiseAudio) {
    whiteNoiseAudio.volume = volume / 100;
  }
}

window.startFocusSession = startFocusSession;
