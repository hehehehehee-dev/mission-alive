export const FEEDBACK_SHEET_ID = '1VpaHPB1zAnjOdhKy4N7So32Ikwc0vQ3CsnZ8hrIl6O4';
export const RESPONSE_GID = '1917228454';
export const questions = Object.freeze({
  timestamp: 'Timestamp',
  interestBefore: 'Before you played, how interested were you in space?',
  interestAfter: 'After playing, how interested are you in space now?',
  belongingBefore: 'Before you played, how much did you feel space was "for people like me"?',
  belongingAfter: 'After playing, how much do you feel that now?',
  learnMore: 'After playing, I want to learn more about space.',
  recommend: 'I would tell a friend to try this.',
  finished: 'Did you finish all six trainings?',
});
const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
const allowed = new Set(Object.values(questions).map(normalize));

// CSV quotes, doubled quotes, commas and embedded newlines are all supported.
export function parseCsv(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { cell += '"'; i++; }
      else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(cell); cell = ''; }
    else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += char;
  }
  if (quoted) throw new Error('Invalid CSV');
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
function columnName(index) {
  let name = '';
  for (index++; index; index = Math.floor((index - 1) / 26)) name = String.fromCharCode(65 + (index - 1) % 26) + name;
  return name;
}
export function selectedColumns(headers) {
  return headers.flatMap((header, index) => allowed.has(normalize(header)) ? [columnName(index)] : []);
}
function score(row, indexes) {
  const values = indexes.map(index => normalize(row[index])).filter(Boolean);
  if (!values.length || values.some(value => !/^[1-5](?:\.0+)?$/.test(value)) || new Set(values.map(Number)).size !== 1) return null;
  return Number(values[0]);
}
export function aggregateImpact(rows, fetchedAt = new Date().toISOString()) {
  const headers = rows[0]?.map(normalize) || [];
  if (!headers.includes(questions.timestamp)) throw new Error('Response headers unavailable');
  // A projection is required: never accept ages or short-answer columns.
  if (headers.some(header => !allowed.has(header))) throw new Error('Unexpected response column');
  const positions = key => headers.flatMap((header, index) => header === questions[key] ? [index] : []);
  const timestamp = headers.indexOf(questions.timestamp);
  const responses = rows.slice(1).filter(row => normalize(row[timestamp]));
  const round = value => Math.round(value * 100) / 100;
  const paired = (before, after) => {
    const samples = responses.flatMap(row => {
      const pre = score(row, positions(before)), post = score(row, positions(after));
      return pre === null || post === null ? [] : [{pre, post}];
    });
    if (!samples.length) return { n: 0, before: null, after: null, change: null, improved: 0 };
    const mean = key => samples.reduce((sum, item) => sum + item[key], 0) / samples.length;
    return { n: samples.length, before: round(mean('pre')), after: round(mean('post')), change: round(mean('post') - mean('pre')), improved: samples.filter(item => item.post > item.pre).length };
  };
  const agreement = key => {
    const samples = responses.map(row => score(row, positions(key))).filter(value => value !== null);
    return {n: samples.length, agree: samples.filter(value => value >= 4).length};
  };
  const completion = responses.map(row => normalize(row[positions('finished')[0]]).toLowerCase()).filter(value => value === 'yes' || value === 'no');
  return { fetchedAt, totalResponses: responses.length, interest: paired('interestBefore', 'interestAfter'), belonging: paired('belongingBefore', 'belongingAfter'), learnMore: agreement('learnMore'), recommend: agreement('recommend'), completion: {n: completion.length, yes: completion.filter(value => value === 'yes').length} };
}
export function createImpactLoader({fetcher = fetch, now = () => Date.now()} = {}) {
  let cached = null, expires = 0, pending = null;
  const csv = async query => {
    const url = new URL(`https://docs.google.com/spreadsheets/d/${FEEDBACK_SHEET_ID}/gviz/tq`);
    url.search = new URLSearchParams({gid: RESPONSE_GID, tqx: 'out:csv', headers: '1', tq: query});
    const response = await fetcher(url, {signal: AbortSignal.timeout(12000)});
    if (!response.ok) throw new Error('Response sheet unavailable');
    const text = await response.text();
    if (text.length > 5 * 1024 * 1024 || /^\s*</.test(text)) throw new Error('Invalid sheet response');
    return parseCsv(text.replace(/^\uFEFF/, ''));
  };
  return async () => {
    if (cached && now() < expires) return cached;
    if (pending) return pending;
    pending = (async () => {
      // Discover headers without reading response rows, then request ONLY the
      // named closed questions. Ages and short answers never enter the payload.
      const headerRows = await csv('select * limit 0');
      const columns = selectedColumns(headerRows[0] || []);
      if (!columns.length) throw new Error('Response headers unavailable');
      const result = aggregateImpact(await csv(`select ${columns.join(',')}`), new Date(now()).toISOString());
      cached = result; expires = now() + 60000;
      return result;
    })();
    try { return await pending; } finally { pending = null; }
  };
}
