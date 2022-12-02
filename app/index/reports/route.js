/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from "@ember/routing/route";
import RouteAutostartTourMixin from "timed/mixins/route-autostart-tour";

/**
 * The index reports route
 *
 * @class IndexReportsRoute
 * @extends Ember.Route
 * @public
 */
export default class IndexReportsRoute extends Route.extend(
  RouteAutostartTourMixin
) {
  /**
   * Before model hook, fetch all absence types
   *
   * @method beforeModel
   * @return {AbsenceType[]} All absence types
   * @public
   */
  beforeModel(...args) {
    super.beforeModel(...args);

    return this.store.findAll("absence-type");
  }

  setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);

    controller.set("user", this.modelFor("protected"));
    controller.set("rescheduleDate", model);
  }
}
