import Component from "@ember/component";
import { classNames, classNameBindings } from "@ember-decorators/component";
import classic from "ember-classic-decorator";

@classic
@classNames("filter-sidebar-group")
@classNameBindings("expanded:filter-sidebar-group--expanded")
export default class Group extends Component {
  expanded = false;
}
