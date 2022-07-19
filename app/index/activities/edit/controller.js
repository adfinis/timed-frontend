/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { and } from "@ember/object/computed";

/**
 * Controller to edit an activity
 *
 * @class IndexActivitiesEditController
 * @extends Ember.Controller
 * @public
 */
const IndexActivitiesEditController = Controller.extend({
  /**
   * Whether the save button is enabled
   *
   * This is true if the activity is valid and there are some
   * changes on the activity
   *
   * @property {Boolean} saveEnabled
   * @public
   */
  saveEnabled: and("changeset.isDirty", "changeset.isValid"),

  actions: {
    /**
     * Validate the given changeset
     *
     * @method validateChangeset
     * @param {EmberChangeset.Changeset} changeset The changeset to validate
     * @public
     */
    validateChangeset(changeset) {
      changeset.validate();
    },
  },
});

export default IndexActivitiesEditController;
