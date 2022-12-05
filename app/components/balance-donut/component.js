import {
  attributeBindings,
  classNameBindings,
} from "@ember-decorators/component";
import Component from "@ember/component";
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/string";
import classic from "ember-classic-decorator";

const { PI, floor, min, abs } = Math;

const { isInteger } = Number;

@classic
@attributeBindings("style")
@classNameBindings("color")
class BalanceDonutComponent extends Component {
  @computed("balance.{usedDays,usedDuration,credit}")
  get value() {
    if (this.get("balance.usedDuration") || !this.get("balance.credit")) {
      return 1;
    }

    return abs(this.get("balance.usedDays") / this.get("balance.credit"));
  }

  @computed("value", "balance.usedDuration")
  get color() {
    if (this.get("balance.usedDuration")) {
      return "primary";
    }

    if (this.value > 1 || this.value < 0) {
      return "danger";
    }

    if (this.value === 1) {
      return "warning";
    }

    return "success";
  }

  radius = 100 / (2 * PI);

  @computed("count", "index")
  get style() {
    const mean = this.count / 2;

    const median = [floor(mean), ...(isInteger(mean) ? [floor(mean - 1)] : [])];

    const deviation = min(...median.map((m) => abs(m - this.index)));

    const offset =
      deviation && (1 / (floor(mean) - (isInteger(mean) ? 1 : 0))) * deviation;

    return htmlSafe(`--offset-multiplicator: ${offset};`);
  }
}

BalanceDonutComponent.reopenClass({
  positionalParams: ["balance"],
});

export default BalanceDonutComponent;
