import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | sso-login", function (hooks) {
  setupTest(hooks);

  test("it exists", function (assert) {
    const route = this.owner.lookup("route:sso-login");
    assert.ok(route);
  });
});
