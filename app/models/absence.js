/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";
import moment from "moment";

/**
 * The report model
 *
 * @class Report
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The comment
   *
   * @property {String} comment
   * @public
   */
  comment: attr("string", { defaultValue: "" }),

  /**
   * The duration
   *
   * @property {moment.duration} duration
   * @public
   */
  duration: attr("django-duration", { defaultValue: () => moment.duration() }),

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  date: attr("django-date"),

  /**
   * The type of the absence
   *
   * @property {AbsenceType} absenceType
   * @public
   */
  absenceType: belongsTo("absence-type"),

  /**
   * The user
   *
   * @property {User} user
   * @public
   */
  user: belongsTo("user"),
});
