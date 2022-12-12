import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import { computed } from "@ember/object";
import classic from "ember-classic-decorator";

const getDirection = (state) => {
  return state.startsWith("-") ? "desc" : "asc";
};

const getColname = (state) =>
  state.startsWith("-") ? state.substring(1) : state;

@classic
@tagName("th")
export default class SortHeader extends Component {
  @(computed("current").readOnly())
  get direction() {
    return getDirection(this.current);
  }

  @(computed("current").readOnly())
  get active() {
    const by = this.by;
    const current = this.current;

    return getColname(current) === by;
  }

  click() {
    const current = this.current;
    const by = this.by;
    const sort =
      this.active && getDirection(current) === "desc" ? by : `-${by}`;

    this.update(sort);
  }
}
