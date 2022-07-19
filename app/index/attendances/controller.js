/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { computed } from "@ember/object";
import AttendanceValidator from "timed/validations/attendance";

/**
 * The index attendances controller
 *
 * @class IndexAttendancesController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
  AttendanceValidator,

  /**
   * All attendances currently in the store
   *
   * @property {Attendance[]} _allAttendances
   * @private
   */
  _allAttendances: computed(function () {
    return this.store.peekAll("attendance");
  }),

  /**
   * The attendances filtered by the selected day
   *
   * @property {Attendance[]} attendances
   * @public
   */
  attendances: computed(
    "_allAttendances.@each.{date,user,isDeleted}",
    "model",
    "user",
    function () {
      return this.get("_allAttendances").filter((a) => {
        return (
          a.get("date").isSame(this.get("model"), "day") &&
          a.get("user.id") === this.get("user.id") &&
          !a.get("isDeleted")
        );
      });
    }
  ),
});
