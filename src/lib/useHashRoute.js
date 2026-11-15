import { useCallback, useSyncExternalStore } from 'react';

const ROUTE_EVENT = 'earthsync:route';
const ROUTES = ['home', 'about', 'download'];

function readRoute() {
  const hash = window.location.hash;
  if (hash.indexOf('#/about') === 0) return 'about';
  if (hash.indexOf('#/download') === 0) return 'download';
  return 'home';
}

function subscribe(onChange) {
  window.addEventListener('popstate', onChange);
  window.addEventListener('hashchange', onChange);
  window.addEventListener(ROUTE_EVENT, onChange);
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener('hashchange', onChange);
    window.removeEventListener(ROUTE_EVENT, onChange);
  };
}

function hashFor(route) {
  return '#/' + (route === 'home' ? '' : route);
}

export function useHashRoute() {
  const route = useSyncExternalStore(subscribe, readRoute, () => 'home');

  const navigate = useCallback((next, { push = true } = {}) => {
    if (!ROUTES.includes(next)) return;
    if (push && window.location.hash !== hashFor(next)) {
      window.history.pushState(null, '', hashFor(next));
    }
    window.dispatchEvent(new Event(ROUTE_EVENT));
  }, []);

  return [route, navigate];
}

export { readRoute };
