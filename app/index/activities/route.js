/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from "@ember/routing/route";
import RouteAutostartTourMixin from "timed/mixins/route-autostart-tour";

/**
 * The index activities route
 *
 * @class IndexActivitiesRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend(RouteAutostartTourMixin, {
  model() {
    return this.modelFor("index");
  },

  /**
   * Setup controller hook, set the current user
   *
   * @method setupController
   * @param {Ember.Controller} controller The controller
   * @public
   */
  setupController(controller, ...args) {
    this._super(controller, ...args);

    controller.set("user", this.modelFor("protected"));
  },
});
