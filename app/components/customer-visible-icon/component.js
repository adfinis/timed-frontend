import classic from "ember-classic-decorator";
import { attributeBindings } from "@ember-decorators/component";
import Component from "@ember/component";

@classic
@attributeBindings("title")
export default class CustomerVisibleIcon extends Component {
  title = "This project's comments are visible to the customer";
}
