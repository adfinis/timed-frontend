import moment from "moment";
import { module, test } from "qunit";
import validateMoment from "timed/validators/moment";

module("Unit | Validator | moment", function () {
  test("works without value", function (assert) {
    assert.strictEqual(
      validateMoment()("key", null, null, {}, {}),
      "The given value is not a valid value"
    );
    assert.true(validateMoment()("key", moment(), null, {}, {}));
  });

  test("works with gt", function (assert) {
    assert.true(
      validateMoment({ gt: "otherKey" })(
        "key",
        moment(),
        null,
        {},
        { otherKey: moment().add(-1, "second") }
      )
    );

    assert.strictEqual(
      validateMoment({ gt: "otherKey" })(
        "key",
        moment(),
        null,
        {},
        { otherKey: moment().add(1, "second") }
      ),
      "The value is smaller than otherKey"
    );
  });

  test("works with lt", function (assert) {
    assert.true(
      validateMoment({ lt: "otherKey" })(
        "key",
        moment(),
        null,
        {},
        { otherKey: moment().add(1, "second") }
      )
    );

    assert.strictEqual(
      validateMoment({ lt: "otherKey" })(
        "key",
        moment(),
        null,
        {},
        { otherKey: moment().add(-1, "second") }
      ),
      "The valus is larger than otherKey"
    );
  });

  test("works with gt and lt", function (assert) {
    assert.true(
      validateMoment({ lt: "ltKey", gt: "gtKey" })(
        "key",
        moment(),
        null,
        {},
        {
          gtKey: moment().add(-1, "second"),
          ltKey: moment().add(1, "second"),
        }
      )
    );
  });

  test("works with changes", function (assert) {
    assert.true(
      validateMoment({ lt: "ltKey", gt: "gtKey" })(
        "key",
        moment(),
        null,
        {
          gtKey: moment().add(-1, "second"),
          ltKey: moment().add(1, "second"),
        },
        {}
      )
    );
  });

  test("prefers changes before the original object", function (assert) {
    assert.true(
      validateMoment({ gt: "gtKey" })(
        "key",
        moment(),
        null,
        {
          gtKey: moment().add(-1, "second"),
        },
        {
          gtKey: moment().add(1, "second"),
        }
      )
    );
  });
});
