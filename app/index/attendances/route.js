/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from "@ember/routing/route";
import RouteAutostartTourMixin from "timed/mixins/route-autostart-tour";

/**
 * The index attendances route
 *
 * @class IndexAttendancesRoute
 * @extends Ember.Route
 * @public
 */
export default class AttendaceIndexRoute extends Route.extend(
  RouteAutostartTourMixin
) {
  /**
   * Setup controller hook, set the current user
   *
   * @method setupContrller
   * @param {Ember.Controller} controller The controller
   * @public
   */
  setupController(controller, ...args) {
    super.setupController(controller, ...args);

    controller.set("user", this.modelFor("protected"));
  }
}
