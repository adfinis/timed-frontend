import { action } from "@ember/object";
import Component from "@glimmer/component";

const getDirection = (state) => {
  return state?.startsWith("-") ? "desc" : "asc";
};

const getColname = (state) =>
  state?.startsWith("-") ? state.substring(1) : state;

export default class SortHeader extends Component {
  get direction() {
    return getDirection(this.args.current);
  }

  get active() {
    const by = this.args.by;
    const current = this.args.current;

    return getColname(current) === by;
  }

  @action
  click() {
    const by = this.args.by;
    const sort = this.active && this.direction === "desc" ? by : `-${by}`;

    this.args.update(sort);
  }
}
