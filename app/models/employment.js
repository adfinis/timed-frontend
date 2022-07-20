/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

/**
 * The employment model
 *
 * @class Employment
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The percentage
   *
   * @property {Number} percentage
   * @public
   */
  percentage: attr("number"),

  /**
   * The time the user has to work every day
   *
   * @property {moment.duration} worktimePerDay
   * @public
   */
  worktimePerDay: attr("django-duration"),

  /**
   * The start date
   *
   * @property {moment} start
   * @public
   */
  start: attr("django-date"),

  /**
   * Whether the employment is of an external employee
   *
   * @property {Boolean} isExternal
   * @public
   */
  isExternal: attr("boolean", { defaultValue: false }),

  /**
   * The end date
   *
   * @property {moment} end
   * @public
   */
  end: attr("django-date"),

  /**
   * The employed user
   *
   * @property {User} user
   * @public
   */
  user: belongsTo("user"),

  /**
   * The work location
   *
   * @property {Location} location
   * @public
   */
  location: belongsTo("location"),
});
