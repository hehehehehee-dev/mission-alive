import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resourceCredits, educationResearch, buildScienceCredits } from '../src/resource-credits.js';
import { projectTools, siDisclosure } from '../src/project-attribution.js';

const root = fileURLToPath(new URL('../', import.meta.url));
mkdirSync(resolve(root, 'docs'), { recursive:true });
const read = path => readFileSync(resolve(root, path), 'utf8');
const facts = JSON.parse(read('src/facts.json'));
const quotes = [...read('src/main.js').matchAll(/storySource:\s*"([^"]+)"/g)].map(match => ({ storySource:match[1], storyAttribution:'Exhibit quotation source', name:'Exhibit narrative' }));
const entries = [...resourceCredits, ...educationResearch, ...buildScienceCredits(facts, quotes), ...projectTools];
const references = `# Mission Alive — project references\n\n## SI / AI disclosure\n\n${siDisclosure}\n\nProject requirements, supplied voice assets, feedback and publication decisions come from the project author. The disclosure above describes the AI assistance used during development.\n\n## Data, imagery, recordings, text and development resources\n\n` + entries.map(entry => `### ${entry.title}\n\n- Creator / credit: ${entry.credit}\n- Official source: ${entry.source}\n${entry.original ? `- Original file / endpoint: ${entry.original}\n` : ''}- Used in: ${entry.usedIn.join(', ')}\n${entry.files?.length ? `- Local files: ${entry.files.join(', ')}\n` : ''}${entry.presentation ? `- Usage / modifications: ${entry.presentation}\n` : ''}`).join('\n') + '\n## Dependency notices\n\nThe accompanying third-party-notices.txt lists the locked dependency inventory and retained installed license texts. NASA archive photos loaded dynamically retain their NASA IDs and supplied credits in the app’s Sources & credits panel.\n';
writeFileSync(resolve(root, 'docs/project-submission-references.md'), references);
writeFileSync(resolve(root, 'public/project-references.md'), references);

const lock = JSON.parse(read('package-lock.json'));
const notices = ['MISSION ALIVE — THIRD-PARTY DEPENDENCY INVENTORY', 'Package versions and declared licenses are from package-lock.json. Full retained license files follow when installed.'];
for (const [path, pkg] of Object.entries(lock.packages)) {
  if (!path) continue;
  const name = path.split('node_modules/').at(-1);
  notices.push(`\n${name} ${pkg.version || ''}\nDeclared license: ${pkg.license || 'not declared in lockfile'}\nPackage: https://www.npmjs.com/package/${name}\nSource archive: ${pkg.resolved || 'local dependency'}`);
  const dir = resolve(root, path);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter(file => /^(?:licen[cs]e|copying|notice)(?:[.-].*)?$/i.test(file))) {
    try { notices.push(`\n--- ${name}/${file} ---\n${readFileSync(resolve(dir,file), 'utf8')}`); } catch { /* Not a plain license file. */ }
  }
}
notices.push(`\n--- Public Sans / SIL OFL ---\n${read('public/fonts/PublicSans-OFL.txt')}`);
writeFileSync(resolve(root, 'public/third-party-notices.txt'), notices.join('\n'));
console.log(`Exported ${entries.length} source/resource/tool records and the locked dependency notices.`);
