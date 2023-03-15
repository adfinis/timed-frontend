import moment from "moment";
import { module, test } from "qunit";
import formatDuration from "timed/utils/format-duration";

module("Unit | Utility | format duration", function () {
  test("works", function (assert) {
    const duration = moment.duration({
      hours: 11,
      minutes: 50,
      seconds: 15,
    });

    const result = formatDuration(duration);

    assert.strictEqual(result, "11:50:15");
  });

  test("converts days into hours", function (assert) {
    const duration = moment.duration({
      hours: 44,
      minutes: 24,
      seconds: 19,
    });

    const result = formatDuration(duration);

    assert.strictEqual(result, "44:24:19");
  });

  test("zeropads all numbers", function (assert) {
    const duration = moment.duration({
      hours: 1,
      minutes: 1,
      seconds: 1,
    });

    const result = formatDuration(duration);

    assert.strictEqual(result, "01:01:01");
  });

  test("can hide seconds", function (assert) {
    const duration = moment.duration({
      hours: 22,
      minutes: 12,
    });

    const result = formatDuration(duration, false);

    assert.strictEqual(result, "22:12");
  });

  test("can be negative", function (assert) {
    const duration = moment.duration({
      hours: -1,
      minutes: -1,
      seconds: -1,
    });

    const result = formatDuration(duration);

    assert.strictEqual(result, "-01:01:01");
  });

  test("has a fallback", function (assert) {
    const result1 = formatDuration(null);

    assert.strictEqual(result1, "--:--:--");

    const result2 = formatDuration(null, false);

    assert.strictEqual(result2, "--:--");
  });

  test("works with a number instead of a duration", function (assert) {
    const num = 11 * 60 * 60 * 1000 + 12 * 60 * 1000 + 13 * 1000;

    const result1 = formatDuration(num);

    assert.strictEqual(result1, "11:12:13");

    const result2 = formatDuration(num, false);

    assert.strictEqual(result2, "11:12");
  });
});
