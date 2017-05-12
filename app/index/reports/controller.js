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
   * All absences currently in the store
   *
   * @property {Absence[]} _allAbsences
   * @private
   */
  @computed()
  _allAbsences() {
    return this.store.peekAll('absence')
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
   * The absences filtered by the selected day
   *
   * @property {Absence[]} absences
   * @public
   */
  @computed('_allAbsences.@each.{date,isNew,isDeleted}', 'model')
  absences(absences, day) {
    return absences.filter((a) => {
      return a.get('date').isSame(day, 'day') && !a.get('isNew') && !a.get('isDeleted')
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
   * Whether the absence edit modal is visible
   *
   * @property {Boolean} showAbsenceEditModal
   * @public
   */
  showAbsenceEditModal: false,

  /**
   * Whether the report edit modal is visible
   *
   * @property {Boolean} showReportEditModal
   * @public
   */
  showReportEditModal: false,

  /**
   * The absence to edit in the modal
   *
   * @property {Absence} absenceToEdit
   * @public
   */
  absenceToEdit: null,

  /**
   * The report to edit in the modal
   *
   * @property {Report} reportToEdit
   * @public
   */
  reportToEdit: null,

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
     * @method editReport
     * @param {Report} report The report to edit
     * @public
     */
    editReport(report) {
      this.setProperties({
        showReportEditModal: true,
        reportToEdit: report
      })
    },

    /**
     * Edit a certain absence
     *
     * @method editAbsence
     * @param {Absence} absence The absence to edit
     * @public
     */
    editAbsence(absence) {
      this.setProperties({
        showAbsenceEditModal: true,
        absenceToEdit: absence
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
        showReportEditModal: true,
        reportToEdit: this.store.createRecord('report', { date: this.get('model') })
      })
    },

    /**
     * Add a new absence
     *
     * @method addAbsence
     * @public
     */
    addAbsence() {
      this.setProperties({
        showAbsenceEditModal: true,
        absenceToEdit: this.store.createRecord('absence', { date: this.get('model') })
      })
    }
  }
})
