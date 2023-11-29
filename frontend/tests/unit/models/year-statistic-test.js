import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Model | year statistic", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const model = this.owner.lookup("service:store").modelFor("year-statistic");

    assert.ok(model);
  });
});
