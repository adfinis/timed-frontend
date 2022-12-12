import { setupTest } from "ember-qunit";
import { module, test } from "qunit";

module("Unit | Serializer | attendance", function (hooks) {
  setupTest(hooks);

  test("serializes records", function (assert) {
    const record = this.owner
      .lookup("service:store")
      .createRecord("attendance");

    const serializedRecord = record.serialize();

    assert.ok(serializedRecord);
  });
});
