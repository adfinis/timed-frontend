import Component from "@ember/component";
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/string";

const { PI, floor, min, abs } = Math;

const { isInteger } = Number;

const BalanceDonutComponent = Component.extend({
  attributeBindings: ["style"],

  classNameBindings: ["color"],

  value: computed("balance.{usedDays,usedDuration,credit}", function () {
    if (this.get("balance.usedDuration") || !this.get("balance.credit")) {
      return 1;
    }

    return abs(this.get("balance.usedDays") / this.get("balance.credit"));
  }),

  color: computed("value", "balance.usedDuration", function () {
    if (this.get("balance.usedDuration")) {
      return "primary";
    }

    if (this.get("value") > 1 || this.get("value") < 0) {
      return "danger";
    }

    if (this.get("value") === 1) {
      return "warning";
    }

    return "success";
  }),

  radius: 100 / (2 * PI),

  style: computed("count", "index", function () {
    const mean = this.get("count") / 2;

    const median = [floor(mean), ...(isInteger(mean) ? [floor(mean - 1)] : [])];

    const deviation = min(...median.map((m) => abs(m - this.get("index"))));

    const offset =
      deviation && (1 / (floor(mean) - (isInteger(mean) ? 1 : 0))) * deviation;

    return htmlSafe(`--offset-multiplicator: ${offset};`);
  }),
});

BalanceDonutComponent.reopenClass({
  positionalParams: ["balance"],
});

export default BalanceDonutComponent;
