export const frictionLines = Object.freeze({
  curiosity: "Rovers move slowly and think first. Replan, then roll.",
  ingenuity: "Every flight was a risk they chose. Set it up and go again.",
  webb: "Eighteen stars is not failure. It is where alignment starts.",
});

// One instance belongs to an exhibit's attempt sequence. Retrying a plan or
// flight keeps it; resetting/leaving the exhibit starts a fresh sequence.
export function createFrictionFeedback() {
  const introduced = new Set();
  return {
    failure(id, plainHint = "") {
      if (!Object.hasOwn(frictionLines, id) || introduced.has(id)) return plainHint;
      introduced.add(id);
      return frictionLines[id];
    },
    reset(id) {
      if (id === undefined) introduced.clear();
      else introduced.delete(id);
    },
  };
}
