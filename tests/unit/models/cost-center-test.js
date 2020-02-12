import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | cost center", function(hooks) {
  setupTest(hooks);

  test("exists", function(assert) {
    const model = this.owner.lookup("service:store").modelFor("cost-center");

    assert.ok(model);
  });
});
