/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route   from 'ember-route'
import service from 'ember-service/inject'
import RSVP    from 'rsvp'

/**
 * The index reports route
 *
 * @class IndexReportsRoute
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
   * Before model hook, fetch all absence types
   *
   * @method beforeModel
   * @return {AbsenceType[]} All absence types
   * @public
   */
  beforeModel() {
    this._super(...arguments)

    return this.store.findAll('absence-type')
  },

  setupController(controller, model) {
    this._super(...arguments)

    controller.set('rescheduleDate', model)
  },

  /**
   * Actions for the index report route
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Save a certain report and close the modal afterwards
     *
     * @method saveReport
     * @param {Report} report The report to save
     * @public
     */
    async saveReport(report) {
      try {
        this.send('loading')

        await report.save()

        let absence = this.controllerFor('index').get('absence')

        if (absence) {
          await absence.reload()
        }
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while saving the report')
      }
      finally {
        this.send('finished')
      }
    },

    /**
     * Delete a certain report and close the modal afterwards
     *
     * @method deleteReport
     * @param {Report} report The report to delete
     * @public
     */
    async deleteReport(report) {
      try {
        this.send('loading')

        await report.destroyRecord()

        if (!report.get('isNew')) {
          let absence = this.controllerFor('index').get('absence')

          if (absence) {
            await absence.reload()
          }
        }
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while deleting the report')
      }
      finally {
        this.send('finished')
      }
    },

    async reschedule(date) {
      try {
        let reports = this.get('controller.reports').filterBy('isNew', false)
        await RSVP.Promise.all(reports.map(async(report) => {
          report.set('date', date)
          return await report.save()
        }))
        this.set('controller.showReschedule', false)
        this.controllerFor('index').set('date', date)
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while rescheduling the timesheet')
      }
    }
  }
})
