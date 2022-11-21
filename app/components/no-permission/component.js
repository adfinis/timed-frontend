import classic from "ember-classic-decorator";
import { classNames } from "@ember-decorators/component";
import Component from "@ember/component";

@classic
@classNames("empty")
export default class NoPermission extends Component {}
