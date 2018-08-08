/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from '@ember/controller'
import { computed } from '@ember/object'
import { sort } from '@ember/object/computed'

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
  _allActivities: computed(function() {
    return this.store.peekAll('activity')
  }),
   */
  init() {
    this._super(...arguments)
    this.set('_allActivities', this.store.peekAll('activity'))
  },

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
          a.get('user.id') === this.get('user').get('id') &&
          !a.get('isNew') &&
          !a.get('isDeleted')
        )
      })
    }
  ),

  sortedActivities: sort('activities', function(a, b) {
    let dateA = a.get('fromTime').toDate()
    let dateB = b.get('fromTime').toDate()
    if (dateA > dateB) {
      return -1
    }
    if (dateA < dateB) {
      return 1
    }
    return 0
  })
})
