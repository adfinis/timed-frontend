/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";
import moment from "moment";

/**
 * The attendance model
 *
 * @class Attendance
 * @extends DS.Model
 * @public
 */
export default class Attendance extends Model {
  /**
   * The date of the attendance
   *
   * @property {moment} date
   * @public
   */
  @attr("django-date") date;

  /**
   * The start time
   *
   * @property {moment} from
   * @public
   */
  @attr("django-time") from;

  /**
   * The end time
   *
   * @property {moment} to
   * @public
   */
  @attr("django-time") to;

  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  @belongsTo("user") user;

  /**
   * The duration between start and end time
   *
   * This needs to use 00:00 of the next day if the end time is 00:00 so the
   * difference is correct.
   *
   * @property {moment.duration} duration
   * @public
   */
  get duration() {
    const calcTo =
      this.to.format("HH:mm") === "00:00"
        ? this.to.clone().add(1, "day")
        : this.to;

    return moment.duration(calcTo.diff(this.from));
  }
}
