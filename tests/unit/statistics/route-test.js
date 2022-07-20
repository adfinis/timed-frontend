import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | statistics", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const route = this.owner.lookup("route:statistics");
    assert.ok(route);
  });
});
