import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resourceCredits, buildScienceCredits } from '../src/resource-credits.js';

test('every shipped external image, recording and film has a public source and creator credit', () => {
  const registered = new Set(resourceCredits.flatMap(entry => entry.files || []));
  const media = readdirSync(new URL('../public/assets/', import.meta.url)).filter(name => /\.(?:jpe?g|png|webp|gif|mp3|mp4|webm)$/i.test(name));
  for (const name of media) assert.ok(registered.has(`/assets/${name}`), `Missing public credit: ${name}`);
  assert.equal(new Set(resourceCredits.map(entry => entry.id)).size, resourceCredits.length);
  for (const entry of resourceCredits) {
    assert.ok(entry.credit && entry.title && entry.usedIn.length, entry.id);
    const source = new URL(entry.source);
    assert.equal(source.protocol, 'https:');
    assert.match(source.hostname, /(?:^|\.)(?:nasa\.gov|esa\.int|stsci\.edu)$/);
    if (entry.original) assert.equal(new URL(entry.original).protocol, 'https:');
    for (const file of entry.files || []) {
      const path = file.startsWith('/') ? `../public${file}` : `../${file}`;
      assert.ok(existsSync(new URL(path, import.meta.url)), `${entry.id}: ${file}`);
    }
  }
  assert.equal(resourceCredits.find(entry => entry.id === 'webb-esa').kind, 'Official illustration');
  assert.equal(resourceCredits.find(entry => entry.id === 'sun').kind, 'Observation');
  assert.equal(resourceCredits.find(entry => entry.id === 'greetings').languages.length, 55);
});

test('mission reference catalog retains and deduplicates the facts actually used by the exhibits', () => {
  const facts = JSON.parse(readFileSync(new URL('../src/facts.json', import.meta.url), 'utf8'));
  const sources = buildScienceCredits(facts);
  const urls = sources.map(entry => entry.source);
  assert.equal(new Set(urls).size, urls.length);
  for (const fact of Object.values(facts)) assert.ok(urls.includes(fact.source_url));
  for (const source of sources) assert.ok(source.credit && source.title && source.usedIn.length);
  assert.ok(urls.includes('https://nssdc.gsfc.nasa.gov/planetary/factsheet/'));
});
