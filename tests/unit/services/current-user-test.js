import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | currentUser", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const service = this.owner.lookup("service:currentUser");
    assert.ok(service);
  });
});
