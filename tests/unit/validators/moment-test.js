import moment from "moment";
import { module, test } from "qunit";
import validateMoment from "timed/validators/moment";

module("Unit | Validator | moment", function() {
  test("works without value", function(assert) {
    assert.equal(validateMoment()("key", null, null, {}, {}), false);
    assert.equal(validateMoment()("key", moment(), null, {}, {}), true);
  });

  test("works with gt", function(assert) {
    assert.equal(
      validateMoment({ gt: "otherKey" })(
        "key",
        moment(),
        null,
        {},
        { otherKey: moment().add(-1, "second") }
      ),
      true
    );

    assert.equal(
      validateMoment({ gt: "otherKey" })(
        "key",
        moment(),
        null,
        {},
        { otherKey: moment().add(1, "second") }
      ),
      false
    );
  });

  test("works with lt", function(assert) {
    assert.equal(
      validateMoment({ lt: "otherKey" })(
        "key",
        moment(),
        null,
        {},
        { otherKey: moment().add(1, "second") }
      ),
      true
    );

    assert.equal(
      validateMoment({ lt: "otherKey" })(
        "key",
        moment(),
        null,
        {},
        { otherKey: moment().add(-1, "second") }
      ),
      false
    );
  });

  test("works with gt and lt", function(assert) {
    assert.equal(
      validateMoment({ lt: "ltKey", gt: "gtKey" })(
        "key",
        moment(),
        null,
        {},
        {
          gtKey: moment().add(-1, "second"),
          ltKey: moment().add(1, "second")
        }
      ),
      true
    );
  });

  test("works with changes", function(assert) {
    assert.equal(
      validateMoment({ lt: "ltKey", gt: "gtKey" })(
        "key",
        moment(),
        null,
        {
          gtKey: moment().add(-1, "second"),
          ltKey: moment().add(1, "second")
        },
        {}
      ),
      true
    );
  });

  test("prefers changes before the original object", function(assert) {
    assert.equal(
      validateMoment({ gt: "gtKey" })(
        "key",
        moment(),
        null,
        {
          gtKey: moment().add(-1, "second")
        },
        {
          gtKey: moment().add(1, "second")
        }
      ),
      true
    );
  });
});
