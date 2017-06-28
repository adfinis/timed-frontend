/**
 * @module timed
 * @submodule timed-validations
 * @public
 */
import {
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators'

/**
 * Validations for multiple absences
 *
 * @class MultipleAbsenceValidations
 * @public
 */
export default {
  /**
   * Absence type validator, check if an absence type is existent
   *
   * @property {Function} type
   * @public
   */
  type: validatePresence(true),

  /**
   * Date validation, ensure at least one date is selected
   *
   * @property {Function} dates
   * @public
   */
  dates: validateLength({ min: 1, message: 'At least one date must be selected' })
}
