import classic from "ember-classic-decorator";
import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";

@classic
@tagName("")
export default class WelcomeModal extends Component {
  "on-never"() {}
  "on-later"() {}
  "on-start"() {}
}
