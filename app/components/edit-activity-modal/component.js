/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import EditReportModalComponent from 'timed/components/edit-report-modal/component'
import ActivityValidations      from 'timed/validations/activity'

/**
 * Custom modal for editing activities
 *
 * @class EditActivityModalComponent
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
  validator: ActivityValidations
})
