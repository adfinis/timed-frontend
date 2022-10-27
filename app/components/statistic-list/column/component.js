import classic from "ember-classic-decorator";
import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";

@classic
@tagName("td")
export default class Column extends Component {}
