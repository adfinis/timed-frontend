import classic from "ember-classic-decorator";
import { computed } from "@ember/object";
import FaIconComponent from "ember-font-awesome/components/fa-icon";

@classic
export default class SyCheckmark extends FaIconComponent {
  checked = false;

  @computed("checked")
  get icon() {
    return this.checked ? "check-square-o" : "square-o";
  }
}
