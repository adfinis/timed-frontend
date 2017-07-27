/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from 'ember-route'
import service from 'ember-service/inject'

/**
 * The index attendances route
 *
 * @class IndexAttendancesRoute
 * @extends Ember.Route
 * @public
 */
export default Route.extend({
  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service('notify'),

  /**
   * The actions for the index attendance route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
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
      } catch (e) {
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
      } catch (e) {
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
        let from = this.controllerFor('index')
          .get('date')
          .clone()
          .set({ h: 8, m: 0, s: 0, ms: 0 })
        let to = this.controllerFor('index')
          .get('date')
          .clone()
          .set({ h: 11, m: 30, s: 0, ms: 0 })

        let attendance = this.store.createRecord('attendance', { from, to })

        await attendance.save()

        this.get('notify').success('Attendance was added')
      } catch (e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while adding the attendance')
      }
    }
  }
})
