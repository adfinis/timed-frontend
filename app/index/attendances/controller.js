/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import AttendanceValidator from "timed/validations/attendance";

/**
 * The index attendances controller
 *
 * @class IndexAttendancesController
 * @extends Ember.Controller
 * @public
 */
export default class AttendanceController extends Controller {
  @service notify;
  @service store;
  @service tracking;

  AttendanceValidator = AttendanceValidator;

  /**
   * Validate the given changeset
   *
   * @method validateChangeset
   * @param {EmberChangeset.Changeset} changeset The changeset to validate
   * @public
   */
  @action
  validateChangeset(changeset) {
    changeset.validate();
  }
  /**
   * All attendances currently in the store
   *
   * @property {Attendance[]} _allAttendances
   * @private
   */
  get _allAttendances() {
    return this.store.peekAll("attendance");
  }

  /**
   * The attendances filtered by the selected day
   *
   * @property {Attendance[]} attendances
   * @public
   */
  get attendances() {
    return this._allAttendances.filter((a) => {
      return (
        a.get("date").isSame(this.model, "day") &&
        a.get("user.id") === this.user.id &&
        !a.get("isDeleted")
      );
    });
  }

  /**
   * Save an attendance
   *
   * @method saveAttendance
   * @param {Changeset} attendance The attendance to save
   * @public
   */
  @action
  async saveAttendance(attendance) {
    try {
      await attendance.save();

      this.notify.success("Attendance was saved");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while saving the attendance");
    }
  }

  /**
   * Delete an attendance
   *
   * @method deleteAttendance
   * @param {Attendance} attendance The attendance to delete
   * @public
   */
  @action
  async deleteAttendance(attendance) {
    try {
      await this.store.peekRecord("attendance", attendance.id).destroyRecord();

      this.notify.success("Attendance was deleted");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while deleting the attendance");
    }
  }

  /**
   * Add a new attendance
   *
   * @method addAttendance
   * @public
   */
  @action
  async addAttendance() {
    try {
      const date = this.tracking.date.clone();

      const from = date.clone().set({ h: 8, m: 0, s: 0, ms: 0 });
      const to = date.clone().set({ h: 11, m: 30, s: 0, ms: 0 });

      const attendance = this.store.createRecord("attendance", {
        date,
        from,
        to,
      });

      await attendance.save();

      this.notify.success("Attendance was added");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while adding the attendance");
    }
  }
}
