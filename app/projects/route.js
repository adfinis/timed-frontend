import { reads } from "@ember/object/computed";
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default Route.extend({
  session: service(),
  user: reads("session.data.user"),

  setupController(controller, ...args) {
    this._super(...args);

    if (this.user.isSuperuser || this.user.isReviewer) {
      controller.set("hasAccess", true);
      controller.fetchProjectsOfUser.perform();
    } else {
      controller.set("hasAccess", false);
    }
  }
});
