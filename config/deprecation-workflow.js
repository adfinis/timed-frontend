/* eslint-disable no-undef */
window.deprecationWorkflow = window.deprecationWorkflow || {};
self.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ensure-safe-component.string" }, // optimized-power-select
    {
      handler: "silence",
      matchId: "deprecated-run-loop-and-computed-dot-access", // ember scrollable
    },
    { handler: "silence", matchId: "this-property-fallback" }, // ember scrollable
  ],
};
