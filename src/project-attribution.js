const tool = (id, title, source, credit, usedIn, presentation, files = []) => ({
  id, title, source, credit, usedIn, presentation, files,
  category: 'tools', kind: 'Development resource',
});

export const siDisclosure = 'Super Intelligence (SI) / AI assistance: OpenAI Codex assisted implementation, debugging, test design, translations, narrative drafts, and exploration of presentation and gameplay options. Original programmatic illustrations and simulations were built with AI coding assistance. ElevenLabs generated the four machine narration recordings. Those voices are synthetic, not NASA recordings. NASA and partner-agency images, observations, data and archive audio are credited separately. No standalone generative-image or generative-video assets were added.';

export const projectTools = [
  tool('tool-three', 'Three.js and OrbitControls', 'https://threejs.org/', 'Three.js authors · MIT License', ['3D exhibits', 'Journey map'], 'Rendering, orbital controls, procedural spacecraft and planet geometry. See the dependency notices for versions and license texts.'),
  tool('tool-vite', 'Vite', 'https://vite.dev/', 'Vite contributors · MIT License', ['Development and production build'], 'Development server and production bundling. Includes its installed build-time dependencies.'),
  tool('tool-xml', 'fast-xml-parser', 'https://github.com/NaturalIntelligence/fast-xml-parser', 'Natural Intelligence and contributors · MIT License', ['DSN relay'], 'Parses NASA DSN XML on the server.'),
  tool('tool-netlify', '@netlify/blobs', 'https://www.npmjs.com/package/@netlify/blobs', 'Netlify · MIT License', ['Optional classroom records'], 'Storage adapter for the optional moderated classroom features.'),
  tool('tool-node', 'Node.js', 'https://nodejs.org/', 'Node.js contributors · Node.js license', ['Build and optional server'], 'JavaScript runtime and built-in test runner.'),
  tool('tool-font', 'Public Sans', 'https://public-sans.digital.gov/', 'The Public Sans Project Authors · SIL Open Font License 1.1', ['Entire academy', 'Certificate'], 'One self-hosted type family; font and complete OFL text are included.', ['/fonts/PublicSans-Variable.ttf', '/fonts/PublicSans-OFL.txt']),
  tool('tool-codex', 'OpenAI Codex', 'https://openai.com/codex/', 'OpenAI', ['Code, debugging, testing, text and translations'], 'AI development assistance for code, test design, translations and narrative drafts. See the SI disclosure.'),
  tool('tool-openai-screening', 'OpenAI APIs · optional classroom screening', 'https://platform.openai.com/docs/guides/moderation', 'OpenAI', ['Optional classroom records'], 'Optional transcription and moderation run only with server configuration. Teacher approval remains required before publication.'),
  tool('tool-elevenlabs', 'ElevenLabs', 'https://elevenlabs.io/', 'ElevenLabs · synthetic narration supplied by the project author', ['Four machine transmissions'], 'Text-to-speech generation of the four original character narrations. These are not NASA recordings or astronaut voices.'),
  tool('tool-playwright', 'Playwright', 'https://playwright.dev/', 'Microsoft and contributors · Apache License 2.0', ['Development verification'], 'Browser automation used for earlier local QA. Browser-based manual playtests also used the Codex in-app browser.'),
  tool('tool-axe', 'axe-core', 'https://github.com/dequelabs/axe-core', 'Deque Systems and contributors · Mozilla Public License 2.0', ['Automated accessibility checks'], 'Automated checks supplement keyboard and visual testing; they do not establish accessibility for every user.'),
  ...['curiosity','ingenuity','webb','voyager'].map(id => ({
    id: `voice-${id}`, category: 'tools', kind: 'AI-generated narration',
    title: `${id === 'webb' ? 'Webb' : id[0].toUpperCase()+id.slice(1)} · machine voice`,
    source: 'https://elevenlabs.io/', credit: 'ElevenLabs · synthetic character voice',
    files: [`src/assets/voices/voice-${id}.mp3`], usedIn: [id === 'webb' ? 'Webb' : id[0].toUpperCase()+id.slice(1)],
    presentation: 'AI-generated speech for an original imagined first-person transmission; supplied by the project author. Not an actual NASA spacecraft recording. The voice model/settings were not supplied.',
  })),
];
