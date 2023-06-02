import MomentTransform from "timed/transforms/moment";

/**
 * The django date transform
 *
 * This transforms a django date into a moment date
 *
 * @class DjangoDateTransform
 * @extends MomentTransform
 * @public
 */
export default class DjangoDateTransform extends MomentTransform {
  /**
   * The date format
   *
   * @property {String} format
   * @public
   */
  format = "YYYY-MM-DD";
}
