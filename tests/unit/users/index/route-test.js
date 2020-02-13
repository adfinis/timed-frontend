import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | users/index", function(hooks) {
  setupTest(hooks);

  test("exists", function(assert) {
    const route = this.owner.lookup("route:users/index");
    assert.ok(route);
  });
});
