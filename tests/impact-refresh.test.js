import test from 'node:test';
import assert from 'node:assert/strict';
import {mountImpact} from '../src/impact.js';
import {aggregateImpact, questions} from '../server/playtest-impact.mjs';
const flush = () => new Promise(resolve=>setImmediate(resolve));
test('impact refreshes at five minutes, skips hidden tabs, handles failure and cancels on exit', async context=>{
  const previousDocument=globalThis.document, previousWindow=globalThis.window;
  context.after(()=>{globalThis.document=previousDocument;globalThis.window=previousWindow;});
  const element=()=>({textContent:'',children:[],listeners:{},append(...items){this.children.push(...items);},replaceChildren(){this.children=[];},addEventListener(event,handler){this.listeners[event]=handler;},removeEventListener(event){delete this.listeners[event];}});
  const nodes=new Map(); const root={querySelector(selector){if(!nodes.has(selector))nodes.set(selector,element());return nodes.get(selector);}};
  globalThis.document={hidden:false,createElement:element};
  const events={}; globalThis.window={addEventListener(event,handler){events[event]=handler;},removeEventListener(event){delete events[event];}};
  let tick, duration, cleared=false, calls=0, signal, fail=false;
  const controller=mountImpact(root,{
    fetcher:async(_url,options)=>{calls++;signal=options.signal;return {ok:!fail,json:async()=>aggregateImpact([[questions.timestamp],...Array(calls-1).fill(['test'])])};},
    setTimer(callback,ms){tick=callback;duration=ms;return 'timer';}, clearTimer(id){cleared=id==='timer';},
  });
  await flush(); assert.equal(calls,1); assert.equal(duration,300000);
  assert.match(root.querySelector('[data-impact-status]').textContent,/No responses yet/);
  tick(); await flush(); assert.equal(calls,2);
  assert.equal(root.querySelector('[data-impact-results]').children[0].children[1].textContent,'1');
  assert.equal(root.querySelector('[data-impact-results]').children[0].children.length,2,'metric cards do not repeat explanatory notes');
  document.hidden=true;tick();await flush();assert.equal(calls,2);
  document.hidden=false;fail=true;tick();await flush();
  assert.match(root.querySelector('[data-impact-status]').textContent,/unavailable/);
  assert.equal(root.querySelector('[data-impact-results]').children.length,0);
  fail=false;root.querySelector('[data-impact-refresh]').listeners.click();await flush();assert.equal(calls,4);
  controller.dispose();assert.ok(signal.aborted);assert.ok(cleared);assert.equal(events['mission-language-change'],undefined);
  tick();await flush();assert.equal(calls,4);
});
