import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | users/edit", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const route = this.owner.lookup("route:users/edit");
    assert.ok(route);
  });
});
