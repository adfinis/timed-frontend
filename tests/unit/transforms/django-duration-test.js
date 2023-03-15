import { setupTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Unit | Transform | django duration", function (hooks) {
  setupTest(hooks);

  test("serializes", function (assert) {
    const transform = this.owner.lookup("transform:django-duration");

    assert.notOk(transform.serialize(null));

    assert.strictEqual(
      transform.serialize(
        moment.duration({
          hours: 1,
          minutes: 2,
          seconds: 3,
        })
      ),
      "01:02:03"
    );

    assert.strictEqual(
      transform.serialize(
        moment.duration({
          days: 1,
          hours: 2,
          minutes: 3,
          seconds: 4,
        })
      ),
      "1 02:03:04"
    );

    assert.strictEqual(
      transform.serialize(
        moment.duration({
          hours: 1,
          minutes: 2,
          seconds: 3,
          milliseconds: 4,
        })
      ),
      "01:02:03.004000"
    );

    assert.strictEqual(
      transform.serialize(
        moment.duration({
          days: 1,
          hours: 2,
          minutes: 3,
          seconds: 4,
          milliseconds: 5,
        })
      ),
      "1 02:03:04.005000"
    );

    assert.strictEqual(
      transform.serialize(
        moment.duration({
          hours: -1,
          minutes: -2,
          seconds: -3,
        })
      ),
      "-1 22:57:57"
    );

    assert.strictEqual(
      transform.serialize(
        moment.duration({
          days: -9,
          hours: -1,
          minutes: -2,
          seconds: -3,
        })
      ),
      "-10 22:57:57"
    );
  });

  test("deserializes", function (assert) {
    const transform = this.owner.lookup("transform:django-duration");

    assert.ok(transform.deserialize("00:00:00"));
  });
});
