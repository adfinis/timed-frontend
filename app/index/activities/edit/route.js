/**
 * @module timed
 * @submodule timed-routes
 * @public
 */

import RouteAutostartTourRoute from "timed/routes/route-autostart-tour-route";

/**
 * Route to edit an activity
 *
 * @class IndexActivitiesEditRoute
 * @extends Ember.Route
 * @public
 */
export default class IndexActivitiesEditRoute extends RouteAutostartTourRoute {
  /**
   * Model hook, fetch the activity to edit
   *
   * @method model
   * @param {Object} params The route params
   * @param {String} params.id The id of the activity to edit
   * @return {Activity} The activity to edit
   * @public
   */
  async model({ id }) {
    return await this.store.findRecord("activity", id);
  }

  afterModel(model) {
    if (model.get("transferred")) {
      this.transitionTo("index");
    }
  }
}
