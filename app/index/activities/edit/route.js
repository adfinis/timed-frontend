/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
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
export default Route.extend(RouteAutostartTourMixin, {
  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service("notify"),

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
  },

  afterModel(model) {
    if (model.get("transferred")) {
      this.transitionTo("index");
    }
  },

  /**
   * Setup controller hook, generate a changeset from the model
   *
   * @method setupController
   * @param {IndexActivityEditController} controller The controller
   * @param {Activity} model The activity to edit
   * @public
   */
  setupController(controller, model, ...args) {
    this._super(controller, model, ...args);

    const changeset = new Changeset(
      model,
      lookupValidator(ActivityValidator),
      ActivityValidator
    );

    changeset.validate();

    controller.setProperties({ changeset });
  },

  /**
   * Actions for the route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Save the activity
     *
     * @method save
     * @public
     */
    async save() {
      /* istanbul ignore next */
      if (!this.get("controller.saveEnabled")) {
        /* UI prevents this, but could be executed by pressing enter */
        return;
      }

      try {
        await this.get("controller.changeset").save();

        this.get("notify").success("Activity was saved");

        await this.transitionTo("index.activities");
      } catch (e) {
        /* istanbul ignore next */
        this.get("notify").error("Error while saving the activity");
      }
    },

    /**
     * Delete the activity
     *
     * @method delete
     * @public
     */
    async delete() {
      /* istanbul ignore next */
      if (this.get("currentModel.active")) {
        // We can't test this because the UI already prevents this by disabling
        // the save button..

        this.get("notify").error("You can't delete an active activity");

        return;
      }

      try {
        await this.get("currentModel").destroyRecord();

        this.get("notify").success("Activity was deleted");

        await this.transitionTo("index.activities");
      } catch (e) {
        /* istanbul ignore next */
        this.get("notify").error("Error while deleting the activity");
      }
    },
  },
});
