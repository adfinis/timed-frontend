window.deprecationWorkflow = window.deprecationWorkflow || {};
window.deprecationWorkflow.config = {
  workflow: [
    { handler: "silence", matchId: "ember-global" },
    { handler: "silence", matchId: "ember.component.reopen" },
    { handler: "silence", matchId: "ember-metal.get-with-default" },
    { handler: "silence", matchId: "implicit-injections" },
    {
      handler: "silence",
      matchId: "ember-views.curly-components.jquery-element",
    },
    {
      handler: "silence",
      matchId: "deprecated-run-loop-and-computed-dot-access",
    },
    { handler: "silence", matchId: "ember-utils.try-invoke" },
    { handler: "silence", matchId: "this-property-fallback" },
    { handler: "silence", matchId: "autotracking.mutation-after-consumption" },
    { handler: "silence", matchId: "manager-capabilities.modifiers-3-13" },
    { handler: "silence", matchId: "setting-on-hash" },
  ],
};
