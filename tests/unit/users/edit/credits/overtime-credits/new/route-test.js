import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module(
  "Unit | Route | users/edit/credits/overtime credits/new",
  function (hooks) {
    setupTest(hooks);

    test("exists", function (assert) {
      const route = this.owner.lookup(
        "route:users/edit/credits/overtime-credits/edit"
      );
      assert.ok(route);
    });
  }
);
