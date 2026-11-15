import test from 'node:test';
import assert from 'node:assert/strict';
import {createFlight, selectLanding, launchFlight, nudgeFlight, advanceFlightGame, flightGameMarkup, LANDING_CHECKPOINT, FLIGHT_DURATION} from '../src/ingenuity-flight-game.js';
import {t} from '../src/i18n.js';
function setup(site='flat',stepped=false){const game=createFlight({stepped});selectLanding(game,site);launchFlight(game);return game;}
function guide(game){for(let n=0;n<1600 && game.active;n++) advanceFlightGame(game,1/60,Math.abs(game.offset)>.25 ? -Math.sign(game.offset):0);}
test('a site is required and choosing another site cannot teleport a flying or graduated helicopter',()=>{
  const g=createFlight();assert.equal(launchFlight(g),false);assert.equal(selectLanding(g,'invented'),false);
  assert.equal(selectLanding(g,'flat'),true);assert.equal(launchFlight(g),true);
  assert.equal(selectLanding(g,'rocks'),false);assert.equal(g.site,'flat');guide(g);
  assert.equal(g.result,'safe');assert.equal(selectLanding(g,'crater'),false);assert.equal(launchFlight(g),false);
});
test('readable corrective steering lands on level ground without pixel-perfect positioning',()=>{
  const g=setup();guide(g);assert.equal(g.result,'safe');assert.equal(g.altitude,0);assert.equal(g.active,false);
  assert.ok(Math.abs(g.offset)<1.35);assert.ok(g.stability>45);
});
test('doing nothing drifts outside the landing ring; feedback is about flight rather than an arbitrary checklist',()=>{
  const g=setup();advanceFlightGame(g,FLIGHT_DURATION);assert.equal(g.result,'drift');assert.equal(g.phase,'failed');
});
test('wind and lift begin immediately instead of waiting behind a setup animation',()=>{
  const g=setup();advanceFlightGame(g,.5);assert.ok(g.wind>0);assert.ok(g.altitude>0);assert.ok(g.offset>0);
});
test('safe flight can still tip on a slope or hit a boulder; these sites are not blocked before the experiment',()=>{
  for(const [site,result] of [['crater','slope'],['rocks','rock']]) {const g=setup(site);assert.equal(g.active,true);guide(g);assert.equal(g.result,result);assert.equal(g.phase,'failed');assert.equal(g.time,FLIGHT_DURATION);}
});
test('retry keeps the checkpoint, permits a new patch and can graduate after a safe landing',()=>{
  const g=setup('rocks');guide(g);assert.equal(g.result,'rock');assert.equal(selectLanding(g,'flat'),true);
  assert.equal(launchFlight(g,true),true);assert.equal(g.time,LANDING_CHECKPOINT);assert.equal(g.altitude,2.4);assert.equal(g.progress,1);
  assert.equal(g.offset,0);assert.equal(g.attempts,2);guide(g);assert.equal(g.result,'safe');
});
test('tap corrections are visible immediately, work while paused, and do not advance the clock',()=>{
  const g=setup('flat',true);assert.equal(g.paused,true);nudgeFlight(g,-1);assert.ok(g.offset<0);assert.equal(g.time,0);
  nudgeFlight(g,1);assert.ok(Math.abs(g.offset)<.001);assert.equal(g.corrections,2);
  advanceFlightGame(g,1);assert.ok(Math.abs(g.time-1)<.0001);assert.equal(g.paused,true);
});
test('fixed substeps make a one-second action match realtime simulation at the same input',()=>{
  const a=setup(),b=setup();advanceFlightGame(a,6,-1);for(let n=0;n<360;n++)advanceFlightGame(b,1/60,-1);
  for(const key of ['offset','stability','time','altitude'])assert.ok(Math.abs(a[key]-b[key])<.000001,key);
});
test('sustained wrong-way steering fails slowly enough to allow a correction and can retry',()=>{
  const g=setup();advanceFlightGame(g,5,1);assert.equal(g.active,true);advanceFlightGame(g,8,1);assert.equal(g.active,true);
  advanceFlightGame(g,FLIGHT_DURATION);assert.equal(g.phase,'failed');assert.equal(g.result,'drift');
  assert.equal(launchFlight(g,true),true);guide(g);assert.equal(g.result,'safe');
});
test('invalid time steps and inputs cannot create non-finite flight positions',()=>{
  const g=setup();advanceFlightGame(g,NaN);advanceFlightGame(g,-1);nudgeFlight(g,100);assert.equal(g.time,0);assert.equal(g.offset,0);
});
test('new flight actions and outcome guidance have Spanish and Vietnamese copy',()=>{
  for(const language of ['es','vi'])for(const label of ['Be my onboard computer.','Push left','Push right','Retry from landing','I missed the landing zone and crashed.','Tap a patch on the ground.','Safe touchdown!'])assert.notEqual(t(label,language),label);
  assert.match(flightGameMarkup(),/class="flight-zone-choices"[^>]* hidden/);
  assert.doesNotMatch(flightGameMarkup(),/data-flight-launch|type="range"|data-flight-controller/);
});
