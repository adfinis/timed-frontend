/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import ReportRowComponent from 'timed/components/report-row/component'

/**
 * Row to reschedule and verify one report
 *
 * @class ReportRescheduleRowComponent
 * @extends ReportRowComponent
 * @public
 */
export default ReportRowComponent.extend({
  /**
   * The user to use for verifying
   *
   * @property {User} verifyUser
   * @public
   */
  verifyUser: null,

  actions: {
    /**
     * Set the verifying user or set it to null
     *
     * @method setVerified
     * @param {Boolean} value Whether to set the verifying user
     * @public
     */
    setVerified(value) {
      this.set('changeset.verifiedBy', value ? this.get('verifyUser') : null)
    }
  }
})
