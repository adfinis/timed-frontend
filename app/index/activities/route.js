import Route from "@ember/routing/route";
/**
 * The index activities route
 *
 * @class IndexActivitiesRoute
 * @extends Ember.Route
 * @public
 */
export default class IndexActivitiesRoute extends Route {
  model() {
    return this.modelFor("index");
  }

  /**
   * Setup controller hook, set the current user
   *
   * @method setupController
   * @param {Ember.Controller} controller The controller
   * @public
   */
  setupController(controller, ...args) {
    super.setupController(controller, ...args);

    controller.set("user", this.modelFor("protected"));
  }
}
