import { setupTest } from "ember-qunit";
import { module, test } from "qunit";
import { setup as setupTrackingStub } from "timed/tests/helpers/tracking-mock";

module("Unit | Controller | index", function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    setupTrackingStub(this);
  });

  test("exists", function (assert) {
    const controller = this.owner.lookup("controller:index");
    assert.ok(controller);
  });
});
