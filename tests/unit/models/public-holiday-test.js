import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | public holiday", function(hooks) {
  setupTest(hooks);

  test("exists", function(assert) {
    const model = this.owner.lookup("service:store").modelFor("public-holiday");

    assert.ok(model);
  });
});
