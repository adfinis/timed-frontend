import Component from "@ember/component";
import { computed } from "@ember/object";
import { htmlSafe } from "@ember/string";

const StatisticListBarComponent = Component.extend({
  classNames: ["statistic-list-bar"],

  attributeBindings: ["style"],

  style: computed("value", function () {
    return htmlSafe(`--value: ${this.get("value")}`);
  }),
});

StatisticListBarComponent.reopenClass({
  positionalParams: ["value"],
});

export default StatisticListBarComponent;
