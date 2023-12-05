import MomentTransform from "timed/transforms/moment";

/**
 * The django time transform
 *
 * This transforms a django time into a moment object
 *
 * @class DjangoTimeTransform
 * @extends MomentTransform
 * @public
 */
export default class DjangoTimeTransform extends MomentTransform {
  /**
   * The time format
   *
   * @property {String} format
   * @public
   */
  format = "HH:mm:ss";
}
