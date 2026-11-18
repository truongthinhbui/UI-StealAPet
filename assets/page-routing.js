(function () {
  'use strict';
  function init() {
    const tabs = [...document.querySelectorAll('.prototypeTabs button[data-tab]:not(:disabled)')];
    const routes = new Map(tabs.map(button => [button.dataset.tab.replace(/^tab-/, ''), button]));
    let restoring = false;
    function activeRoute() {
      const button = tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0];
      const route = button.dataset.tab.replace(/^tab-/, '');
      const pane = document.getElementById(button.dataset.tab);
      if (route === 'fishing') {
        const view = pane.querySelector('[data-fishing-view][aria-selected="true"]');
        return route + (view?.dataset.fishingView === 'simulation' ? '/simulation' : '');
      }
      const sub = pane.querySelector('.lbSubBtn[aria-selected="true"]');
      return route + (sub ? '/' + encodeURIComponent(sub.dataset.sub) : '');
    }
    function save(replace = false) {
      if (restoring) return;
      const hash = '#/' + activeRoute();
      if (location.hash === hash) return;
      history[replace ? 'replaceState' : 'pushState'](null, '', location.pathname + location.search + hash);
    }
    function restore() {
      const [rawRoute, sub] = location.hash.replace(/^#\/?/, '').split('/');
      const route = rawRoute === 'tab-fishing-lab' || rawRoute === 'fishing-lab' ? 'fishing' : rawRoute.replace(/^tab-/, '');
      const button = routes.get(route) || routes.get('fishing') || tabs[0];
      restoring = true;
      try {
        button.click();
        const pane = document.getElementById(button.dataset.tab);
        if (button.dataset.tab === 'tab-fishing') {
          const view = sub === 'simulation' || rawRoute.endsWith('fishing-lab') ? 'simulation' : 'play';
          pane.querySelector('[data-fishing-view="' + view + '"]')?.click();
        } else {
          let decoded = '';
          try { decoded = decodeURIComponent(sub || ''); } catch {}
          const options = [...pane.querySelectorAll('.lbSubBtn')];
          const selected = options.find(option => option.dataset.sub === decoded) || options[0];
          selected?.click();
        }
      } finally { restoring = false; }
      save(true);
    }
    document.addEventListener('click', event => {
      if (event.target.closest('.prototypeTabs button[data-tab]:not(:disabled), [data-fishing-view], .lbSubBtn')) save();
    });
    // Fishing's arrow-key navigation changes its nested view without a click.
    document.addEventListener('keydown', event => {
      if (event.target.closest('.fishingSubtabs') && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) save();
    });
    window.addEventListener('hashchange', restore);
    restore();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
