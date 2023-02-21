import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import classic from "ember-classic-decorator";

@classic
@classNames("pagination-limit")
export default class PaginationLimit extends Component {
  init(...args) {
    super.init(...args);

    this.set("limits", [10, 20, 50, 100]);
  }
}
