import { initTasks } from './tasks.js';
import { initFocus } from './focus.js';
import { initStats } from './stats.js';

function initNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const pages = document.querySelectorAll('.page');

  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetPage = tab.dataset.page;

      navTabs.forEach((t) => t.classList.remove('active'));
      pages.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`${targetPage}Page`).classList.add('active');

      if (targetPage === 'stats') {
        window.updateStats?.();
      }
      if (targetPage === 'tasks') {
        window.loadTasks?.();
      }
    });
  });
}

function init() {
  initNavigation();
  initTasks();
  initFocus();
  initStats();
}

document.addEventListener('DOMContentLoaded', init);
