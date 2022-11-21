import classic from "ember-classic-decorator";
import { classNames } from "@ember-decorators/component";
import Component from "@ember/component";

@classic
@classNames("pagination-limit")
export default class PaginationLimit extends Component {
  init(...args) {
    super.init(...args);

    this.set("limits", [10, 20, 50, 100]);
  }
}
