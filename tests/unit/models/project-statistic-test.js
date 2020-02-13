import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | project statistic", function(hooks) {
  setupTest(hooks);

  test("exists", function(assert) {
    const model = this.owner
      .lookup("service:store")
      .modelFor("project-statistic");

    assert.ok(model);
  });
});
