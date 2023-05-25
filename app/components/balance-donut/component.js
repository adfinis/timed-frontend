import Component from "@glimmer/component";
import { cached } from "tracked-toolbox";

const { PI, floor, min, abs } = Math;

const { isInteger } = Number;
class BalanceDonutComponent extends Component {
  get value() {
    if (this.args.balance.usedDuration || !this.args.balance.credit) {
      return 1;
    }

    return abs(this.args.balance.usedDays / this.args.balance.credit);
  }

  get color() {
    if (this.args.balance.usedDuration) {
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

  @cached
  get style() {
    const mean = this.args.count / 2;

    const median = [floor(mean), ...(isInteger(mean) ? [floor(mean - 1)] : [])];

    const deviation = min(...median.map((m) => abs(m - this.args.index)));

    const offset =
      deviation && (1 / (floor(mean) - (isInteger(mean) ? 1 : 0))) * deviation;

    return { "--offset-multiplicator": offset.toString() };
  }
}

export default BalanceDonutComponent;
