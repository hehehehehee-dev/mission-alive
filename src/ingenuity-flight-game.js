import {flightComparisonMarkup, renderFlightComparison} from './ingenuity-flight-comparison.js';
// Original educational simulation. Distances, gusts and timing below are game
// values, not Ingenuity telemetry or a physical flight-control model.
export const landingZones = Object.freeze({
  flat: {label:'Flat plain', detail:'Level ground', x:-4.6, z:-1.8},
  crater: {label:'Crater rim', detail:'Sloped ground', x:0, z:3.8},
  rocks: {label:'Rock field', detail:'Boulders', x:4.6, z:-1.8},
});
export const FLIGHT_DURATION = 22;
export const LANDING_CHECKPOINT = 16;
export function createFlight({stepped = false} = {}) {
  return {site:null, phase:'choose', time:0, offset:0, velocity:0, wind:0, tilt:0,
    altitude:0, progress:0, active:false, paused:stepped, stepped, stability:100,
    danger:0, result:null, attempts:0, corrections:0, retry:false};
}
export function selectLanding(game, site) {
  if (!landingZones[site] || game.active || game.phase === 'landed') return false;
  game.site = site;
  if (game.phase !== 'failed') game.phase = 'ready';
  return true;
}
export function launchFlight(game, retry = false) {
  if (!game.site || game.active || game.phase === 'landed' || retry && game.phase !== 'failed') return false;
  const site = game.site, attempts = game.attempts + 1, stepped = game.stepped;
  Object.assign(game, createFlight({stepped}), {site, attempts, active:true,
    phase:retry ? 'descent' : 'spool', time:retry ? LANDING_CHECKPOINT : 0,
    altitude:retry ? 2.4 : 0, progress:retry ? 1 : 0, retry});
  return true;
}
export function nudgeFlight(game, direction) {
  if (!game.active || ![-1,1].includes(direction)) return;
  game.offset = Math.max(-4, Math.min(4, game.offset + direction * .38));
  game.velocity *= .45;
  game.tilt = direction * .16;
  game.corrections++;
}
export function flightWind(time) {
  if (time > 20) return 0;
  if (time < 6) return .72;
  if (time < 11) return -.85;
  if (time < 16) return .55;
  return .65;
}
const smooth = value => { const x = Math.max(0,Math.min(1,value)); return x*x*(3-2*x); };
export function advanceFlightGame(game, seconds, direction = 0) {
  if (!game.active || !Number.isFinite(seconds) || seconds <= 0) return;
  direction = [-1,0,1].includes(direction) ? direction : 0;
  // Use small fixed substeps: slow phones and step-by-step mode have the same
  // forgiving physics, rather than losing stability in one large frame.
  let left = Math.min(seconds, FLIGHT_DURATION);
  while (left > .000001 && game.active) {
    const dt = Math.min(left, 1/60); left -= dt;
    game.time = Math.min(FLIGHT_DURATION, game.time + dt);
    game.wind = flightWind(game.time);
    game.phase = game.time < 3 ? 'climb' : game.time < 16 ? 'crosswind' : 'descent';
    game.altitude = game.time < 3 ? smooth(game.time/3)*2.4 : game.time < 16 ? 2.4 : (1-smooth((game.time-16)/6))*2.4;
    game.progress = smooth((game.time-.6)/15.4);
    if (game.time < 21) {
      // The gust acts from the first frame: choosing a patch starts play, not
      // a protected setup animation that delays the lesson.
      game.velocity += (game.wind + direction*2.15 - game.velocity*1.35 - game.offset*.15)*dt;
      game.offset = Math.max(-4.5,Math.min(4.5,game.offset + game.velocity*dt));
      game.tilt = direction*.2 - game.velocity*.08;
      const outside = Math.abs(game.offset) > 1.35;
      game.stability = Math.max(0,Math.min(100,game.stability+(outside ? -7 : 10)*dt));
      game.danger = Math.abs(game.offset) > 2.9 ? game.danger+dt : Math.max(0,game.danger-dt*2);
    }
    if (game.time >= FLIGHT_DURATION - .00001) {
      game.active = false; game.altitude = 0;
      game.result = Math.abs(game.offset) > 1.35 ? 'drift' : game.site === 'flat' ? 'safe' : game.site === 'crater' ? 'slope' : 'rock';
      game.phase = game.result === 'safe' ? 'landed' : 'failed';
    }
  }
}

export function flightGameMarkup() {
  return `<p class="eyebrow">YOUR MISSION</p><h2>Be my onboard computer.</h2><p>Choose where I land. Hold on the ground to guide me through the wind. Bring me home safely.</p>
  <section class="flight-game" aria-label="Ingenuity flight game">
    <div class="flight-zone-choices" aria-label="Landing zones" hidden>${Object.entries(landingZones).map(([id,zone],i)=>`<button type="button" data-flight-zone="${id}" aria-pressed="false"><span class="flight-zone-symbol" aria-hidden="true">${i===0?'▱':i===1?'◡':'◆'}</span><strong>${zone.label}</strong><small>${zone.detail}</small></button>`).join('')}</div>
    <p class="fine flight-game-note">You are the onboard computer, not a live pilot on Earth.</p>
    ${flightComparisonMarkup()}<p class="fine">Original training simulation. Wind, height and time are simplified.</p>
  </section>`;
}

const phases = {choose:'Choose a landing zone', ready:'Ready for lift-off', spool:'Rotors spinning up', climb:'Lifting off', crosswind:'Push against the wind', descent:'Line up your shadow with the landing ring', failed:'Try a safer landing', landed:'Safe touchdown!'};
const resultText = {
  safe:['Safe touchdown!', 'You corrected the wind and found level ground. That is what an onboard computer must do.'],
  slope:['The slope tipped me over.', 'Your flight reached the ground, but one leg touched the slope first. Try the flat plain.'],
  rock:['A boulder caught my landing leg.', 'A steady flight still needs clear ground. Try the flat plain.'],
  drift:['I missed the landing zone and crashed.', 'The wind pushed me beyond the prepared ground. A landing leg buckled and a rotor struck the surface. Next flight, hold toward the center before descent.'],
};
const failurePhases = {drift:'Landing gear damaged',slope:'Try level ground',rock:'Avoid the boulders'};

export function mountFlightGame(root, {host, state, fallback = false, onSuccess, onAnnounce = () => {}, onStart = () => {}, onStop = () => {}}) {
  const game = createFlight();
  state.visualFlight = game;
  let alive = true, lastPhase = '', lastCue = '', lastRender = 0, guideTarget = null, guidePointer = null, guidedOnce = false, autoPaused = false;
  const cleanup = [];
  const copy = new WeakMap();
  const write = (node, value) => { if (copy.get(node) !== value) { copy.set(node,value); node.textContent=value; } };
  const listen = (el, event, action, options) => { el.addEventListener(event,action,options); cleanup.push(()=>el.removeEventListener(event,action,options)); };
  const find = selector => root.querySelector(selector);
  const deck = document.createElement('div');
  deck.className = 'flight-deck';
  deck.innerHTML = `<div class="flight-deck-top"><strong data-flight-phase></strong><span class="flight-wind" data-flight-wind aria-hidden="true">→ → →</span></div>
    <div class="flight-preflight" data-flight-preflight><strong class="flight-selected-zone" data-flight-selected></strong><p class="flight-game-help" data-flight-help></p><button type="button" class="flight-launch" data-flight-launch disabled><span data-flight-launch-label>FLY NOW</span> <span aria-hidden="true">→</span></button></div>
    <div class="flight-air-controls" data-flight-air-controls hidden><p class="flight-direction-cue" data-flight-cue></p>
    <p class="fine flight-pilot-hint">Keyboard: hold ← / → or A / D.</p></div>
    <div class="flight-result" data-flight-result hidden><h3 data-flight-result-title></h3><p data-flight-result-note></p></div>`;
  // Same controls stay with the model at desktop and mobile widths.
  host.after(deck);
  const phase = deck.querySelector('[data-flight-phase]'), cue = deck.querySelector('[data-flight-cue]');
  const wind = deck.querySelector('[data-flight-wind]');
  const launch = deck.querySelector('[data-flight-launch]');
  const touchCoach = document.createElement('div');
  touchCoach.className = 'flight-touch-coach';
  touchCoach.hidden = true;
  touchCoach.innerHTML = '<span aria-hidden="true">☝</span><strong>The wind is already pushing me</strong><small>Press and keep holding on the ground. Move your finger to guide me.</small>';
  const touchTarget = document.createElement('i');
  touchTarget.className = 'flight-touch-target'; touchTarget.hidden = true; touchTarget.setAttribute('aria-hidden','true');
  host.append(touchCoach,touchTarget);
  const heldKeys = new Set();
  const direction = () => {
    const keys = (heldKeys.has(1)?1:0)-(heldKeys.has(-1)?1:0);
    if (keys) return keys;
    if (guideTarget === null) return 0;
    const delta = guideTarget-game.offset;
    return Math.abs(delta)<.18 ? 0 : Math.sign(delta);
  };
  const syncScene = () => {
    state.landingSite = game.site; state.flying = game.active; state.height = game.altitude;
    state.rotor = game.active ? 78 : 0; state.crashed = game.phase === 'failed';
    state.flight = game.time; state.stability = game.stability;
    state.flightGuideTarget = guideTarget; state.flightGuiding = guidePointer !== null;
    state.flightPaced = false; state.flightAdvanceSoundUntil = 0;
  };
  const render = (force = false) => {
    if (!alive) return;
    syncScene();
    // Avoid replacing accessibility strings and relocalizing the DOM every frame.
    const now = performance.now();
    if (!force && now-lastRender < 80) return;
    lastRender = now;
    const phaseText = game.phase === 'failed' ? failurePhases[game.result] : phases[game.phase];
    write(phase,phaseText);
    const text = !game.active ? game.phase === 'failed' ? resultText[game.result][1] : 'Choose, fly, then land.'
      : game.time < 3 ? 'Flying to the selected patch. The wind is already pushing.'
      : Math.abs(game.offset) < .45 ? game.wind > 0 ? 'Wind pushes right. Hold left of me.' : game.wind < 0 ? 'Wind pushes left. Hold right of me.' : 'Keep holding near the center.'
      : game.offset > 0 ? 'Drifting right. Hold on the left side ←' : 'Drifting left. Hold on the right side →';
    write(cue,text);
    write(wind,game.wind > 0 ? '→ → →' : game.wind < 0 ? '← ← ←' : '· · ·');
    deck.classList.toggle('is-outside',Math.abs(game.offset)>1.35);
    deck.classList.toggle('is-flying',game.active);
    deck.dataset.phase = game.phase;
    deck.querySelector('[data-flight-preflight]').hidden = game.active || game.phase === 'landed';
    deck.querySelector('[data-flight-air-controls]').hidden = !game.active;
    wind.hidden = !game.active;
    write(deck.querySelector('[data-flight-selected]'),game.site ? landingZones[game.site].label : 'Choose a landing zone');
    write(deck.querySelector('[data-flight-help]'),game.phase === 'failed' ? 'Choose a landing zone or retry.' : game.site ? 'Ready. Fly into the wind.' : fallback ? 'Choose a landing zone below.' : 'Tap a labelled landing zone on the 3D ground.');
    launch.disabled = !game.site || game.active || game.phase === 'landed';
    launch.classList.toggle('is-ready',Boolean(game.site && !game.active && game.phase !== 'landed'));
    write(deck.querySelector('[data-flight-launch-label]'),game.phase === 'failed' ? 'RETRY NOW' : 'FLY NOW');
    host.classList.toggle('is-flight-guiding',game.active);
    touchCoach.hidden = !game.active || guidedOnce;
    touchTarget.hidden = !game.active || guideTarget === null;
    root.querySelectorAll('[data-flight-zone]').forEach(button => {
      button.disabled = game.active || game.phase === 'landed';
      button.setAttribute('aria-pressed',String(button.dataset.flightZone === game.site));
    });
    find('.flight-zone-choices').hidden = !fallback;
    const result = deck.querySelector('[data-flight-result]');
    result.hidden = !game.result;
    if (game.result) {
      write(deck.querySelector('[data-flight-result-title]'),resultText[game.result][0]);
      write(deck.querySelector('[data-flight-result-note]'),resultText[game.result][1]);
    }
    if (lastPhase !== `${game.phase}:${game.result || ''}`) { lastPhase = `${game.phase}:${game.result || ''}`; onAnnounce(phaseText); }
    if (game.active && text !== lastCue && game.time < 3) { lastCue = text; onAnnounce(text); }
  };
  const finish = () => {
    render(true);
    if (game.active || !game.result) return;
    heldKeys.clear(); guideTarget=null; guidePointer=null; onStop();
    renderFlightComparison(find('#flight-comparison'), {maxAltitudeM:2.4,durationS:game.retry ? game.time-LANDING_CHECKPOINT : game.time});
    onAnnounce(resultText[game.result].join(' '));
    if (game.result === 'safe') onSuccess();
    else launch.focus({preventScroll:true});
  };
  const play = retry => {
    if (!launchFlight(game,retry)) return;
    heldKeys.clear(); guideTarget=null; guidePointer=null; guidedOnce=false; onStart(); render(true);
    host.focus({preventScroll:true});
    deck.scrollIntoView({block:'nearest',behavior:'instant'});
  };
  const choose = site => {
    if (!selectLanding(game,site)) return;
    render(true);
    onAnnounce(game.phase === 'failed' ? 'New patch selected. Press Retry now.' : 'Landing patch selected. Press Fly now.');
    deck.scrollIntoView({block:'nearest',behavior:'instant'});
  };
  root.querySelectorAll('[data-flight-zone]').forEach(button => listen(button,'click',()=>choose(button.dataset.flightZone)));
  listen(launch,'click',()=>play(game.phase === 'failed'));
  const guide = event => {
    if (!game.active) return;
    const bounds=host.getBoundingClientRect();
    const ratio=Math.max(0,Math.min(1,(event.clientX-bounds.left)/Math.max(1,bounds.width)));
    guideTarget=(ratio-.5)*7;
    touchTarget.style.left=`${ratio*100}%`; touchTarget.style.top=`${Math.max(22,Math.min(bounds.height-22,event.clientY-bounds.top))}px`;
    guidedOnce=true; touchCoach.hidden=true; touchTarget.hidden=false;
    render(true);
  };
  listen(host,'pointerdown',event=>{if(!game.active || event.target.closest?.('.flight-site-marker'))return;event.preventDefault();guidePointer=event.pointerId;host.setPointerCapture?.(event.pointerId);guide(event);});
  listen(host,'pointermove',event=>{if(event.pointerId===guidePointer)guide(event);});
  const stopGuide=event=>{if(guidePointer!==null && (event.pointerId===undefined || event.pointerId===guidePointer)){guidePointer=null;guideTarget=null;touchTarget.hidden=true;render(true);}};
  listen(host,'pointerup',stopGuide);listen(host,'pointercancel',stopGuide);listen(host,'lostpointercapture',stopGuide);
  const keyDirection = event => ['ArrowLeft','KeyA'].includes(event.code)?-1:['ArrowRight','KeyD'].includes(event.code)?1:0;
  listen(window,'keydown',event=>{
    const value = keyDirection(event);
    if (!game.active || !value || event.target.closest('input,textarea,select,dialog') || !host.closest('.exhibit')?.contains(event.target)) return;
    event.preventDefault(); event.stopPropagation();
    heldKeys.add(value);
    render(true);
  },true);
  listen(window,'keyup',event=>{const value=keyDirection(event);if(value)heldKeys.delete(value);},true);
  listen(window,'blur',()=>{heldKeys.clear();guideTarget=null;if(game.active){game.paused=true;autoPaused=true;render(true);}});
  listen(window,'focus',()=>{if(game.active&&autoPaused&&!document.hidden){game.paused=false;autoPaused=false;render(true);}});
  listen(document,'visibilitychange',()=>{heldKeys.clear();guideTarget=null;if(!game.active)return;if(document.hidden){game.paused=true;autoPaused=true;}else if(autoPaused){game.paused=false;autoPaused=false;}render(true);});
  listen(window,'mission-language-change',()=>render(true));
  render(true);
  return {game, selectSite:choose, tick(dt){if(alive && game.active && !game.paused){advanceFlightGame(game,dt,direction());finish();}},
    setFallback(value){fallback=Boolean(value);render(true);},
    setReduced(){render(true);},
    dispose(){alive=false;heldKeys.clear();cleanup.forEach(remove=>remove());deck.remove();touchCoach.remove();touchTarget.remove();host.classList.remove('is-flight-guiding');state.flying=false;state.rotor=0;}};
}
