import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

export default class Group extends Component {
  @tracked expanded = false;
}
