import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | rejectedReports", function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test("it exists", function (assert) {
    const service = this.owner.lookup("service:rejected-reports");
    assert.ok(service);
  });
});
