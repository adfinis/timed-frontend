import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class OptimizedPowerSelectComponent extends Component {
  get extra() {
    return this.args.extra ?? {};
  }

  @action
  onFocus({ actions, isOpen }) {
    if (!isOpen) {
      actions.open();
    }
  }
}
