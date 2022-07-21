/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { action } from "@ember/object";

/**
 * Controller to edit an activity
 *
 * @class IndexActivitiesEditController
 * @extends Ember.Controller
 * @public
 */
export default class IndexActivitiesEditController extends Controller {
  /**
   * Whether the save button is enabled
   *
   * This is true if the activity is valid and there are some
   * changes on the activity
   *
   * @property {Boolean} saveEnabled
   * @public
   */
  get saveEnabled() {
    return this.changeset.isDirty && this.changeset.isValid;
  }

  /**
   * Validate the given changeset
   *
   * @method validateChangeset
   * @param {EmberChangeset.Changeset} changeset The changeset to validate
   * @public
   */
  @action
  validateChangeset(changeset) {
    this.changeset.validate();
  }

  @action
  toggle(prop) {
    this.changeset[prop] = !!this.changeset[prop];
  }
}
