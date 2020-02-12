import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | metadata fetcher", function(hooks) {
  setupTest(hooks);

  test("exists", function(assert) {
    const service = this.owner.lookup("service:metadata-fetcher");
    assert.ok(service);
  });
});
