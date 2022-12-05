import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | users", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const route = this.owner.lookup("route:users");
    assert.ok(route);
  });
});
