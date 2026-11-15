// The supplied MP3 is a short character message, not a reading of the adjacent
// science paragraphs. Show its exact transcript and original audio language.
export function createStoryVoice({ transcript, onPlay, onStop, document: doc = document }) {
  const root = doc.createElement('section');
  root.className = 'story-voice-player';
  const button = doc.createElement('button');
  button.type = 'button';
  button.className = 'secondary';
  button.dataset.storyVoice = '';
  const language = doc.createElement('span');
  language.className = 'fine';
  language.textContent = 'English recording · character message';
  const words = doc.createElement('blockquote');
  words.textContent = transcript;
  words.hidden = true;
  const status = doc.createElement('p');
  status.className = 'fine';
  status.setAttribute('role', 'status');
  status.hidden = true;
  let playing = false;
  const update = state => {
    playing = state === 'playing' || state === 'loading';
    button.textContent = playing ? 'Stop my message' : 'Hear my message';
    button.setAttribute('aria-pressed', String(playing));
    root.classList.toggle('is-playing', playing);
    if (state === 'blocked' || state === 'unavailable') {
      status.hidden = false;
      status.textContent = 'Audio could not play. Try again or read my message below.';
    } else status.hidden = true;
  };
  const click = () => {
    if (playing) { onStop(); update('idle'); return; }
    words.hidden = false;
    update('loading');
    onPlay();
  };
  button.addEventListener('click', click);
  root.append(button, language, words, status);
  update('idle');
  return { root, update, dispose() { button.removeEventListener('click', click); root.remove(); } };
}
