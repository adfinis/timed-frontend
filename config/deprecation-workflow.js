/* eslint-disable no-undef */
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember.component.reopen" }, // not finish yet
    {
      // the issue exists in ember scrollable package
      handler: "silence",
      matchId: "deprecated-run-loop-and-computed-dot-access",
    },
    // This error is caused by ember-parachute and will persist
    // until we have refactored all controllers and routes to not use ember-parachute
    { handler: "silence", matchId: "ember-utils.try-invoke" },
    { handler: "silence", matchId: "this-property-fallback" },
  ],
};
