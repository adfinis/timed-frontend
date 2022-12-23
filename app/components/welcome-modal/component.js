import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import classic from "ember-classic-decorator";

@classic
@tagName("")
export default class WelcomeModal extends Component {
  "on-never"() {}
  "on-later"() {}
  "on-start"() {}
}
