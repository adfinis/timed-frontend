import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | overtime credit", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const model = this.owner
      .lookup("service:store")
      .modelFor("overtime-credit");

    assert.ok(model);
  });
});
