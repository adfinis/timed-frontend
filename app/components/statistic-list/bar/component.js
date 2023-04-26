import Component from "@glimmer/component";

export default class StatisticListBar extends Component {
  get didFinishEffortsInBudget() {
    if (this.args.remaining === 0 && this.args.value < this.args.goal) {
      return true;
    }
    return false;
  }

  get didFinishEffortsOverBudget() {
    if (this.args.value > this.args.goal) {
      return true;
    }
    return false;
  }
}
