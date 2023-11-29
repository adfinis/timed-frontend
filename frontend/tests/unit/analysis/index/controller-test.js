import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | analysis/index", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const controller = this.owner.lookup("controller:analysis/index");
    assert.ok(controller);
  });
});
