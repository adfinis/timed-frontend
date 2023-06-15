import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";
import Changeset from "ember-changeset";
import lookupValidator from "ember-changeset-validations";
import RouteAutostartTourMixin from "timed/mixins/route-autostart-tour";
import ActivityValidator from "timed/validations/activity";

/**
 * Route to edit an activity
 *
 * @class IndexActivitiesEditRoute
 * @extends Ember.Route
 * @public
 */
export default class IndexActivityEditController extends Route.extend(
  RouteAutostartTourMixin
) {
  @service router;
  @service store;
  /**
   * Model hook, fetch the activity to edit
   *
   * @method model
   * @param {Object} params The route params
   * @param {String} params.id The id of the activity to edit
   * @return {Activity} The activity to edit
   * @public
   */
  model({ id }) {
    return this.store.findRecord("activity", id);
  }

  afterModel(model) {
    if (model.get("transferred")) {
      this.router.transitionTo("index");
    }
  }

  /**
   * Setup controller hook, generate a changeset from the model
   *
   * @method setupController
   * @param {IndexActivityEditController} controller The controller
   * @param {Activity} model The activity to edit
   * @public
   */
  setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);

    const changeset = new Changeset(
      model,
      lookupValidator(ActivityValidator),
      ActivityValidator
    );
    changeset.validate();

    controller.setProperties({ changeset });
  }
}
