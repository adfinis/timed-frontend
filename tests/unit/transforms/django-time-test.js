import { setupTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Unit | Transform | django time", function (hooks) {
  setupTest(hooks);

  test("serializes", function (assert) {
    const transform = this.owner.lookup("transform:django-time");

    const result = transform.serialize(
      moment({
        hour: 12,
        minute: 12,
        second: 12,
      })
    );

    assert.strictEqual(result, "12:12:12");

    const result2 = transform.serialize(
      moment({
        hour: 8,
        minute: 8,
        second: 8,
      })
    );

    assert.strictEqual(result2, "08:08:08");
  });

  test("deserializes", function (assert) {
    const transform = this.owner.lookup("transform:django-time");

    const result = transform.deserialize("12:12:12");

    assert.strictEqual(result.hour(), 12);
    assert.strictEqual(result.minute(), 12);
    assert.strictEqual(result.second(), 12);

    const result2 = transform.deserialize("08:08:08");

    assert.strictEqual(result2.hour(), 8);
    assert.strictEqual(result2.minute(), 8);
    assert.strictEqual(result2.second(), 8);
  });
});
