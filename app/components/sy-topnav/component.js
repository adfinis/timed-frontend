import classic from "ember-classic-decorator";
import { classNames, classNameBindings, tagName } from "@ember-decorators/component";
import { inject as service } from "@ember/service";
import { or } from "@ember/object/computed";
import Component from "@ember/component";

@classic
@tagName("nav")
@classNames("nav-top", "nav-top--fixed")
@classNameBindings("expand:nav-top--expand")
export default class SyTopnav extends Component {
  @service("session")
  session;

  @service("media")
  media;

  expand = false;

  @or("media.isMo", "media.isXs", "media.isSm")
  navMobile;
}
