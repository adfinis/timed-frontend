import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | absence balance", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const model = this.owner
      .lookup("service:store")
      .modelFor("absence-balance");

    assert.ok(model);
  });
});
