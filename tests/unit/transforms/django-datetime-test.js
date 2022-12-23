import { setupTest } from "ember-qunit";
import moment from "moment";
import { module, test } from "qunit";

module("Unit | Transform | django datetime", function (hooks) {
  setupTest(hooks);

  test("serializes", function (assert) {
    const transform = this.owner.lookup("transform:django-datetime");

    const zone = moment().utcOffset();

    const datetime = moment({
      y: 2017,
      M: 2, // moments months are zerobased
      d: 11,
      h: 15,
      m: 30,
      s: 50,
      ms: 11,
    }).utcOffset(zone);

    const result = transform.serialize(datetime);

    assert.equal(result, datetime.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"));
  });

  test("deserializes", function (assert) {
    const transform = this.owner.lookup("transform:django-datetime");

    const datetime = moment({
      y: 2017,
      M: 2, // moments months are zerobased
      d: 11,
      h: 15,
      m: 30,
      s: 50,
      ms: 11,
    }).utc();

    assert.notOk(transform.deserialize(""));
    assert.notOk(transform.deserialize(null));

    const result = transform
      .deserialize(datetime.format("YYYY-MM-DDTHH:mm:ss.SSSSZ"))
      .utc();

    assert.equal(result.toISOString(), datetime.toISOString());
  });
});
