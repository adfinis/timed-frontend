import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Controller | controllers/qpcontroller", function (hooks) {
  setupTest(hooks);

  test("get all query params", function (assert) {
    const controller = this.owner.lookup("controller:qpcontroller");
    controller.queryParams = ["qp1", "qp2"];
    controller.qp1 = "baz";
    controller.qp2 = "foo";

    assert.strictEqual(controller.allQueryParams.qp1, "baz");
    assert.strictEqual(controller.allQueryParams.qp2, "foo");
  });

  test("reset query params", function (assert) {
    const controller = this.owner.lookup("controller:qpcontroller");
    controller.queryParams = ["qp1", "qp2"];
    controller.qp1 = "baz";
    controller.qp2 = "foo";

    controller.resetQueryParams();

    assert.strictEqual(controller.allQueryParams.qp1, undefined);
    assert.strictEqual(controller.allQueryParams.qp2, undefined);
  });
});
