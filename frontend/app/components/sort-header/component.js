import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class SortHeader extends Component {
  get direction() {
    return this.args.current?.startsWith("-") ? "down" : "up";
  }

  get getColname() {
    return this.args.current?.startsWith("-")
      ? this.args.current.substring(1)
      : this.args.current;
  }

  get active() {
    return this.getColname === this.args.by;
  }

  @action
  click() {
    const by = this.args.by;
    const sort = this.active && this.direction === "down" ? by : `-${by}`;

    this.args.update(sort);
  }
}
