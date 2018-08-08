/**
 * @module timed
 * @submodule timed-validations
 * @public
 */
import validateMoment from 'timed/validators/moment'

/**
 * Validations for activities
 *
 * @class ActivityValidations
 * @public
 */
export default {
  fromTime: validateMoment({ lt: 'toTime' }),
  toTime: validateMoment({ gt: 'fromTime' })
}
