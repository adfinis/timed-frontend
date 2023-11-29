import { settled } from "@ember/test-helpers";
import { setupMirage } from "ember-cli-mirage/test-support";
import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Service | tracking", function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);

  test("exists", async function (assert) {
    const service = this.owner.lookup("service:tracking");
    await settled();
    assert.ok(service);
  });
});
