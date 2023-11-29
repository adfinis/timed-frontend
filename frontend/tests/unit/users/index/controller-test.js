import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | users/index", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const controller = this.owner.lookup("controller:users/index");
    assert.ok(controller);
  });
});
