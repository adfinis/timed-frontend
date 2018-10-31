/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from '@ember/controller'
import { computed } from '@ember/object'
import moment from 'moment'

/**
 * Controller to edit an activity
 *
 * @class IndexActivitiesEditController
 * @extends Ember.Controller
 * @public
 */
const IndexActivitiesEditController = Controller.extend({
  /**
   * The total duration of all inactive blocks
   *
   * @property {moment.duration} total
   * @public
   */
  total: computed('blocks.@each.{from,to,isDeleted}', function() {
    return this.get('blocks')
      .filterBy('isDeleted', false)
      .reduce((dur, block) => {
        let { from, to } = block.getProperties('from', 'to')

        if (to) {
          dur.add(to.diff(from))
        }

        return dur
      }, moment.duration())
  }),

  /**
   * Whether the save button is enabled
   *
   * This is true if the activity and all its block is valid and there are some
   * kind of changes on the activity or its blocks
   *
   * @property {Boolean} saveEnabled
   * @public
   */
  saveEnabled: computed(
    'blocks.@each.{isValid,isDirty,isDeleted}',
    'activity.{isValid,isDirty}',
    function() {
      return (
        (this.get('activity.isDirty') ||
          this.get('blocks').some(
            b => b.get('isDirty') || b.get('isDeleted')
          )) &&
        this.get('activity.isValid') &&
        this.get('blocks').every(b => b.get('isDeleted') || b.get('isValid'))
      )
    }
  ),

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
