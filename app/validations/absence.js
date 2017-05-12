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
   * @property {Function} type
   * @public
   */
  type: validatePresence(true)
}
