import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | analysis/index", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const route = this.owner.lookup("route:analysis/index");
    assert.ok(route);
  });
});
