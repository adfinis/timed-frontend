import {
  classNames,
  attributeBindings,
  tagName,
} from "@ember-decorators/component";
import Component from "@glimmer/component";

@tagName("span")
@classNames("color-warning")
@attributeBindings("title")
export default class ChangedWarning extends Component {
  title = "This field has unsaved changes";
}
