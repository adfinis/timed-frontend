/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from 'ember-controller'
import computed from 'ember-computed-decorators'
import ReportValidations from 'timed/validations/report'

/**
 * The index reports controller
 *
 * @class IndexReportsController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
  ReportValidations,

  showReschedule: false,

  /**
   * All reports currently in the store
   *
   * @property {Report[]} _allReports
   * @private
   */
  @computed()
  _allReports() {
    return this.store.peekAll('report')
  },

  /**
   * The reports filtered by the selected day
   *
   * Create a new report if no new report is already in the store
   *
   * @property {Report[]} reports
   * @public
   */
  @computed('_allReports.@each.{date,isNew,isDeleted}', 'model')
  reports(reports, day) {
    let reportsToday = reports.filter(r => {
      return r.get('date').isSame(day, 'day') && !r.get('isDeleted')
    })

    if (!reportsToday.filterBy('isNew', true).get('length')) {
      this.store.createRecord('report', { date: this.get('model') })
    }

    return reportsToday.sort(a => (a.get('isNew') ? 1 : -1))
  }
})
