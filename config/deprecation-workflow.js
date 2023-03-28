/* eslint-disable no-undef */
window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "throw", matchId: "ember-global" },
    { handler: "silence", matchId: "ember.component.reopen" }, // not finish yet
    { handler: "throw", matchId: "ember-metal.get-with-default" },
    { handler: "silence", matchId: "implicit-injections" },
    {
      // Fixed
      handler: "throw",
      matchId: "ember-views.curly-components.jquery-element",
    },
    {
      // the issue exists in ember scrollable package
      handler: "silence",
      matchId: "deprecated-run-loop-and-computed-dot-access",
    },
    // { handler: "throw", matchId: "ember-utils.try-invoke" }, something in ember core
    { handler: "silence", matchId: "this-property-fallback" },
    { handler: "throw", matchId: "autotracking.mutation-after-consumption" },
    { handler: "throw", matchId: "manager-capabilities.modifiers-3-13" },
    { handler: "throw", matchId: "setting-on-hash" },
    { handler: "throw", matchId: "routing.transition-methods" },
  ],
};
