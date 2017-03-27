/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route  from 'ember-route'
import RSVP   from 'rsvp'
import moment from 'moment'

/**
 * The index route
 *
 * @class IndexRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend({
  /**
   * The query params
   *
   * @property {Object} queryParams
   * @property {Object} queryParams.day
   * @public
   */
  queryParams: {
    day: { refreshModel: true }
  },

  /**
   * Model hook, return the selected day as moment object
   *
   * @method model
   * @param {Object} params The query params
   * @param {String} params.day The selected day
   * @return {moment} The selected day as moment object
   * @public
   */
  model({ day }) {
    return moment(day, 'YYYY-MM-DD')
  },

  /**
   * After model hook, fetch all activities, attendances and reports of the
   * selected day, toghether with necessary data related to them.
   *
   * @method afterModel
   * @param {moment} model The selected day
   * @return {RSVP.Promise} A promise which resolves after all data is fetched
   * @public
   */
  afterModel(model) {
    let day = model.format('YYYY-MM-DD')

    return RSVP.all([
      this.store.query('activity', { include: 'blocks,task,task.project,task.project.customer', day }),
      this.store.query('attendance', { day }),
      this.store.query('report', { include: 'task,task.project,task.project.customer,absence_type', day })
    ])
  }
})
