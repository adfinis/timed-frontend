import classic from "ember-classic-decorator";
import { classNames, attributeBindings, tagName } from "@ember-decorators/component";
import Component from "@ember/component";

@classic
@tagName("span")
@classNames("color-warning")
@attributeBindings("title")
export default class ChangedWarning extends Component {
  title = "This field has unsaved changes";
}
