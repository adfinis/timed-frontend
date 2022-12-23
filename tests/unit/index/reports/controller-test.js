import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | index/reports", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const controller = this.owner.lookup("controller:index/reports");
    assert.ok(controller);
  });
});
