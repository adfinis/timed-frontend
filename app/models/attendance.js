/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import Model, { attr, belongsTo } from "@ember-data/model";
import { computed } from "@ember/object";
import moment from "moment";

/**
 * The attendance model
 *
 * @class Attendance
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The date of the attendance
   *
   * @property {moment} date
   * @public
   */
  date: attr("django-date"),

  /**
   * The start time
   *
   * @property {moment} from
   * @public
   */
  from: attr("django-time"),

  /**
   * The end time
   *
   * @property {moment} to
   * @public
   */
  to: attr("django-time"),

  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  user: belongsTo("user"),

  /**
   * The duration between start and end time
   *
   * This needs to use 00:00 of the next day if the end time is 00:00 so the
   * difference is correct.
   *
   * @property {moment.duration} duration
   * @public
   */
  duration: computed("from", "to", function () {
    const calcTo =
      this.get("to").format("HH:mm") === "00:00"
        ? this.get("to").clone().add(1, "day")
        : this.get("to");

    return moment.duration(calcTo.diff(this.get("from")));
  }),
});
