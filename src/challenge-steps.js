// Move original controls, preserving their state and event handlers. Only one
// stage is exposed at a time, including to keyboard and screen-reader users.
export function mountChallengeSteps(host, groups) {
  const nav = document.createElement('nav');
  nav.className = 'challenge-step-nav';
  nav.setAttribute('aria-label', 'Challenge steps');
  const panels = groups.map(({ title, nodes }, index) => {
    const panel = document.createElement('section');
    panel.className = 'challenge-step';
    panel.tabIndex = -1;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = title;
    button.disabled = index > 0;
    button.onclick = () => show(index, true);
    nav.append(button);
    panel.append(...nodes.filter(Boolean));
    return panel;
  });
  host.prepend(nav);
  host.append(...panels);
  function show(index, focus = false) {
    if (nav.children[index].disabled) return;
    panels.forEach((panel, i) => {
      panel.hidden = i !== index;
      if (i === index) nav.children[i].setAttribute('aria-current', 'step');
      else nav.children[i].removeAttribute('aria-current');
    });
    if (focus && host.getClientRects().length) {
      nav.scrollIntoView({ block: 'nearest', behavior: 'instant' });
      (panels[index].querySelector('button:not(:disabled), input:not(:disabled)') || panels[index]).focus({ preventScroll: true });
    }
  }
  function unlock(index, focus = true) { nav.children[index].disabled = false; show(index, focus); }
  function reset() { [...nav.children].forEach((button, i) => { button.disabled = i > 0; }); show(0); }
  function lock(index) { nav.children[index].disabled = true; }
  show(0);
  return { show, unlock, reset, lock };
}

export function collapseChallengeNotes(node, title) {
  if (!node) return;
  const details = document.createElement('details');
  details.className = 'challenge-notes';
  const summary = document.createElement('summary');
  summary.textContent = title;
  node.before(details);
  details.append(summary, node);
  return details;
}

export function mountMoonChallengeSteps(lrvRoot, surveyorRoot) {
  const lrv = lrvRoot.querySelector('[data-lrv-workshop]');
  const controls = lrv.querySelector('.lrv-controls');
  const find = selector => lrv.querySelector(selector);
  const geometry = find('.lrv-geometry');
  const lrvSteps = mountChallengeSteps(controls, [
    { title: '01 · Build', nodes: [find('.lrv-materials')] },
    { title: '02 · Shape and test', nodes: [geometry, find('.lrv-goals'), find('.lrv-actions'), find('.lrv-results')] },
  ]);
  const surveyor = surveyorRoot.querySelector('[data-surveyor-game]');
  const layout = surveyor.querySelector('.surveyor-study-layout');
  const fieldsets = [...surveyor.querySelectorAll('.surveyor-investigation-grid > fieldset')];
  const side = document.createElement('div');
  side.className = 'surveyor-step-controls';
  layout.append(side);
  const surveyorSteps = mountChallengeSteps(side, [
    { title: '01 · Find firm ground', nodes: [surveyor.querySelector('.surveyor-site-controls'), fieldsets[0]] },
    { title: '02 · Make a safe landing', nodes: [fieldsets[1], surveyor.querySelector('.surveyor-result')] },
  ]);
  surveyor.querySelector('.surveyor-investigation-grid').remove();
  let assembled = false, evidence = false;
  const observer = new MutationObserver(() => {
    const nextAssembly = lrv.dataset.lrvAssembly === 'complete';
    if (nextAssembly && !assembled) lrvSteps.unlock(1);
    if (!nextAssembly && assembled) lrvSteps.reset();
    assembled = nextAssembly;
    const nextEvidence = surveyor.dataset.surveyorEvidence === 'complete';
    if (nextEvidence && !evidence) surveyorSteps.unlock(2);
    // Landing trials remain available; the model still requires evidence
    // before accepting a recommendation and offering a stamp.
    evidence = nextEvidence;
  });
  observer.observe(lrv, { attributes: true, attributeFilter: ['data-lrv-assembly'] });
  observer.observe(surveyor, { attributes: true, attributeFilter: ['data-surveyor-evidence'] });
  const selectPatch = event => { if (event.target.closest('[data-surveyor-action="restart"]')) { evidence = false; surveyorSteps.reset(); } };
  surveyor.addEventListener('click', selectPatch);
  // Apollo's second stage unlocks when the physical assembly puzzle is complete.
  // Surveyor keeps its stages browsable because learners compare evidence across them.
  surveyor.querySelectorAll('.challenge-step-nav button').forEach(button => { button.disabled = false; });
  return { dispose() { observer.disconnect(); surveyor.removeEventListener('click', selectPatch); } };
}
