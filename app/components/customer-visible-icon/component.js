import { attributeBindings } from "@ember-decorators/component";
import Component from "@ember/component";
import classic from "ember-classic-decorator";

@classic
@attributeBindings("title")
export default class CustomerVisibleIcon extends Component {
  title = "This project's comments are visible to the customer";
}
