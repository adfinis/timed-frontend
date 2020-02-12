import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | customer", function(hooks) {
  setupTest(hooks);

  test("exists", function(assert) {
    const model = this.owner.lookup("service:store").modelFor("customer");

    assert.ok(model);
  });
});
