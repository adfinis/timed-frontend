import Component from "@ember/component";
import {
  classNames,
  attributeBindings,
  tagName,
} from "@ember-decorators/component";
import classic from "ember-classic-decorator";

@classic
@tagName("span")
@classNames("color-info")
@attributeBindings("title")
export default class NotIdenticalWarning extends Component {
  title = "Not all of the provided values are identical";
}
