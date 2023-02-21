import Component from "@ember/component";
import {
  classNames,
  attributeBindings,
  tagName,
} from "@ember-decorators/component";
import classic from "ember-classic-decorator";

@classic
@tagName("span")
@classNames("color-warning")
@attributeBindings("title")
export default class ChangedWarning extends Component {
  title = "This field has unsaved changes";
}
