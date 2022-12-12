import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | activity", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const model = this.owner.lookup("service:store").createRecord("activity");

    assert.ok(model);
  });
});
