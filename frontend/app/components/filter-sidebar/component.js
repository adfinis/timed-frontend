import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class FilterSidebar extends Component {
  @tracked visible = false;
  @tracked destination;

  constructor(...args) {
    super(...args);
    this.destination = document.getElementById("filter-sidebar-target");
  }
}
