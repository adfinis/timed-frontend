/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from '@ember/controller'
import { computed } from '@ember/object'
import { sort } from '@ember/object/computed'

/**
 * Determines if the timestamps are (more or less) equal.
 *
 * @param {number} a One of the two timestamps.
 * @param {number} b The other timestamp to compare.
 * @returns {boolean}
 */
function isSame(a, b, tolerance = 5) {
  return Math.abs(a - b) < 1000 * 60 * tolerance
}

/**
 * The index activities controller
 *
 * @class IndexActivitiesController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
  /**
   * All activities currently in the store
   *
   * @property {Activity[]} _allActivities
   * @private
   */
  _allActivities: computed(function() {
    return this.store.peekAll('activity')
  }),

  /**
   * The activities filtered by the selected day
   *
   * @property {Activity[]} activities
   * @public
   */
  activities: computed(
    '_allActivities.@each.{date,user,isNew,isDeleted}',
    'model',
    'user',
    function() {
      return this.get('_allActivities').filter(a => {
        return (
          a.get('date') &&
          a.get('date').isSame(this.get('model'), 'day') &&
          a.get('user.id') === this.get('user.id') &&
          !a.get('isNew') &&
          !a.get('isDeleted')
        )
      })
    }
  ),

  sortedActivities: sort('activities', function(a, b) {
    return b.get('from').toDate() - a.get('from').toDate()
  }),

  mergedActivities: computed('sortedActivities', function () {
    let reversed = this.get('sortedActivities').reverse()
    let fromTimes = reversed.map(activity => +activity.get('fromTime'))
    let toTimes = reversed.map(activity => +activity.get('toTime'))

    return reversed
      .map((current, index) => {
        let prev = toTimes[index - 1]
        let next = fromTimes[index + 1]
        let fromTime = +current.get('fromTime')
        let toTime = +current.get('toTime')

        if (typeof prev !== undefined) {
          current.set('sameAsPrev', isSame(prev, fromTime))
          current.set('overflowsPrev', fromTime - prev < 0)
        }

        if (typeof next !== undefined) {
          current.set('sameAsNext', isSame(next, toTime))
        }

        return current
      })
      .reverse()
  })
})
