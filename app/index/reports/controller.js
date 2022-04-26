/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import ReportValidations from "timed/validations/report";

/**
 * The index reports controller
 *
 * @class IndexReportsController
 * @extends Ember.Controller
 * @public
 */
export default class IndexReportController extends Controller {
  ReportValidations = ReportValidations;

  showReschedule = false;

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
        (!r.get("user.id") || r.get("user.id") === this.get("user.id")) &&
        r.get("date").isSame(this.model, "day") &&
        !r.get("isDeleted")
      );
    });

    if (!reportsToday.filterBy("isNew", true).get("length")) {
      this.store.createRecord("report", {
        date: this.model,
        user: this.user,
      });
    }

    return reportsToday.sort((a) => (a.get("isNew") ? 1 : 0));
  }
}
