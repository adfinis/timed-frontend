import { classNames, attributeBindings } from "@ember-decorators/component";
import Component from "@ember/component";
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/string";
import classic from "ember-classic-decorator";

@classic
@classNames("statistic-list-bar")
@attributeBindings("style")
class StatisticListBarComponent extends Component {
  @computed("value")
  get style() {
    return htmlSafe(`--value: ${this.value}`);
  }
}

StatisticListBarComponent.reopenClass({
  positionalParams: ["value"],
});

export default StatisticListBarComponent;
