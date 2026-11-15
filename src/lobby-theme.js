import { t } from './i18n.js';
export const LOBBY_THEME_KEY = 'mission-alive-lobby-theme-v1';
export function readLobbyTheme(storage) {
  try { storage ??= globalThis.localStorage; return storage?.getItem(LOBBY_THEME_KEY) === 'dark' ? 'dark' : 'light'; }
  catch { return 'light'; }
}
export function mountLobbyTheme() {
  let theme;
  try { theme = readLobbyTheme(); } catch { theme = 'light'; }
  const button = document.querySelector('#lobby-theme');
  const lobby = document.querySelector('#lobby');
  const pages = document.querySelector('#academy-page');
  const sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>';
  const moon = '<path d="M20.5 14A9 9 0 0 1 10 3.5 9 9 0 1 0 20.5 14Z"/>';
  const apply = () => {
    const visible = (!lobby.hidden || !pages.hidden) && document.body.dataset.exhibit === 'lobby';
    document.body.classList.toggle('lobby-screen', visible);
    document.body.classList.toggle('lobby-day', visible && theme === 'light');
    const label = theme === 'light' ? 'Use Moon mode' : 'Use Sun mode';
    button.setAttribute('aria-label', t(label));
    button.setAttribute('title', t(label));
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${theme === 'light' ? sun : moon}</svg>`;
  };
  button.onclick = () => {
    theme = theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(LOBBY_THEME_KEY, theme); } catch { /* Session-only is fine. */ }
    apply();
  };
  const observer = new MutationObserver(apply);
  observer.observe(document.body, {attributes: true, attributeFilter: ['data-exhibit']});
  observer.observe(lobby, {attributes: true, attributeFilter: ['hidden']});
  observer.observe(pages, {attributes: true, attributeFilter: ['hidden']});
  apply();
}
