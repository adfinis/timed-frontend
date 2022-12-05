import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import classic from "ember-classic-decorator";

@classic
@tagName("")
export default class FilterSidebar extends Component {
  visible = false;

  didInsertElement(...args) {
    super.didInsertElement(...args);

    this.set("destination", document.getElementById("filter-sidebar-target"));
  }
}
