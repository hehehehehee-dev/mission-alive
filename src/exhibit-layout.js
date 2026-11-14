// Rehome the existing controls, without duplicating IDs or replacing their
// listeners. Anchors restore shared exhibit nodes before the next render.
export function mountExhibitLayout(id) {
  const moved = [], generated = [];
  const restored = [];
  let revealCompletion = () => {};
  const find = (selector) => document.querySelector(selector);
  const create = (tag, attributes = {}) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    generated.push(node);
    return node;
  };
  const move = (node, parent, before = null) => {
    if (!node || !parent) return;
    const anchor = document.createComment("exhibit layout position");
    node.before(anchor);
    moved.push({ node, anchor });
    parent.insertBefore(node, before);
  };
  const disclosure = (label, id) => {
    const details = create("details", { id, class: "exhibit-extras" });
    const summary = document.createElement("summary");
    summary.textContent = label;
    details.append(summary);
    return details;
  };
  const excerpt = (parent) => {
    const story = create("div", { class: "compact-story-context" });
    parent.append(story);
    for (const selector of ["#story", "#story-source", "#story-reopen"]) move(find(selector), story);
  };

  if (id === "voyager") {
    const container = find("#greetings");
    move(container, find(".exhibit"), find("#challenge-heading"));
    const main = create("div", { id: "voyager-main", class: "voyager-main" });
    const more = disclosure("More to explore", "voyager-more");
    container.append(main, more);
    move(find(".greeting-library"), main);
    move(find(".personal-record-studio"), main);

    const arrival = create("section", { class: "voyager-arrival learning-panel", "aria-labelledby": "voyager-arrival-title" });
    arrival.innerHTML = '<h3 id="voyager-arrival-title">Signal arrival</h3>';
    main.append(arrival);
    revealCompletion = () => move(find("#discovery"), main, arrival);
    move(find("#signal-result"), arrival);
    find("#signal-result").textContent = "Open Signal Lab in More to explore to send a ping and time its trip.";
    move(find(".signal-beam"), arrival);
    for (const selector of [".voyager-live", ".voyager-contact"]) move(find(selector), main);

    const catalog = create("section", { id: "voyager-catalog", "aria-label": "All 55 Golden Record greetings" });
    more.append(catalog);
    move(find(".greeting-browser"), catalog);
    move(find(".signal-lab"), more);
    const capsule = create("section", { id: "voyager-time-capsule", class: "voyager-time-capsule", "aria-label": "Your time capsule" });
    more.append(capsule);
    const oldLabel = find(".studio-heading .eyebrow");
    if (oldLabel) {
      const greetingLabel = create("p", { class: "eyebrow" });
      greetingLabel.textContent = "YOUR GREETING";
      oldLabel.before(greetingLabel);
      move(oldLabel, capsule);
    }
    for (const selector of [".journey-explainer", ".personal-library", ".community-library", ".class-record"]) move(find(selector), capsule);
    for (const selector of ["#challenge-heading", ".challenge-layout", "#hidden-facts-slot", "#discovery"]) move(find(selector), more);
  }

  const reading = create("div", { class: "module-reading", id: "module-reading" });
  const challenge = find(id === "voyager" ? "#greetings" : ".challenge-layout");
  challenge.after(reading);
  const story = disclosure("Mission story", "module-story-more");
  const brief = disclosure("Before you take control", "module-briefing-more");
  reading.append(story, brief);
  move(find("#module-story"), story);
  excerpt(story);
  const archive = find(".mission-story-more");
  if (archive) {
    // Keep the complete existing chapter reader available with one outer click.
    const wasOpen = archive.open;
    restored.push(() => { archive.open = wasOpen; });
    archive.open = true;
    move(archive, story);
  }
  for (const selector of ["#module-training", "#briefing"]) move(find(selector), brief);
  if (id === "webb") {
    const controlIntro = create("div", { class: "webb-control-intro" });
    brief.append(controlIntro);
    for (const node of Array.from(find("#controls").children)) {
      if (node.matches(".webb-step-nav")) break;
      move(node, controlIntro);
    }
  }
  return {
    revealCompletion,
    dispose() {
      for (const restore of restored) restore();
      for (const { node, anchor } of moved.reverse()) if (anchor.parentNode) anchor.replaceWith(node);
      for (const node of generated.reverse()) node.remove();
    },
  };
}
