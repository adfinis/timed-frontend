/**
 * @module timed
 * @submodule timed-validations
 * @public
 */
import { validatePresence } from 'ember-changeset-validations/validators'

/**
 * Validations for attendances
 *
 * @class AttendanceValidations
 * @public
 */
export default {
  date: validatePresence(true),
  from: validatePresence(true),
  to: validatePresence(true)
}
