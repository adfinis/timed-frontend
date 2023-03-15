import moment from "moment";
import { module, test } from "qunit";
import parseDjangoDuration from "timed/utils/parse-django-duration";

module("Unit | Utility | parse django duration", function () {
  test("works", function (assert) {
    assert.notOk(parseDjangoDuration(""));
    assert.notOk(parseDjangoDuration(null));

    assert.strictEqual(
      parseDjangoDuration("01:02:03").asMilliseconds(),
      moment
        .duration({
          hours: 1,
          minutes: 2,
          seconds: 3,
        })
        .asMilliseconds()
    );

    assert.strictEqual(
      parseDjangoDuration("1 02:03:04").asMilliseconds(),
      moment
        .duration({
          days: 1,
          hours: 2,
          minutes: 3,
          seconds: 4,
        })
        .asMilliseconds()
    );

    assert.strictEqual(
      parseDjangoDuration("01:02:03.004000").asMilliseconds(),
      moment
        .duration({
          hours: 1,
          minutes: 2,
          seconds: 3,
          milliseconds: 4,
        })
        .asMilliseconds()
    );

    assert.strictEqual(
      parseDjangoDuration("1 02:03:04.005000").asMilliseconds(),
      moment
        .duration({
          days: 1,
          hours: 2,
          minutes: 3,
          seconds: 4,
          milliseconds: 5,
        })
        .asMilliseconds()
    );

    assert.strictEqual(
      parseDjangoDuration("-1 22:57:57").asMilliseconds(),
      moment
        .duration({
          hours: -1,
          minutes: -2,
          seconds: -3,
        })
        .asMilliseconds()
    );

    assert.strictEqual(
      parseDjangoDuration("-10 22:57:57").asMilliseconds(),
      moment
        .duration({
          days: -9,
          hours: -1,
          minutes: -2,
          seconds: -3,
        })
        .asMilliseconds()
    );
  });
});
