import Component from "@glimmer/component";

export default class OptimizedPowerSelectComponent extends Component {
  constructor(...args) {
    super(...args);

    this.extra = this.args.extra ?? {};
  }

  get options() {
    return this.args.options;
  }
}
