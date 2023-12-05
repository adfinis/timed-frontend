import Component from "@glimmer/component";

export default class StatisticListBar extends Component {
  get didFinishEffortsInBudget() {
    return (
      this.args.remaining === 0 &&
      !this.didFinishEffortsOverBudget &&
      this.args.archived
    );
  }

  get didFinishEffortsOverBudget() {
    return this.args.value > this.args.goal;
  }

  get spentEffortsBarColor() {
    if (this.didFinishEffortsInBudget) {
      return "strong-success";
    }
    if (this.didFinishEffortsOverBudget) {
      return "strong-danger";
    }
    return "";
  }
}
