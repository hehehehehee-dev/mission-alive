import { machineStories } from './machine-stories.js';
import { machineParts } from './machine-parts.js';
import { hiddenFacts } from './hidden-facts.js';
import { missionHistory } from './mission-history.js';
import { moonStories } from './moon-stories.js';
import { marsSounds } from './mars-sounds.js';
import { greetings, greetingSource } from './greetings-catalog.js';
import { t } from './i18n.js';
import { projectTools, siDisclosure } from './project-attribution.js';

const image = (id, title, credit, source, file, original, usedIn, kind = 'Photograph', presentation = 'Original file; displayed at a smaller size.') => ({
  id, category: 'images', title, credit, source, files: [file], original,
  usedIn, kind, presentation, preview: file.startsWith('/assets/') ? file : null,
});

// Public catalog: add every external asset here before using it in the app.
export const resourceCredits = [
  { id: 'public-sans', category: 'science', kind: 'Typography', title: 'Public Sans · interface typography', credit: 'The Public Sans Project Authors · SIL Open Font License 1.1', source: 'https://www.nasa.gov/nasa-brand-center/brand-guidelines/', original: 'https://raw.githubusercontent.com/google/fonts/main/ofl/publicsans/PublicSans%5Bwght%5D.ttf', files: ['/fonts/PublicSans-Variable.ttf', '/fonts/PublicSans-OFL.txt'], usedIn: ['Entire academy', 'Certificate'], presentation: "Self-hosted variable font. NASA Horizon uses Public Sans for body text and interfaces. Mission Alive uses one font family throughout; this does not imply NASA endorsement." },
  image('earth', 'Earth · Blue Marble 2002', "NASA's Earth Observatory", 'https://science.nasa.gov/resource/blue-marble-2002/', '/assets/journey-earth-nasa.jpg', 'https://assets.science.nasa.gov/content/dam/science/psd/solar/2023/09/1/1-bluemarble_west-1.jpg', ['Lobby', 'Journey map'], 'Composite image', 'NASA composite; circular crop and a soft shadow in the map.'),
  image('pale-blue-dot', 'Voyager · Pale Blue Dot Revisited', 'NASA / JPL-Caltech', 'https://science.nasa.gov/photojournal/pale-blue-dot-revisited/', '/assets/voyager-pale-blue-dot.jpg', 'https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia23/pia23645/PIA23645.jpg', ['Voyager 1', 'Mission view', 'Graduation'], 'Photograph', 'Voyager 1 photograph from 14 February 1990, reprocessed by NASA in 2020. Original JPEG preserved; an overlay identifies Earth without changing the image file.'),
  image('moon-map', 'Moon · LRO surface map', "NASA's Scientific Visualization Studio / LRO / LROC", 'https://svs.gsfc.nasa.gov/4720/', '/assets/journey-moon-lroc.jpg', 'https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_2k.jpg', ['Journey map'], 'Surface map', 'NASA surface map projected onto a sphere, with simulated lighting.'),
  image('mars-map', 'Mars · Viking surface map', 'NASA / JPL / Caltech / USGS', 'https://space.jpl.nasa.gov/tmaps/mars.html', '/assets/journey-mars-viking.jpg', 'https://space.jpl.nasa.gov/tmaps/pix/mar0kuu2.jpg', ['Journey map'], 'Surface map', 'NASA surface map projected onto a sphere, with simulated lighting.'),
  image('sun', 'Sun · SDO/AIA 171 Å · 10 September 2025', 'NASA / GSFC / Solar Dynamics Observatory', 'https://science.nasa.gov/photojournal/image-of-sun-from-nasas-solar-dynamics-observatory/', '/assets/journey-sun-sdo.jpg', 'https://assets.science.nasa.gov/content/dam/science/psd/photojournal/pia/pia26/pia26681/PIA26681.jpg', ['Journey map'], 'Observation', 'Extreme-ultraviolet observation shown in gold false color. The map uses a soft edge mask; the original file is preserved.'),
  image('webb-esa', 'Webb · spacecraft artist’s impression', '©ESA / ATG medialab', 'https://www.esa.int/ESA_Multimedia/Images/2021/06/Webb_spacecraft_artist_s_impression', '/assets/journey-webb-esa.png', 'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2021/06/webb_spacecraft_artist_s_impression/23320227-1-eng-GB/Webb_spacecraft_artist_s_impression.png', ['Journey map'], 'Official illustration'),
  image('webb-nasa', 'Webb · NASA artist’s concept', 'NASA-GSFC, Adriana Gutierrez (CI Lab)', 'https://science.nasa.gov/asset/webb/james-webb-space-telescope-artist-conception/', '/assets/journey-webb-nasa.jpg', 'https://assets.science.nasa.gov/content/dam/science/missions/webb/science/2022/06/STScI-01G1Q6WDRH19AMC8NXMRFSTBH6.png/jcr:content/renditions/2048x1593.jpg', ['Sources & credits'], 'Official illustration', 'NASA’s published 2048 × 1593 JPEG rendition; no content edits.'),
  image('lobby-galaxies', 'Galaxy fly-through backdrop', "NASA's Goddard Space Flight Center / Conceptual Image Lab", 'https://svs.gsfc.nasa.gov/14950/', '/assets/lobby-galaxies.jpg', 'https://svs.gsfc.nasa.gov/vis/a010000/a014900/a014950/14950_Galaxies_FlyThrough_Still.jpg', ['Lobby'], 'Visualization', 'NASA visualization, dimmed and gently moved behind the interface.'),
  image('curiosity-panorama', 'Curiosity · Gale Crater panorama', "NASA's Jet Propulsion Laboratory", 'https://svs.gsfc.nasa.gov/31140/', '/assets/curiosity-gale-panorama.jpg', 'https://svs.gsfc.nasa.gov/vis/a030000/a031100/a031140/PIA23632_M34_projection_pan_00000_print.jpg', ['Curiosity'], 'Composite image', 'NASA panorama, cropped and dimmed as a background.'),
  image('ingenuity-aerial', 'Ingenuity · first aerial color image', 'NASA / JPL-Caltech', 'https://science.nasa.gov/resource/first-aerial-color-image-of-mars/', '/assets/ingenuity-aerial.jpg', null, ['Ingenuity'], 'Photograph', 'NASA image resized to 1600 × 1186 and converted to JPEG. The exact original download URL was not retained.'),
  image('voyager-heliosphere', 'Voyager · heliosphere visualization', "NASA's Scientific Visualization Studio / NASA / JPL-Caltech", 'https://svs.gsfc.nasa.gov/13544/', '/assets/voyager-heliosphere.jpg', 'https://svs.gsfc.nasa.gov/vis/a010000/a013500/a013544/voyager_location_pull_out_from_solar_system_still_copy.jpg', ['Voyager 1'], 'Visualization', 'NASA visualization, dimmed as a background.'),
  image('webb-atmosphere', 'Webb · deep-field backdrop', 'NASA / ESA / CSA / STScI', 'https://svs.gsfc.nasa.gov/31186/', '/assets/webb-deep-field.jpg', 'https://svs.gsfc.nasa.gov/vis/a030000/a031100/a031186/deep-field_00439_print.jpg', ['Webb'], 'Composite image', 'NASA visualization still, dimmed as a background.'),
  image('alignment-mosaic', 'Webb · eighteen images of HD 84406', 'NASA', 'https://science.nasa.gov/blogs/webb/2022/02/11/photons-received-webb-sees-its-first-star-18-times/', '/assets/webb-hd84406-18-dots-mosaic.jpg', 'https://science.nasa.gov/wp-content/uploads/2022/02/alignment_mosaic_compressed.png', ['Webb'], 'Observation', 'NASA mosaic converted from PNG to JPEG, without cropping or changing content.'),
  image('mirror-selfie', 'Webb · primary mirror selfie', 'NASA', 'https://science.nasa.gov/blogs/webb/2022/02/11/photons-received-webb-sees-its-first-star-18-times/', '/assets/webb-primary-mirror-selfie.png', null, ['Webb'], 'Photograph', 'NASA engineering image. The official source page is linked; the exact original download URL was not retained.'),
  image('hexagonal-array', 'Webb · hexagonal star array', 'NASA / STScI / J. DePasquale', 'https://science.nasa.gov/blogs/webb/2022/02/18/webb-team-brings-18-dots-of-starlight-into-hexagonal-formation/', '/assets/webb-hd84406-hexagonal-array.jpg', 'https://science.nasa.gov/wp-content/uploads/2022/02/webb_img_array_noLabels_sm.jpeg', ['Webb'], 'Observation'),
  image('first-deep-field', 'Webb · First Deep Field · SMACS 0723', 'NASA / ESA / CSA / STScI', 'https://science.nasa.gov/asset/webb/webbs-first-deep-field-nircam-image/', '/assets/webb-first-deep-field-smacs0723.png', 'https://assets.science.nasa.gov/content/dam/science/missions/webb/science/2022/07/STScI-01G8H1K2BCNATEZSKVRN9Z69SR.png/jcr:content/renditions/1960x2000.png', ['Journey map', 'Webb'], 'Composite image', 'NASA’s published PNG rendition. Also dimmed behind the journey map.'),
  image('apollo17', 'Apollo 17 · Gene Cernan and the lunar rover', 'NASA / Harrison Schmitt', moonStories.apollo17.reveal.source[1], moonStories.apollo17.reveal.image, null, ['Moon prologue'], 'Photograph', 'Official NASA photograph. The source page is linked; the exact original download URL was not retained.'),
  image('surveyor3', 'Surveyor 3 · photographed by Apollo 12', 'NASA / JSC', moonStories.surveyor3.reveal.source[1], moonStories.surveyor3.reveal.image, null, ['Moon prologue'], 'Photograph', 'Official NASA photograph. The source page is linked; the exact original download URL was not retained.'),
  image('apollo17-fender', 'Apollo 17 · repaired lunar rover fender', 'Apollo 17, NASA', 'https://science.nasa.gov/image-article/apod-2004-april-17-lunar-dust-and-duct-tape/', '/assets/moon-apollo17-fender-repair.jpg', 'https://assets.science.nasa.gov/content/dam/science/cds/apod/apod/2004/april/ducttape_apollo17_big.jpg', ['Moon labs'], 'Photograph', 'NASA photograph, preserved without content edits. Displayed after a successful repair simulation.'),
  { id: 'lrv-lab-model', category: 'science', kind: 'Original simulation', title: 'Lunar rover fender lab · Mission Alive', credit: 'Mission Alive', source: 'https://science.nasa.gov/image-article/apod-2004-april-17-lunar-dust-and-duct-tape/', files: ['src/moon-lrv-game.js', 'src/moon-labs.js'], usedIn: ['Moon labs'], presentation: 'Original SVG illustrations, imagined Moon-machine final transmissions, and simplified dust-path rules. Game dimensions and pass criteria are invented for learning, not NASA measurements.' },
  { id: 'surveyor-lab-model', category: 'science', kind: 'Original simulation', title: 'Lunar soil lab · Mission Alive', credit: 'Mission Alive', source: 'https://science.nasa.gov/mission/surveyor-3/', files: ['src/moon-surveyor-game.js'], usedIn: ['Moon labs'], presentation: 'Original SVG illustrations and a dimensionless soil model. Fictional soil patches and adjustable footpads are learning tools, not Surveyor telemetry or real Apollo landing settings.' },
  image('record-front', 'Voyager · Golden Record front', 'NASA / JPL-Caltech', 'https://science.nasa.gov/image-detail/voyager-gold-record-front/', 'src/assets/golden-record-front.jpg', 'https://science.nasa.gov/wp-content/uploads/2024/03/voyager-gold-record-front.jpg', ['Voyager 1']),
  image('record-cover', 'Voyager · Golden Record protective cover', 'NASA / JPL-Caltech', 'https://science.nasa.gov/mission/voyager/voyager-golden-record-overview/', 'src/assets/voyager-golden-record-cover.webp', null, ['Voyager 1'], 'Photograph', 'File supplied by the project owner; the official context page is linked. The original download was not retained.'),
  { id: 'voyager-film', category: 'images', kind: 'Video', title: 'Voyager · Solar System flyout', credit: "NASA's Scientific Visualization Studio / NASA / JPL-Caltech", source: 'https://svs.gsfc.nasa.gov/13544/', original: 'https://svs.gsfc.nasa.gov/vis/a010000/a013500/a013544/voyager_location_pull_out_from_solar_system_IPAD_high.webm', files: ['/assets/solar-system-flyout.webm'], usedIn: ['Voyager 1'], presentation: 'Original NASA video, played silently as an optional background.' },
  { id: 'horizons', category: 'data', kind: 'Live data', title: 'JPL Horizons', credit: 'NASA / JPL Solar System Dynamics', source: 'https://ssd-api.jpl.nasa.gov/doc/horizons.html', original: 'https://ssd.jpl.nasa.gov/api/horizons.api', usedIn: ['Voyager 1'], presentation: 'Earth-relative range and range-rate anchor an interpolated distance estimate; the status identifies unavailable or stale data.' },
  { id: 'dsn', category: 'data', kind: 'Live data', title: 'Deep Space Network Now', credit: 'NASA / JPL-Caltech', source: 'https://eyes.nasa.gov/apps/dsn-now/dsn.html', original: 'https://eyes.nasa.gov/dsn/data/dsn.xml', usedIn: ['Lobby', 'Voyager 1'], presentation: 'Active signals and NASA timestamps are checked before showing a contact.' },
  { id: 'flight-log', category: 'data', kind: 'Archive', title: 'Ingenuity · all 72 flights', credit: 'NASA / JPL-Caltech', source: 'https://science.nasa.gov/wp-content/uploads/2024/06/ingenuity-helicopter-flight-log.pdf', files: ['src/data/ingenuity-flights.json'], usedIn: ['Ingenuity'], presentation: 'Measurements transcribed from NASA’s final published flight log, dated 21 June 2024.' },
  { id: 'curiosity-archive', category: 'data', kind: 'Archive', title: 'Curiosity · NASA image archive', credit: 'NASA / JPL-Caltech / MSSS; each image retains its supplied credit', source: 'https://mars.nasa.gov/msl/multimedia/raw-images/', original: 'https://images-api.nasa.gov/search?q=Curiosity%20Mastcam%20Mars&media_type=image&year_start=2023&page_size=12', usedIn: ['Curiosity'], presentation: 'Each photo loaded in this visit is listed here with its NASA image ID, source, and supplied credit.' },
  { id: 'greetings', category: 'audio', kind: 'Audio archive', title: 'Voyager · 55 Golden Record greetings', credit: 'NASA / JPL-Caltech · Voyager Golden Record', source: greetingSource, files: ['golden-record-greetings/'], usedIn: ['Voyager 1'], presentation: 'Recordings supplied by the project owner, paired with NASA’s published language list and English translations. Individual recording provenance has not been independently authenticated.', languages: greetings.map(item => item.language) },
  ...marsSounds.map(clip => ({ id: `mars-${clip.id}`, category: 'audio', kind: 'Audio archive', title: clip.label, credit: 'NASA / JPL-Caltech · Perseverance', source: clip.source, files: [clip.file], usedIn: ['Curiosity'], presentation: clip.detail })),
];

for (const entry of resourceCredits) {
  if (['curiosity-panorama', 'ingenuity-aerial', 'first-deep-field'].includes(entry.id)) entry.usedIn.push('Mission view');
  if (['earth', 'moon-map', 'mars-map'].includes(entry.id)) entry.usedIn.push('Planet comparison');
  if (entry.id === 'surveyor3') entry.usedIn.push('Moon labs');
}

const archivePhotos = new Map();
export function registerArchivePhotoCredits(items) {
  for (const item of items) {
    archivePhotos.set(item.id, {
      id: `archive-${item.id}`, category: 'images', kind: 'Photograph',
      title: `Curiosity · ${item.id}`, credit: item.credit,
      source: `https://images.nasa.gov/details/${encodeURIComponent(item.id)}`,
      original: item.image, preview: item.image, usedIn: ['Curiosity'],
      presentation: 'Loaded from NASA’s image archive during this visit.',
    });
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('mission-resource-credits-updated'));
}

export function buildScienceCredits(facts = {}, quotes = []) {
  const groups = new Map();
  const add = (title, source, topic) => {
    if (!source) return;
    const found = groups.get(source);
    if (found) { if (!found.usedIn.includes(topic)) found.usedIn.push(topic); return; }
    groups.set(source, { id: `reference-${groups.size}`, category: 'science', kind: 'Mission reference', title, source, credit: source.includes('jpl.nasa.gov') ? 'NASA / JPL-Caltech' : source.includes('gsfc.nasa.gov') ? 'NASA / GSFC' : 'NASA', usedIn: [topic] });
  };
  for (const id of ['curiosity', 'ingenuity', 'webb', 'voyager']) {
    const label = id === 'voyager' ? 'Voyager 1' : id === 'webb' ? 'Webb' : id[0].toUpperCase() + id.slice(1);
    add(facts[id]?.source_title || label, facts[id]?.source_url, label);
    add(machineParts[id].sourceLabel, machineParts[id].source, label);
    machineStories[id].forEach(chapter => add(chapter.sourceLabel, chapter.source, label));
    hiddenFacts[id].forEach(fact => add(fact.label, fact.source, label));
  }
  missionHistory.forEach(event => add(event.title, event.source, event.mission));
  Object.values(moonStories).forEach(story => story.sources.forEach(([title, source]) => add(title, source, 'Moon prologue')));
  quotes.forEach(quote => add(quote.storyAttribution, quote.storySource, 'Mission quotations'));
  add(facts.distance?.source_title, facts.distance?.source_url, 'Voyager 1');
  add('NASA · Planetary Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/', 'Journey map');
  add('NASA · Compare Earth and the Moon', 'https://science.nasa.gov/moon/by-the-numbers/', 'Journey map');
  add('NASA · Mars spacecraft travel', 'https://science.nasa.gov/wp-content/uploads/2024/03/44745_mro-arrival.pdf', 'Journey map');
  add('NASA · Webb orbit', 'https://science.nasa.gov/mission/webb/orbit/', 'Journey map');
  add('NASA · Voyager light-day', 'https://science.nasa.gov/mission/voyager/voyager-1/voyager-1-what-is-a-light-day/', 'Journey map');
  add('NASA · Webb partnership', 'https://science.nasa.gov/mission/webb/webb-team/', 'Webb');
  add('NASA · Curiosity habitability', 'https://science.nasa.gov/resource/the-science-of-curiosity-seeking-signs-of-past-mars-habitability/', 'Curiosity');
  add('NASA · Webb first science images', 'https://science.nasa.gov/mission/webb/webbs-first-images/', 'Webb');
  add('NASA · Apollo 17 dust-shield repair', 'https://science.nasa.gov/image-article/apod-2004-april-17-lunar-dust-and-duct-tape/', 'Moon labs');
  add('NASA · Surveyor 3 soil experiments', 'https://science.nasa.gov/mission/surveyor-3/', 'Moon labs');
  add('NASA JPL · Surveyor 3 camera returned', 'https://www.jpl.nasa.gov/blog/2012/1/surveyor-3-camera-returned-from-the-moon', 'Moon labs');
  return [...groups.values()];
}

const escape = value => String(value ?? '').replace(/[&<>"']/g, value => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[value]);
const normalize = value => String(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const categories = [['all', 'All resources'], ['images', 'Images & film'], ['data', 'Data & APIs'], ['audio', 'Recordings'], ['science', 'Mission references'], ['tools', 'Tools & SI disclosure']];

export function mountResourceCredits(dialog, { facts, quotes = [], recordImages = {}, onFieldNotes = () => {} } = {}) {
  const science = buildScienceCredits(facts, quotes);
  let category = 'all';
  let query = '';
  let returnFocus;
  dialog.innerHTML = `<header class="credits-heading"><div><p class="eyebrow">THE PEOPLE AND MISSIONS BEHIND THE EXPERIENCE</p><h2 id="credits-title">Sources & credits</h2></div><button type="button" class="credits-close" aria-label="Close sources and credits">×</button></header>
    <div class="credits-intro"><p>Every image, recording, and data source has a story of its own. Explore the original work and the people who made it.</p><p class="fine">Mission Alive creates the training simulations, spacecraft models, crew ship, and first-person stories. Agency imagery and measurements are credited below. Illustrations and simulations are labeled separately from observations.</p></div>
    <section class="credits-si" aria-labelledby="credits-si-title"><h3 id="credits-si-title">How Mission Alive was made</h3><p>${siDisclosure}</p><p><a href="/project-references.md" download>Download project references</a> · <a href="/third-party-notices.txt" target="_blank" rel="noopener">Dependency inventory & licenses</a></p></section>
    <div class="credits-tools"><label class="sr-only" for="credits-search">Search sources and credits</label><input id="credits-search" type="search" placeholder="Search NASA, Webb, Sun, audio…"><div class="credits-filters" role="group" aria-label="Filter resource types">${categories.map(([id, title]) => `<button type="button" data-credit-filter="${id}" aria-pressed="${id === 'all'}">${title}</button>`).join('')}</div><output id="credits-count" role="status"></output></div>
    <div class="credits-grid" id="credits-results"></div><div class="credits-end"><button type="button" data-credit-notes>Mission field notes →</button><p class="fine">Independent educational project. NASA, ESA, CSA, STScI, and other credited organizations do not endorse Mission Alive.</p><p class="fine">The machine voices were generated with ElevenLabs; interface sound effects are synthesized by Mission Alive. They are not NASA recordings.</p><a href="https://www.nasa.gov/nasa-brand-center/images-and-media/" target="_blank" rel="noopener">NASA media guidance ↗</a><a href="https://www.esa.int/ESA_Multimedia/Terms_and_conditions_of_use_of_images_and_videos_available_on_the_esa_website" target="_blank" rel="noopener">ESA media terms ↗</a></div>`;
  const grid = dialog.querySelector('#credits-results');
  const draw = () => {
    const entries = [...resourceCredits, ...archivePhotos.values(), ...science, ...projectTools];
    const needle = normalize(query);
    const shown = entries.filter(entry => (category === 'all' || entry.category === category) && normalize([entry.title, t(entry.title), entry.credit, entry.kind, t(entry.kind), ...entry.usedIn, ...entry.usedIn.map(label => t(label))].join(' ')).includes(needle));
    grid.innerHTML = shown.map(entry => {
      const preview = recordImages[entry.id] || entry.preview;
      return `<article class="credit-card" data-credit-id="${escape(entry.id)}" data-credit-category="${entry.category}">
        ${preview ? `<a class="credit-preview" href="${escape(entry.source)}" target="_blank" rel="noopener" aria-label="Open official source"><img src="${escape(preview)}" alt="${escape(entry.title)}" loading="lazy" decoding="async"></a>` : ''}
        <div class="credit-content"><p class="eyebrow">${entry.kind}</p><h3>${escape(entry.title)}</h3><p class="credit-byline" data-i18n-skip>${escape(entry.credit)}</p><p class="credit-use"><span>Used in:</span> ${entry.usedIn.map(label => `<span>${escape(label)}</span>`).join(' · ')}</p>
        ${entry.presentation ? `<p class="credit-description">${escape(entry.presentation)}</p>` : ''}
        <div class="credit-links"><a href="${escape(entry.source)}" target="_blank" rel="noopener">${entry.kind === 'Original simulation' ? 'Scientific context' : 'Official source'} ↗</a>${entry.original ? `<a href="${escape(entry.original)}" target="_blank" rel="noopener">Original file / data ↗</a>` : ''}</div>
        ${entry.languages ? `<details class="credit-languages"><summary>View all 55 credited languages</summary><p>${entry.languages.map(language => `<span>${escape(language)}</span>`).join(' · ')}</p></details>` : ''}</div></article>`;
    }).join('') || `<p class="credits-empty">No matching resources. Try another search.</p>`;
    dialog.querySelector('#credits-count').textContent = `${shown.length} resources`;
  };
  dialog.querySelector('#credits-search').addEventListener('input', event => { query = event.target.value; draw(); });
  dialog.querySelectorAll('[data-credit-filter]').forEach(button => button.addEventListener('click', () => {
    category = button.dataset.creditFilter;
    dialog.querySelectorAll('[data-credit-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    draw();
  }));
  dialog.querySelector('.credits-close').onclick = () => dialog.close();
  dialog.querySelector('[data-credit-notes]').onclick = () => { dialog.close(); onFieldNotes(); };
  dialog.addEventListener('close', () => returnFocus?.focus({ preventScroll: true }));
  window.addEventListener('mission-resource-credits-updated', () => { if (dialog.open) draw(); });
  window.addEventListener('mission-language-change', () => { if (dialog.open) draw(); });
  return { open(trigger = document.activeElement) { returnFocus = trigger; draw(); dialog.showModal(); dialog.scrollTop = 0; dialog.querySelector('.credits-close').focus({ preventScroll: true }); } };
}
