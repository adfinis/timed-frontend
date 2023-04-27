/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

/**
 * The absence credit model
 *
 * @class AbsenceCredit
 * @extends DS.Model
 * @public
 */
export default class AbsenceCredit extends Model {
  /**
   * The days
   *
   * @property {Number} days
   * @public
   */
  @attr("number") days;

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  @attr("django-date") date;

  /**
   * The comment
   *
   * @property {String} comment
   * @public
   */
  @attr("string", { defaultValue: "" }) comment;

  /**
   * The absence type for which this credit counts
   *
   * @property {AbsenceType} absenceType
   * @public
   */
  @belongsTo("absence-type") absenceType;

  /**
   * The user to which this credit belongs to
   *
   * @property {User} user
   * @public
   */
  @belongsTo("user") user;
}
