import classic from "ember-classic-decorator";
import Component from "@ember/component";

@classic
class FilterSidebarFilterComponent extends Component {}

FilterSidebarFilterComponent.reopenClass({
  positionalParams: ["type"]
});

export default FilterSidebarFilterComponent;
