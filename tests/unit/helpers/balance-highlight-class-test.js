import moment from "moment";
import { module, test } from "qunit";
import { balanceHighlightClass } from "timed/helpers/balance-highlight-class";

module("Unit | Helper | balance highlight class", function() {
  test("returns an empty string on neutral durations", function(assert) {
    const result = balanceHighlightClass([moment.duration({ h: 0, m: 0 })]);

    assert.equal(result, "");
  });

  test("returns an empty string on anything other than a duration", function(assert) {
    const result = balanceHighlightClass([1337]);

    assert.equal(result, "");
  });

  test("returns `color-success` on positive durations", function(assert) {
    const result = balanceHighlightClass([moment.duration({ h: 1, m: 30 })]);

    assert.equal(result, "color-success");
  });

  test("returns `color-danger` on negative durations", function(assert) {
    const result = balanceHighlightClass([moment.duration({ h: -1, m: 30 })]);

    assert.equal(result, "color-danger");
  });
});
