/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";

/**
 * The public holiday model
 *
 * @class PublicHoliday
 * @extends DS.Model
 * @public
 */
export default class PublicHoliday extends Model {
  /**
   * The name
   *
   * @property {String} name
   * @public
   */
  @attr("string") name;

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  @attr("django-date") date;

  /**
   * The location
   *
   * @property {Location} location
   * @public
   */
  @belongsTo("location") location;
}
