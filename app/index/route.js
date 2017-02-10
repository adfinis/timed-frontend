/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route   from 'ember-route'
import RSVP    from 'rsvp'
import service from 'ember-service/inject'

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
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service('notify'),

  /**
   * Model hook, fetch all activities and attendances for the given day
   *
   * @method model
   * @param {Object} params The query params
   * @param {String} param.day The day
   * @return {RSVP.Promise} A promise which resolves into if all data is fetched
   * @public
   */
  model({ day  }) {
    return RSVP.all([
      this.store.query('activity', {
        include: 'task,task.project,task.project.customer',
        day
      }),
      this.store.query('attendance', { day })
    ])
  },

  /**
   * The actions for the index route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Continue an activity
     *
     * @method continueActivity
     * @param {Activity} activity The activity to continue
     * @public
     */
    continueActivity(activity) {
      this.controllerFor('protected').send('continueActivity', activity)
    },

    /**
     * Save an attendance
     *
     * @method saveAttendance
     * @param {Attendance} attendance The attendance to save
     * @public
     */
    async saveAttendance(attendance) {
      try {
        await attendance.save()

        this.get('notify').success('Attendance was saved')
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while saving the attendance')
      }
    },

    /**
     * Delete an attendance
     *
     * @method deleteAttendance
     * @param {Attendance} attendance The attendance to delete
     * @public
     */
    async deleteAttendance(attendance) {
      try {
        await attendance.destroyRecord()

        this.get('notify').success('Attendance was deleted')
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while deleting the attendance')
      }
    },

    /**
     * Add a new attendance
     *
     * @method addAttendance
     * @public
     */
    async addAttendance() {
      try {
        let from = this.get('controller.date').clone().set({ h: 8, m: 0, s: 0, ms: 0 })
        let to   = this.get('controller.date').clone().set({ h: 11, m: 30, s: 0, ms: 0 })

        let attendance = this.store.createRecord('attendance', { from, to })

        await attendance.save()

        this.get('notify').success('Attendance was added')
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while adding the attendance')
      }
    }
  }
})
