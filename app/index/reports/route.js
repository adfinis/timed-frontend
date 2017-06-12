/**
 * @module timed
 * @submodule timed-routes
 * @public
 */
import Route   from 'ember-route'
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

        this.get('controller.absences').forEach(async(absence) => {
          await absence.reload()
        })

        this.set('controller.reportToEdit', null)
        this.set('controller.showReportEditModal', false)
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while saving the report')
      }
    },

    /**
     * Save a certain absence and close the modal afterwards
     *
     * @method saveAbsence
     * @param {Absence} absence The absence to save
     * @public
     */
    async saveAbsence(absence) {
      try {
        await absence.save()

        this.set('controller.absenceToEdit', null)
        this.set('controller.showAbsenceEditModal', false)
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while saving the absence')
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

        this.get('controller.absences').forEach(async(absence) => {
          await absence.reload()
        })

        this.set('controller.reportToEdit', null)
        this.set('controller.showReportEditModal', false)
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while deleting the report')
      }
    },

    /**
     * Delete a certain absence and close the modal afterwards
     *
     * @method deleteAbsence
     * @param {Absence} absence The absence to delete
     * @public
     */
    async deleteAbsence(absence) {
      try {
        await absence.destroyRecord()

        this.set('controller.absenceToEdit', null)
        this.set('controller.showAbsenceEditModal', false)
      }
      catch(e) {
        /* istanbul ignore next */
        this.get('notify').error('Error while deleting the absence')
      }
    }
  }
})
