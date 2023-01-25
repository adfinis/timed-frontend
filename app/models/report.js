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
 * @extends Model
 * @public
 */
export default class Report extends Model {
  /**
   * The comment
   *
   * @property {String} comment
   * @public
   */
  @attr("string", { defaultValue: "" }) comment;

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  @attr("django-date") date;

  /**
   * The duration
   *
   * @property {moment.duration} duration
   * @public
   */
  @attr("django-duration", { defaultValue: () => moment.duration() }) duration;

  /**
   * The remaining effort for the underlying task
   *
   * @property {moment.duration} remainingEffort
   * @public
   */

  @attr("django-duration", { defaultValue: () => moment.duration() })
  remainingEffort;

  /**
   * Whether the report needs to be reviewed
   *
   * @property {Boolean} review
   * @public
   */
  @attr("boolean", { defaultValue: false }) review;

  /**
   * Whether the report got rejected by the reviewer
   *
   * @property {Boolean} reject
   * @public
   */
  @attr("boolean", { defaultValue: false }) rejected;

  /**
   * Whether the report is not billable
   *
   * @property {Boolean} notBillable
   * @public
   */
  @attr("boolean", { defaultValue: false }) notBillable;

  /**
   * Whether the report has been marked as billed
   *
   * @property {Boolean} billed
   * @public
   */
  @attr("boolean", { defaultValue: false }) billed;

  /**
   * The task
   *
   * @property {Task} task
   * @public
   */
  @belongsTo("task") task;

  /**
   * The user
   *
   * @property {User} user
   * @public
   */
  @belongsTo("user") user;

  /**
   * The user which verified this report
   *
   * @property {User} verifiedBy
   * @public
   */
  @belongsTo("user") verifiedBy;
}
