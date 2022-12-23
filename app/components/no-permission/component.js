import { classNames } from "@ember-decorators/component";
import Component from "@ember/component";
import classic from "ember-classic-decorator";

@classic
@classNames("empty")
export default class NoPermission extends Component {}
