import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | no-access", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:no-access");
    assert.ok(route);
  });
});
