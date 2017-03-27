/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import EditReportModalComponent from 'timed/components/edit-report-modal/component'
import AbsenceValidations       from 'timed/validations/absence'

/**
 * Custom modal for editing absences
 *
 * @class EditAbsenceModalComponent
 * @extends EditReportModalComponent
 * @public
 */
export default EditReportModalComponent.extend({
  /**
   * Validator for the changeset
   *
   * @property {Object} validator
   * @public
   */
  validator: AbsenceValidations
})
