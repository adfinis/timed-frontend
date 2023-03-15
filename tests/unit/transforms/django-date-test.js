import { setupTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Unit | Transform | django date", function (hooks) {
  setupTest(hooks);

  test("serializes", function (assert) {
    const transform = this.owner.lookup("transform:django-date");

    const result = transform.serialize(
      moment({
        y: 2017,
        M: 2, // moments months are zerobased
        d: 11,
      })
    );

    assert.strictEqual(result, "2017-03-11");
  });

  test("deserializes", function (assert) {
    const transform = this.owner.lookup("transform:django-date");

    assert.notOk(transform.deserialize(""));
    assert.notOk(transform.deserialize(null));

    const result = transform.deserialize("2017-03-11");

    assert.strictEqual(result.year(), 2017);
    assert.strictEqual(result.month(), 2); // moments months are zerobased
    assert.strictEqual(result.date(), 11);
  });
});
