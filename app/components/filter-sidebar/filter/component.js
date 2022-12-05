import Component from "@ember/component";
import classic from "ember-classic-decorator";

@classic
class FilterSidebarFilterComponent extends Component {}

FilterSidebarFilterComponent.reopenClass({
  positionalParams: ["type"],
});

export default FilterSidebarFilterComponent;
