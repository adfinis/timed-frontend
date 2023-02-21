import Component from "@ember/component";
import { classNames } from "@ember-decorators/component";
import classic from "ember-classic-decorator";

@classic
@classNames("empty")
export default class NoPermission extends Component {}
