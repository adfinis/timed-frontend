import moment from "moment";
import { module, test } from "qunit";
import humanizeDuration from "timed/utils/humanize-duration";

module("Unit | Utility | humanize duration", function () {
  test("works", function (assert) {
    const duration = moment.duration({
      hours: 11,
      minutes: 12,
      seconds: 13,
    });

    const result = humanizeDuration(duration);

    assert.strictEqual(result, "11h 12m");
  });

  test("works with seconds", function (assert) {
    const duration = moment.duration({
      hours: 11,
      minutes: 12,
      seconds: 13,
    });

    const result = humanizeDuration(duration, true);

    assert.strictEqual(result, "11h 12m 13s");
  });

  test("renders days as hours", function (assert) {
    const duration = moment.duration({
      days: 2,
      hours: 2,
      minutes: 0,
    });

    const result = humanizeDuration(duration);

    assert.strictEqual(result, "50h 0m");
  });

  test("has a fallback", function (assert) {
    const result = humanizeDuration(null);

    assert.strictEqual(result, "0h 0m");
  });

  test("has a fallback with seconds", function (assert) {
    const result = humanizeDuration(null, true);

    assert.strictEqual(result, "0h 0m 0s");
  });

  test("splits big numbers", function (assert) {
    const hours = 1000000;

    const duration = moment.duration({ hours });

    const result = humanizeDuration(duration);

    assert.strictEqual(result, `${hours.toLocaleString("de-CH")}h 0m`);
  });

  test("works with negative durations", function (assert) {
    const result = humanizeDuration(
      moment.duration({ hours: -4, minutes: -30 })
    );

    assert.strictEqual(result, "-4h 30m");
  });
});
