import { setupTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Unit | Model | attendance", function (hooks) {
  setupTest(hooks);

  test("exists", function (assert) {
    const model = this.owner.lookup("service:store").modelFor("attendance");

    assert.ok(model);
  });

  test("calculates the duration", function (assert) {
    const model = this.owner
      .lookup("service:store")
      .createRecord("attendance", {
        from: moment({ h: 8, m: 0, s: 0 }),
        to: moment({ h: 17, m: 0, s: 0 }),
      });

    assert.strictEqual(model.get("duration").asHours(), 9);
  });

  test("calculates the duration when the end time is 00:00", function (assert) {
    const model = this.owner
      .lookup("service:store")
      .createRecord("attendance", {
        from: moment({ h: 0, m: 0, s: 0 }),
        to: moment({ h: 0, m: 0, s: 0 }),
      });

    assert.strictEqual(model.get("duration").asHours(), 24);
  });
});
