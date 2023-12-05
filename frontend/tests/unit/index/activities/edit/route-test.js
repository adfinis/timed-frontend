import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | index/activities/edit", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const route = this.owner.lookup("route:index/activities/edit");
    assert.ok(route);
  });
});
