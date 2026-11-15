import test from 'node:test';
import assert from 'node:assert/strict';
import {mountFlightGame,nudgeFlight} from '../src/ingenuity-flight-game.js';

function element(dataset={}) {
  return {dataset,style:{},children:[],textContent:'',hidden:false,disabled:false,attrs:{},events:{},nodes:new Map(),classList:{toggle(){},add(){},remove(){}},
    setAttribute(key,value){this.attrs[key]=value;},
    querySelector(selector){if(!this.nodes.has(selector))this.nodes.set(selector,element());return this.nodes.get(selector);},
    querySelectorAll(){return [];},
    addEventListener(event,handler){this.events[event]=handler;},removeEventListener(event){delete this.events[event];},
    focus(){this.focused=true;},scrollIntoView(){},after(node){this.deck=node;},append(...nodes){this.children.push(...nodes);},remove(){this.removed=true;},closest(){return null;},
    getBoundingClientRect(){return {left:0,top:0,width:600,height:400};},setPointerCapture(){},
  };
}
function harness(context,stepped=true) {
  const before={document:globalThis.document,window:globalThis.window};
  const root=element(), host=element(), deck=element(), state={}, window=element(), doc=element();
  const zones=['flat','crater','rocks'].map(site=>element({flightZone:site}));
  const steering=[-1,1].map(value=>element({flightSteer:String(value)}));
  root.querySelectorAll=()=>zones;deck.querySelectorAll=()=>steering;
  host.closest=()=>({contains:()=>true});
  doc.createElement=()=>deck;
  globalThis.document=doc;globalThis.window=window;
  context.after(()=>{globalThis.document=before.document;globalThis.window=before.window;});
  let starts=0,ends=0,wins=0;
  const controller=mountFlightGame(root,{host,state,stepped,onStart(){starts++;},onStop(){ends++;},onSuccess(){wins++;}});
  return {root,host,deck,window,doc,controller,state,counts:()=>({starts,ends,wins})};
}
test('continuous flight reaches a safe landing and calls the existing success hook only once',context=>{
  const h=harness(context,false);h.controller.selectSite('flat');
  h.deck.querySelector('[data-flight-launch]').events.click();
  assert.equal(h.state.flying,true);assert.equal(h.state.visualFlight,h.controller.game);
  for(let n=0;n<22;n++){
    if(Math.abs(h.controller.game.offset)>.25)nudgeFlight(h.controller.game,-Math.sign(h.controller.game.offset));
    h.controller.tick(1);
  }
  assert.equal(h.controller.game.result,'safe');assert.deepEqual(h.counts(),{starts:1,ends:1,wins:1});
  h.controller.tick(1);
  assert.equal(h.counts().wins,1);h.controller.dispose();
});
test('leaving the window pauses continuous flight and returning resumes without another button',context=>{
  const h=harness(context,false);h.controller.selectSite('flat');h.deck.querySelector('[data-flight-launch]').events.click();
  h.controller.tick(.5);const time=h.controller.game.time;
  h.window.events.blur();assert.equal(h.controller.game.paused,true);h.controller.tick(1);assert.equal(h.controller.game.time,time);
  h.window.events.focus();assert.equal(h.controller.game.paused,false);h.controller.tick(1);assert.ok(h.controller.game.time>time);
  h.controller.dispose();assert.equal(h.deck.removed,true);assert.deepEqual(h.window.events,{});assert.deepEqual(h.doc.events,{});
  assert.equal(h.state.flying,false);
});
test('reduced motion keeps the flight continuous and removes no gameplay control',context=>{
  const h=harness(context,false);h.controller.selectSite('flat');h.deck.querySelector('[data-flight-launch]').events.click();h.controller.tick(2);
  const time=h.controller.game.time;h.controller.setReduced(true);assert.equal(h.controller.game.paused,false);h.controller.tick(1);assert.ok(h.controller.game.time>time);h.controller.dispose();
});

test('a 3D site choice reveals one prominent flight action beside the model',context=>{
  const h=harness(context);
  const launch=h.deck.querySelector('[data-flight-launch]');
  assert.equal(launch.disabled,true);
  assert.equal(h.root.querySelector('.flight-zone-choices').hidden,true);
  assert.equal(h.deck.querySelector('[data-flight-air-controls]').hidden,true);
  h.controller.selectSite('crater');
  assert.equal(h.controller.game.active,false);
  assert.equal(launch.disabled,false);
  assert.equal(h.deck.querySelector('[data-flight-selected]').textContent,'Crater rim');
  assert.equal(h.deck.querySelector('[data-flight-help]').textContent,'Ready. Fly into the wind.');
  launch.events.click();
  assert.equal(h.controller.game.active,true);
  assert.equal(h.deck.querySelector('[data-flight-preflight]').hidden,true);
  assert.equal(h.deck.querySelector('[data-flight-air-controls]').hidden,false);
  assert.equal(h.counts().starts,1);
  h.controller.dispose();
});

test('holding a point on the 3D ground guides continuously and releasing stops the correction',context=>{
  const h=harness(context,false);h.controller.selectSite('flat');h.deck.querySelector('[data-flight-launch]').events.click();
  h.host.events.pointerdown({pointerId:7,clientX:540,clientY:220,preventDefault(){},target:element()});
  h.controller.tick(1);const guided=h.controller.game.offset;
  assert.ok(guided>0);
  h.host.events.pointerup({pointerId:7});
  assert.equal(h.host.children[1].hidden,true);
  h.controller.dispose();
});

test('zone alternatives appear only in fallback and switching view never resets the chosen patch',context=>{
  const h=harness(context);h.controller.selectSite('rocks');
  h.controller.setFallback(true);
  assert.equal(h.root.querySelector('.flight-zone-choices').hidden,false);
  assert.equal(h.controller.game.site,'rocks');
  h.controller.setFallback(false);
  assert.equal(h.root.querySelector('.flight-zone-choices').hidden,true);
  assert.equal(h.controller.game.site,'rocks');
  h.controller.dispose();
});
