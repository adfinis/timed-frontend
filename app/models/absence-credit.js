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
export default Model.extend({
  /**
   * The days
   *
   * @property {Number} days
   * @public
   */
  days: attr("number"),

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  date: attr("django-date"),

  /**
   * The comment
   *
   * @property {String} comment
   * @public
   */
  comment: attr("string", { defaultValue: "" }),

  /**
   * The absence type for which this credit counts
   *
   * @property {AbsenceType} absenceType
   * @public
   */
  absenceType: belongsTo("absence-type"),

  /**
   * The user to which this credit belongs to
   *
   * @property {User} user
   * @public
   */
  user: belongsTo("user"),
});
