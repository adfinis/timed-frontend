import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | index/activities/edit", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const controller = this.owner.lookup("controller:index/activities/edit");
    assert.ok(controller);
  });
});
