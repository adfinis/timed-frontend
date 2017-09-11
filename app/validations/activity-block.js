/**
 * @module timed
 * @submodule timed-validations
 * @public
 */
import validateMoment from 'timed/validators/moment'

/**
 * Validations for activity blocks
 *
 * @class ActivityBlockValidations
 * @public
 */
export default {
  from: validateMoment({ lt: 'to' }),
  to: validateMoment({ gt: 'from' })
}
