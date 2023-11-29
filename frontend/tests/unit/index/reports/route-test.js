import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | index/reports", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const route = this.owner.lookup("route:index/reports");
    assert.ok(route);
  });
});
