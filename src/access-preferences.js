export const ACCESS_PREFERENCES_KEY = 'mission-alive-display-v1';

export function readAccessPreferences(storage) {
  try {
    storage ??= globalThis.localStorage;
    const saved = JSON.parse(storage?.getItem(ACCESS_PREFERENCES_KEY) || '{}');
    return { contrast: saved?.contrast === true, textSize: saved?.textSize === 'large' ? 'large' : 'standard' };
  } catch { return { contrast: false, textSize: 'standard' }; }
}

export function mountAccessPreferences({ trigger, dialog, getReduced, setReduced }) {
  const preferences = readAccessPreferences();
  dialog.innerHTML = `<div class="access-heading"><div><p class="eyebrow">MAKE YOURSELF AT HOME</p><h2 id="access-title">Display & access</h2></div><button type="button" class="access-close" aria-label="Close display settings">×</button></div>
    <p>Choose what works for you. These settings stay in this browser.</p>
    <label class="access-choice"><span><strong>Higher contrast</strong><small>Solid backgrounds and stronger outlines.</small></span><input id="access-contrast" type="checkbox"></label>
    <label class="access-choice"><span><strong>Larger text</strong><small>Increase text size throughout the academy.</small></span><input id="access-large-text" type="checkbox"></label>
    <label class="access-choice"><span><strong>Reduce motion</strong><small>Pause moving backgrounds and skip animated transitions.</small></span><input id="access-motion" type="checkbox"></label>
    <div class="access-help"><h3>Your controls, your pace</h3><p>Use Tab to move between controls and Enter or Space to activate a button. Every challenge has a way to play without dragging.</p><p>Curiosity has a text map and Step button. Ingenuity offers step-by-step flight. Webb has direction buttons. Voyager accepts written greetings.</p><p>Sound is optional. Use your browser’s zoom controls whenever you need them.</p></div>
    <button type="button" class="primary access-done">Back to the academy</button>`;
  const contrast = dialog.querySelector('#access-contrast');
  const larger = dialog.querySelector('#access-large-text');
  const motion = dialog.querySelector('#access-motion');
  const apply = () => {
    document.body.classList.toggle('high-contrast', preferences.contrast);
    document.documentElement.dataset.textSize = preferences.textSize;
    contrast.checked = preferences.contrast;
    larger.checked = preferences.textSize === 'large';
  };
  const save = () => { apply(); try { localStorage.setItem(ACCESS_PREFERENCES_KEY, JSON.stringify(preferences)); } catch { /* Session-only settings still work. */ } };
  contrast.onchange = () => { preferences.contrast = contrast.checked; save(); };
  larger.onchange = () => { preferences.textSize = larger.checked ? 'large' : 'standard'; save(); };
  motion.onchange = () => setReduced(motion.checked);
  trigger.onclick = () => { motion.checked = getReduced(); dialog.showModal(); dialog.querySelector('.access-close').focus(); };
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, input')].filter(control => !control.disabled && control.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  for (const button of dialog.querySelectorAll('.access-close, .access-done')) button.onclick = () => dialog.close();
  dialog.addEventListener('close', () => trigger.focus({ preventScroll: true }));
  apply();
  return { syncMotion() { motion.checked = getReduced(); } };
}
