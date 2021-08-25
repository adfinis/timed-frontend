import { reads } from "@ember/object/computed";
import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default Route.extend({
  session: service(),
  user: reads("session.data.user"),

  setupController(controller, ...args) {
    this._super(...args);

    controller.fetchProjectsByUser.perform();
  }
});
