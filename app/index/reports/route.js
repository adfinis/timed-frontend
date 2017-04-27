/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route   from 'ember-route'
import RSVP    from 'rsvp'
import service from 'ember-service/inject'

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
   * Before model hook, fetch all customers, projects, tasks and absence types
   *
   * @method beforeModel
   * @return {RSVP.Promise} A promise which resolves if all data is fetched
   * @public
   */
  beforeModel() {
    return RSVP.all([
      this.store.findAll('customer', { include: 'projects,projects.tasks' }),
      this.store.findAll('absence-type')
    ])
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
        await report.save()

        this.set('controller.reportToEdit', null)
        this.set('controller.modalVisible', false)
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while deleting the report')
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
        await report.destroyRecord()

        this.set('controller.reportToEdit', null)
        this.set('controller.modalVisible', false)
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while deleting the report')
      }
    }
  }
})
