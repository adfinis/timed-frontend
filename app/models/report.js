/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import attr from "ember-data/attr";
import Model from "ember-data/model";
import { belongsTo } from "ember-data/relationships";
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
   * The date
   *
   * @property {moment} date
   * @public
   */
  date: attr("django-date"),

  /**
   * The duration
   *
   * @property {moment.duration} duration
   * @public
   */
  duration: attr("django-duration", { defaultValue: () => moment.duration() }),

  /**
   * Whether the report needs to be reviewed
   *
   * @property {Boolean} review
   * @public
   */
  review: attr("boolean", { defaultValue: false }),

  /**
   * Whether the report is not billable
   *
   * @property {Boolean} notBillable
   * @public
   */
  notBillable: attr("boolean", { defaultValue: false }),

  /**
   * Whether the report has been marked as billed
   *
   * @property {Boolean} billed
   * @public
   */
  billed: attr("boolean", { defaultValue: false }),

  /**
   * The task
   *
   * @property {Task} task
   * @public
   */
  task: belongsTo("task"),

  /**
   * The user
   *
   * @property {User} user
   * @public
   */
  user: belongsTo("user"),

  /**
   * The user which verified this report
   *
   * @property {User} verifiedBy
   * @public
   */
  verifiedBy: belongsTo("user")
});
