import Component from "@glimmer/component";

export default class SyCheckmark extends Component {
  get icon() {
    return this.args.checked ? "check-square-o" : "square-o";
  }
}
