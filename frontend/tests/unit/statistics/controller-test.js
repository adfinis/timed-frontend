import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | statistics", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const controller = this.owner.lookup("controller:statistics");
    assert.ok(controller);
  });
});
