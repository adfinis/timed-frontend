import { action } from "@ember/object";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
export default class WeeklyOverviewDay extends Component {
  /**
   * Maximum worktime in hours
   *
   * @property {Number} max
   * @public
   */
  @tracked max = 20;

  get title() {
    const pre = this.args.prefix?.length ? `${this.args.prefix}, ` : "";

    let title = `${this.args.worktime.hours()}h`;

    if (this.args.worktime.minutes()) {
      title += ` ${this.args.worktime.minutes()}m`;
    }
    return `${pre}${title}`;
  }

  get style() {
    const height = Math.min(
      (this.args.worktime.asHours() / this.max) * 100,
      100
    );
    return { height: `${height}%` };
  }

  @action
  click(event) {
    const action = this.args.onClick;

    if (action) {
      event.preventDefault();

      this.args.onClick(this.args.day);
    }
  }
}
