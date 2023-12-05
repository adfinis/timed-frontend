import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | protected", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const controller = this.owner.lookup("controller:protected");
    assert.ok(controller);
  });
});
