/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import moment from "moment";
import { all } from "rsvp";
import ReportValidations from "timed/validations/report";
import { cached } from "tracked-toolbox";

/**
 * The index reports controller
 *
 * @class IndexReportsController
 * @extends Ember.Controller
 * @public
 */
export default class IndexReportController extends Controller {
  queryParams = ["task", "duration", "comment", "review", "notBillable"];
  @tracked task;
  @tracked duration;
  @tracked comment;
  @tracked review = false;
  @tracked notBillable = false;

  @tracked showReschedule = false;
  @tracked _center;

  @service store;
  @service notify;
  @service router;
  @service currentUser;

  ReportValidations = ReportValidations;

  get center() {
    return this._center ?? moment(this.model);
  }

  set center(date) {
    this._center = date;
  }

  /**
   * All reports currently in the store
   *
   * @property {Report[]} _allReports
   * @private
   */
  get _allReports() {
    return this.store.peekAll("report");
  }

  /**
   * The reports filtered by the selected day
   *
   * Create a new report if no new report is already in the store
   *
   * @property {Report[]} reports
   * @public
   */
  get reports() {
    const reportsToday = this._allReports.filter((r) => {
      return (
        (!r.get("user.id") || r.get("user.id") === this.currentUser.user.id) &&
        r.get("date").isSame(this.model, "day") &&
        !r.get("isDeleted")
      );
    });

    if (!reportsToday.filterBy("isNew", true).get("length")) {
      this.store.createRecord("report", {
        date: this.model,
        user: this.currentUser.user,
      });
    }

    return reportsToday.sort((a) => (a.get("isNew") ? 1 : 0));
  }

  @cached
  get absence() {
    const absences = this.store.peekAll("absence").filter((absence) => {
      return (
        absence.date.isSame(this.model, "day") &&
        absence.get("user.id") === this.currentUser.user.id &&
        !absence.isNew &&
        !absence.isDeleted
      );
    });

    return absences.firstObject;
  }

  /**
   * Save a certain report and close the modal afterwards
   *
   * @method saveReport
   * @param {Report} report The report to save
   * @public
   */
  @action
  async saveReport(report) {
    try {
      this.send("loading");

      await report.save();

      if (this.absence) {
        await this.absence.reload();
      }
    } catch (e) {
      this.notify.error("Error while saving the report");
    } finally {
      this.send("finished");
    }
  }

  /**
   * Delete a certain report and close the modal afterwards
   *
   * @method deleteReport
   * @param {Report} report The report to delete
   * @public
   */
  @action
  async deleteReport(report) {
    try {
      this.send("loading");

      await report.destroyRecord();

      if (!report.get("isNew")) {
        if (this.absence) {
          await this.absence.reload();
        }
      }
    } catch (e) {
      this.notify.error("Error while deleting the report");
    } finally {
      this.send("finished");
    }
  }

  @action
  async reschedule(date) {
    try {
      const reports = this.reports
        .filterBy("isNew", false)
        .rejectBy("verifiedBy.id");

      // The magic number "-1" is the placeholder report row which we filter out
      // via the filterBy("isNew") line above.
      if (reports.length < this.reports.length - 1) {
        /* istanbul ignore next */
        this.notify.warning(
          "Reports that got verified already can not get transferred."
        );
      }

      await all(
        reports.map(async (report) => {
          report.set("date", date);
          return await report.save();
        })
      );
      this.showReschedule = false;
      this.router.transitionTo({
        queryParams: { day: date.format("YYYY-MM-DD") },
      });
    } catch (e) {
      this.notify.error("Error while rescheduling the timesheet");
    }
  }
}
