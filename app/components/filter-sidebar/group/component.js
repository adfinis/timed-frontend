import { classNames, classNameBindings } from "@ember-decorators/component";
import Component from "@ember/component";
import classic from "ember-classic-decorator";

@classic
@classNames("filter-sidebar-group")
@classNameBindings("expanded:filter-sidebar-group--expanded")
export default class Group extends Component {
  expanded = false;
}
