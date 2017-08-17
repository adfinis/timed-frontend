/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route from 'ember-route'
import ReportFilterRouteMixin from 'timed/mixins/report-filter-route'

/**
 * Route for filtering and rescheduling reports
 *
 * @class RescheduleRoute
 * @extends Ember.Route
 * @using ReportFilterRouteMixin
 * @public
 */
export default Route.extend(ReportFilterRouteMixin, {
  /**
   * Some more query params to filter by
   *
   * @property {Object} queryParams
   * @public
   */
  queryParams: {
    review: { refreshModel: true },
    not_billable: { refreshModel: true }, // eslint-disable-line camelcase
    not_verified: { refreshModel: true } // eslint-disable-line camelcase
  },

  actions: {
    /**
     * Save a report row
     *
     * @method saveReport
     * @param {Report} report The report to save
     * @public
     */
    async saveReport(report) {
      try {
        this.send('loading')

        await report.save()
      } catch (e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while saving the report')
      } finally {
        this.send('finished')
      }
    }
  }
})
