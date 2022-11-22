import Component from "@glimmer/component";

export default class OptimizedPowerSelectComponent extends Component {
  get extra() {
    return this.args.extra ?? {};
  }
}
