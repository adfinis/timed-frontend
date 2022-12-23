import { tagName } from "@ember-decorators/component";
import Component from "@ember/component";
import classic from "ember-classic-decorator";

@classic
@tagName("label")
export default class Label extends Component {}
