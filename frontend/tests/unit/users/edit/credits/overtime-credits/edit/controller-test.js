import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Unit | Controller | users/edit/credits/overtime credits/edit",
  function (hooks) {
    setupTest(hooks);

    test("exists", function (assert) {
      const controller = this.owner.lookup(
        "controller:users/edit/credits/overtime-credits/edit"
      );
      assert.ok(controller);
    });
  }
);
