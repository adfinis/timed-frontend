/**
 * @module timed
 * @submodule timed-validations
 * @public
 */
import { validatePresence } from 'ember-changeset-validations/validators'

/**
 * Validations for absences
 *
 * @class AbsenceValidations
 * @public
 */
export default {
  /**
   * Absence type validator, check if an absence type is existent
   *
   * @property {Function} absenceType
   * @public
   */
  absenceType: validatePresence(true),

  /**
   * Duration validator, check if a duration is existent
   *
   * @property {Function} duration
   * @public
   */
  duration: validatePresence(true)
}
