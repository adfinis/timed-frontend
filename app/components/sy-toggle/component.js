import { assert } from "@ember/debug";
import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class SyToggle extends Component {
  constructor(...args) {
    super(...args);

    assert("You must pass a onToggle callback.", this.args.onToggle);
  }

  @action
  handleKeyUp(event) {
    // only trigger on "Space" key
    if (event.keyCode === 32 && !this.args.disabled) {
      this.args.onToggle();
    }
  }
}
