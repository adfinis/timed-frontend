import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | index/activities", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const controller = this.owner.lookup("controller:index/activities");
    assert.ok(controller);
  });
});
