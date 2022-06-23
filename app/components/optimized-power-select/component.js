import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class OptimizedPowerSelectComponent extends Component {
  @tracked optionsArray = [];

  constructor(...args) {
    super(...args);

    this.extra = this.args.extra ?? {};
    const options = this.args.options;

    options.then((data) => {
      this.optionsArray = data;
    });
  }

  get options() {
    return this.optionsArray;
  }
}
