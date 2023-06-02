import MomentTransform from "timed/transforms/moment";

/**
 * The django datetime transform
 *
 * This transforms a django datetime into a moment datetime
 *
 * @class DjangoDatetimeTransform
 * @extends MomentTransform
 * @public
 */
export default class DjangoDatetimeTransform extends MomentTransform {
  /**
   * The date format
   *
   * @property {String} format
   * @public
   */
  format = "YYYY-MM-DDTHH:mm:ss.SSSSZ";
}
