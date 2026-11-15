import { getLanguage, t } from './i18n.js';
export function mountImpact(root, {fetcher = fetch, setTimer = setInterval, clearTimer = clearInterval} = {}) {
  let alive = true, snapshot = null, pending = false;
  const lifetime = new AbortController();
  const status = root.querySelector('[data-impact-status]');
  const results = root.querySelector('[data-impact-results]');
  const format = value => new Intl.NumberFormat(getLanguage(), {maximumFractionDigits:2}).format(value);
  const percent = (value, total) => new Intl.NumberFormat(getLanguage(), {style:'percent', maximumFractionDigits:0}).format(value / total);
  const render = () => {
    results.replaceChildren();
    if (!snapshot) return;
    status.textContent = snapshot.totalResponses ? 'Results from voluntary playtest responses.' : 'No responses yet. Results will appear here automatically.';
    const card = (label, value) => {
      const article = document.createElement('article'); article.className = 'impact-metric';
      const title = document.createElement('h2'); title.textContent = label;
      const number = document.createElement('strong'); number.textContent = value;
      article.append(title, number); results.append(article);
    };
    card('Survey responses', format(snapshot.totalResponses));
    for (const [key, label] of [['interest','Interest in space'], ['belonging','Feeling that space is for me']]) {
      const metric = snapshot[key];
      if (!metric?.n) continue;
      card(label, `${format(metric.after)} / 5`);
    }
    for (const [key, label, numerator] of [['learnMore','Want to learn more','agree'], ['recommend','Would recommend to a friend','agree'], ['completion','Finished all six missions (self-reported)','yes']]) {
      const metric = snapshot[key];
      if (!metric?.n) continue;
      card(label, percent(metric[numerator], metric.n));
    }
    root.querySelector('[data-impact-updated]').textContent = `${t('Data checked:')} ${new Intl.DateTimeFormat(getLanguage(), {dateStyle:'medium',timeStyle:'short'}).format(new Date(snapshot.fetchedAt))}`;
  };
  const refresh = async () => {
    if (pending || !alive) return;
    pending = true;
    status.textContent = 'Checking playtest responses…';
    try {
      const response = await fetcher('/api/playtest-impact', {signal:lifetime.signal, cache:'no-store'});
      if (!response.ok) throw Error('Unavailable');
      const data = await response.json();
      if (!Number.isInteger(data.totalResponses) || data.totalResponses < 0 || !Number.isFinite(Date.parse(data.fetchedAt))) throw Error('Invalid data');
      if (!alive) return;
      snapshot = data; render();
    } catch {
      if (!alive) return;
      snapshot = null; results.replaceChildren();
      root.querySelector('[data-impact-updated]').textContent = '';
      status.textContent = 'Results are unavailable right now. Try again shortly.';
    } finally { pending = false; }
  };
  const retry = root.querySelector('[data-impact-refresh]');
  retry.addEventListener('click', refresh);
  window.addEventListener('mission-language-change', render);
  const timer = setTimer(() => { if (!document.hidden) refresh(); }, 300000);
  refresh();
  return {dispose() {alive = false; lifetime.abort(); clearTimer(timer); retry.removeEventListener('click',refresh); window.removeEventListener('mission-language-change',render);}};
}
