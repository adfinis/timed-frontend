import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class OptimizedPowerSelectTriggerComponent extends Component {
  @action
  clear(e) {
    e.stopPropagation();
    this.args.select.actions.select(null);
    if (e.type === "touchstart") {
      return false;
    }
  }
}
