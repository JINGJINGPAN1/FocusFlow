import { initTasks } from './tasks.js';
import { initFocus, onLeaveFocusPage } from './focus.js';
import { initStats } from './stats.js';

function initNavigation() {
  const appLayout = document.querySelector('.app-layout');
  const navTabs = document.querySelectorAll('.sidebar-nav-item');
  const pages = document.querySelectorAll('.page');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function closeSidebar() {
    appLayout?.classList.remove('sidebar-open');
  }

  sidebarToggle?.addEventListener('click', () => {
    appLayout?.classList.toggle('sidebar-open');
  });

  sidebarBackdrop?.addEventListener('click', closeSidebar);

  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetPage = tab.dataset.page;
      const wasOnFocus = document.getElementById('focusPage')?.classList.contains('active');

      navTabs.forEach((t) => t.classList.remove('active'));
      pages.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      document.getElementById(`${targetPage}Page`).classList.add('active');

      if (wasOnFocus && targetPage !== 'focus') {
        onLeaveFocusPage?.();
      }
      if (targetPage === 'stats') {
        window.updateStats?.();
      }
      if (targetPage === 'tasks') {
        window.loadTasks?.();
      }
      closeSidebar();
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
