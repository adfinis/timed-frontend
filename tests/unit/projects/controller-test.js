import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | projects", function(hooks) {
  setupTest(hooks);

  test("exists", function(assert) {
    const controller = this.owner.lookup("controller:projects");
    assert.ok(controller);
  });
});
