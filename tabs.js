(() => {
  const nav = document.querySelector('.page-tabs');
  const tabs = [...nav.querySelectorAll('[data-tab]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  const aliases = { demo: 'home', overview: 'home', industries: 'home', challenges: 'solutions' };
  nav.setAttribute('role', 'tablist');
  tabs.forEach(tab => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `${tab.dataset.tab}-panel`);
  });
  panels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', `tab-${panel.dataset.panel}`);
    panel.tabIndex = 0;
  });
  function activate() {
    const hash = location.hash.slice(1);
    const key = aliases[hash] || (tabs.some(t => t.dataset.tab === hash) ? hash : 'home');
    tabs.forEach(tab => {
      const selected = tab.dataset.tab === key;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => {
      panel.hidden = panel.dataset.panel !== key;
      if (panel.hidden) panel.querySelectorAll('video').forEach(video => video.pause());
    });
    if (aliases[hash]) document.getElementById(hash)?.scrollIntoView();
    else window.scrollTo({ top: 0, behavior: 'instant' });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => {
      event.preventDefault();
      if (location.hash !== tab.hash) history.pushState(null, '', tab.hash);
      activate();
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) {
        event.preventDefault();
        tabs[next].focus();
        tabs[next].click();
      } else if (event.key === ' ') {
        event.preventDefault();
        tab.click();
      }
    });
  });
  window.addEventListener('hashchange', activate);
  window.addEventListener('popstate', activate);
  activate();
})();
