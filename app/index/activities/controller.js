/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from '@ember/controller'
import computed from 'ember-computed-decorators'

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
  @computed()
  _allActivities() {
    return this.store.peekAll('activity')
  },

  /**
   * The activities filtered by the selected day
   *
   * @property {Activity[]} activities
   * @public
   */
  @computed('_allActivities.@each.{date,user,isNew,isDeleted}', 'model', 'user')
  activities(activities, day, user) {
    return activities.filter(a => {
      return (
        a.get('date') &&
        a.get('date').isSame(day, 'day') &&
        a.get('user.id') === user.get('id') &&
        !a.get('isNew') &&
        !a.get('isDeleted')
      )
    })
  }
})
