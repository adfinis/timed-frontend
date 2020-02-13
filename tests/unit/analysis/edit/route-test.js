import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Route | analysis/edit", function(hooks) {
  setupTest(hooks);

  test("exists", function(assert) {
    const route = this.owner.lookup("route:analysis/edit");
    assert.ok(route);
  });
});
