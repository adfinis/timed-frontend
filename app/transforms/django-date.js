/**
 * @module timed
 * @submodule timed-transforms
 * @public
 */
import MomentTransform from 'timed/transforms/moment'

/**
 * The django date transform
 *
 * This transforms a django date into a moment date
 *
 * @class DjangoDateTransform
 * @extends MomentTransform
 * @public
 */
export default MomentTransform.extend({
  /**
   * The date format
   *
   * @property {String} format
   * @public
   */
  format: 'YYYY-MM-DD'
})
