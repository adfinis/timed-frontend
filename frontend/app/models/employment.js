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
export default class Employment extends Model {
  /**
   * The percentage
   *
   * @property {Number} percentage
   * @public
   */
  @attr("number") percentage;

  /**
   * The time the user has to work every day
   *
   * @property {moment.duration} worktimePerDay
   * @public
   */
  @attr("django-duration") worktimePerDay;

  /**
   * The start date
   *
   * @property {moment} start
   * @public
   */
  @attr("django-date") start;

  /**
   * Whether the employment is of an external employee
   *
   * @property {Boolean} isExternal
   * @public
   */
  @attr("boolean", { defaultValue: false }) isExternal;

  /**
   * The end date
   *
   * @property {moment} end
   * @public
   */
  @attr("django-date") end;

  /**
   * The employed user
   *
   * @property {User} user
   * @public
   */
  @belongsTo("user") user;

  /**
   * The work location
   *
   * @property {Location} location
   * @public
   */
  @belongsTo("location") location;
}
