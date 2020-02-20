import Component from "@ember/component";
import { or } from "@ember/object/computed";
import { inject as service } from "@ember/service";

export default Component.extend({
  tagName: "nav",
  classNames: ["nav-top", "nav-top--fixed"],
  classNameBindings: ["expand:nav-top--expand"],
  session: service("session"),
  media: service("media"),
  expand: false,
  navMobile: or("media.isMo", "media.isXs", "media.isSm")
});
