/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from '@ember/controller'
import { computed } from '@ember/object'

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
  saveEnabled: computed('changeset.{isValid,isDirty}', function() {
    return this.get('changeset.isDirty') && this.get('changeset.isValid')
  }),

  actions: {
    /**
     * Validate the given changeset
     *
     * @method validateChangeset
     * @param {EmberChangeset.Changeset} changeset The changeset to validate
     * @public
     */
    validateChangeset(changeset) {
      changeset.validate()
    }
  }
})

export default IndexActivitiesEditController
