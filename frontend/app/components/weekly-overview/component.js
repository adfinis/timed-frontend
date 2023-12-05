import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class WeeklyOverview extends Component {
  @tracked height = 150;

  get hours() {
    return this.args.expected.asHours();
  }

  get style() {
    return { height: `${this.height}px` };
  }
}
