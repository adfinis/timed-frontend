import Component from "@ember/component";
import { computed } from "@ember/object";
import { or } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import moment from "moment";

export default Component.extend({
  tagName: "nav",
  classNames: ["nav-top", "nav-top--fixed"],
  classNameBindings: ["expand:nav-top--expand"],
  session: service("session"),
  media: service("media"),
  expand: false,
  navMobile: or("media.isMo", "media.isXs", "media.isSm"),
  analysisFromDate: computed(function() {
    return moment().startOf("month");
  })
});
