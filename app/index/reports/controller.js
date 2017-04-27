/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from 'ember-controller'
import computed   from 'ember-computed-decorators'

/**
 * The index reports controller
 *
 * @class IndexReportsController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
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
   * @property {Report[]} reports
   * @public
   */
  @computed('_allReports.@each.{date,isNew,isDeleted}', 'model')
  reports(reports, day) {
    return reports.filter((r) => {
      return r.get('date').isSame(day, 'day') && !r.get('isNew') && !r.get('isDeleted')
    })
  },

  /**
   * All available customers
   *
   * @property {Customer[]} customers
   * @public
   */
  @computed()
  customers() {
    return this.store.peekAll('customer')
  },

  /**
   * All available projects
   *
   * @property {Project[]} projects
   * @public
   */
  @computed()
  projects() {
    return this.store.peekAll('project')
  },

  /**
   * All available tasks
   *
   * @property {Task[]} tasks
   * @public
   */
  @computed()
  tasks() {
    return this.store.peekAll('task')
  },

  /**
   * All available absence types
   *
   * @property {AbsenceType[]} absenceTypes
   * @public
   */
  @computed()
  absenceTypes() {
    return this.store.peekAll('absenceType')
  },

  /**
   * Whether the edit modal is visible
   *
   * @property {Boolean} modalVisible
   * @public
   */
  modalVisible: false,

  /**
   * The report to edit in the modal
   *
   * @property {Report} reportToEdit
   * @public
   */
  reportToEdit: null,

  /**
   * Whether the report to edit is an absence
   *
   * @property {Boolean} reportToEditIsAbsence
   * @public
   */
  reportToEditIsAbsence: false,

  /**
   * Actions for the index report controller
   *
   * @property {Object} actions
   * @public
   */
  actions: {
    /**
     * Edit a certain report
     *
     * This also determines if the report to edit is an absence or not to
     * decide which modal must be shown.
     *
     * @method editReport
     * @param {Report} report The report to edit
     * @public
     */
    editReport(report) {
      this.setProperties({
        modalVisible: true,
        reportToEdit: report,
        reportToEditIsAbsence: !!report.get('absenceType.id')
      })
    },

    /**
     * Add a new report
     *
     * @method addReport
     * @public
     */
    addReport() {
      this.setProperties({
        modalVisible: true,
        reportToEdit: this.store.createRecord('report', { date: this.get('model') }),
        reportToEditIsAbsence: false
      })
    },

    /**
     * Add a new absence
     *
     * @method addReport
     * @public
     */
    addAbsence() {
      this.setProperties({
        modalVisible: true,
        reportToEdit: this.store.createRecord('report', { date: this.get('model') }),
        reportToEditIsAbsence: true
      })
    }
  }
})
