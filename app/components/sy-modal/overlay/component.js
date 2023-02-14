import { registerDestructor } from "@ember/destroyable";
import { action } from "@ember/object";
import Component from "@glimmer/component";

export default class SyModalOverlay extends Component {
  @action
  setupClickHandler(element) {
    this.element = element;

    element.addEventListener("click", this.handleClick);

    registerDestructor(this, () => {
      element.removeEventListener("click", this.handleClick);
    });
  }

  @action
  handleClick(e) {
    if (e.target === this.element) {
      this.args.onClose();
    }
  }
}
