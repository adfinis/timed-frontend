import { tracked } from "@glimmer/tracking";
import classic from "ember-classic-decorator";
import FaIconComponent from "ember-font-awesome/components/fa-icon";

@classic
export default class SyCheckmark extends FaIconComponent {
  @tracked checked = false;

  get icon() {
    return this.checked ? "check-square-o" : "square-o";
  }
}
