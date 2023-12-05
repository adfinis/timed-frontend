import Component from "@glimmer/component";

export default class RecordButton extends Component {
  get active() {
    return this.args.recording && this.args.activity?.id;
  }
}
