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
export default class Absence extends Model {
  /**
   * The comment
   *
   * @property {String} comment
   * @public
   */
  @attr("string", { defaultValue: "" }) comment;

  /**
   * The duration
   *
   * @property {moment.duration} duration
   * @public
   */
  @attr("django-duration", { defaultValue: () => moment.duration() }) duration;

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  @attr("django-date") date;

  /**
   * The type of the absence
   *
   * @property {AbsenceType} absenceType
   * @public
   */
  @belongsTo("absence-type") absenceType;

  /**
   * The user
   *
   * @property {User} user
   * @public
   */
  @belongsTo("user") user;
}
