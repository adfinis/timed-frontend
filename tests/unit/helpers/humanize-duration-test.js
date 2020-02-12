import moment from "moment";
import { module, test } from "qunit";
import { humanizeDurationFn } from "timed/helpers/humanize-duration";

module("Unit | Helper | humanize duration", function() {
  test("works", function(assert) {
    const duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    });

    const result = humanizeDurationFn([duration]);

    assert.equal(result, "3h 56m");
  });

  test("works with seconds", function(assert) {
    const duration = moment.duration({
      hours: 3,
      minutes: 56,
      seconds: 59
    });

    const result = humanizeDurationFn([duration, true]);

    assert.equal(result, "3h 56m 59s");
  });
});
