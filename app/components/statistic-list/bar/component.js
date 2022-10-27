import classic from "ember-classic-decorator";
import { classNames, attributeBindings } from "@ember-decorators/component";
import { computed } from "@ember/object";
import Component from "@ember/component";
import { htmlSafe } from "@ember/string";

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
  positionalParams: ["value"]
});

export default StatisticListBarComponent;
