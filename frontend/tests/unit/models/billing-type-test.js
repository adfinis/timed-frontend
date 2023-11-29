import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | billing type", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const model = this.owner.lookup("service:store").modelFor("billing-type");

    assert.ok(model);
  });
});
