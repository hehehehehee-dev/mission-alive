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
    // The mission itself is the primary task. Keep it above both listening
    // libraries instead of hiding it at the bottom of More to explore.
    for (const selector of ["#challenge-heading", ".challenge-layout"]) move(find(selector), main);
    const library = find(".greeting-library");
    move(library, main);
    const gallery = find(".shared-greetings") || find(".class-gallery");
    if (gallery) {
      const tabs = create("div", { class: "greeting-tabs", role: "tablist", "aria-label": "Greeting collections" });
      const original = create("div", { id: "original-greetings", class: "original-greetings", role: "tabpanel", "aria-labelledby": "original-greetings-tab" });
      const labels = ["Golden Record · 1977", "Visitor greetings"];
      const ids = ["original-greetings", "visitor-greetings"];
      const buttons = labels.map((label, index) => {
        const button = create("button", { type: "button", id: `${ids[index]}-tab`, role: "tab", "aria-controls": ids[index], "aria-selected": String(index === 0), tabindex: index === 0 ? "0" : "-1" });
        button.textContent = label;
        tabs.append(button);
        return button;
      });
      library.append(tabs, original);
      for (const selector of [".greeting-browser", ".greeting-player", ".association-note", ".greeting-source"]) move(find(selector), original);
      move(gallery, library);
      const oldAttributes = ["id", "role", "aria-labelledby", "hidden"].map(name => [name, gallery.getAttribute(name)]);
      restored.push(() => oldAttributes.forEach(([name, value]) => value === null ? gallery.removeAttribute(name) : gallery.setAttribute(name, value)));
      gallery.id = ids[1];
      gallery.setAttribute("role", "tabpanel");
      gallery.setAttribute("aria-labelledby", `${ids[1]}-tab`);
      const panels = [original, gallery];
      const show = index => {
        panels.forEach((panel, i) => {
          panel.hidden = i !== index;
          if (i !== index) panel.querySelectorAll("audio").forEach(audio => audio.pause());
          buttons[i].setAttribute("aria-selected", String(i === index));
          buttons[i].tabIndex = i === index ? 0 : -1;
        });
        library.querySelector(".library-heading > span").hidden = index !== 0;
      };
      buttons.forEach((button, index) => {
        button.onclick = () => show(index);
        button.onkeydown = event => {
          const next = event.key === "Home" ? 0 : event.key === "End" ? 1 : event.key === "ArrowRight" || event.key === "ArrowLeft" ? 1 - index : null;
          if (next === null) return;
          event.preventDefault();
          show(next);
          buttons[next].focus();
        };
      });
      show(0);
    }
    move(find(".personal-record-studio"), main);

    const arrival = create("section", { class: "voyager-arrival learning-panel", "aria-labelledby": "voyager-arrival-title" });
    arrival.innerHTML = '<h3 id="voyager-arrival-title">Signal arrival</h3>';
    more.append(arrival);
    revealCompletion = () => move(find("#discovery"), main);
    move(find("#signal-result"), arrival);
    find("#signal-result").textContent = "Open Signal Lab in More to explore to send a ping and time its trip.";
    move(find(".signal-beam"), arrival);
    for (const selector of [".voyager-live", ".voyager-contact"]) move(find(selector), main);

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
    for (const selector of [".journey-explainer", ".community-library"]) move(find(selector), capsule);
    for (const selector of ["#hidden-facts-slot", "#discovery"]) move(find(selector), more);
  }

  const reading = create("div", { class: "module-reading", id: "module-reading" });
  const challenge = find(id === "voyager" ? "#greetings" : ".challenge-layout");
  challenge.after(reading);
  const story = disclosure("Story & science", "module-story-more");
  const brief = create("div", { class: "module-science-notes" });
  reading.append(story);
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
  story.append(brief);
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
