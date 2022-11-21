/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { computed } from "@ember/object";
import ReportValidations from "timed/validations/report";

/**
 * The index reports controller
 *
 * @class IndexReportsController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
  ReportValidations,

  showReschedule: false,

  /**
   * All reports currently in the store
   *
   * @property {Report[]} _allReports
   * @private
   */
  _allReports: computed(function() {
    return this.store.peekAll("report");
  }),

  /**
   * The reports filtered by the selected day
   *
   * Create a new report if no new report is already in the store
   *
   * @property {Report[]} reports
   * @public
   */
  reports: computed(
    "_allReports.@each.{user,date,isNew,isDeleted}",
    "model",
    "user",
    function() {
      const reportsToday = this._allReports.filter(r => {
        return (
          (!r.get("user.id") || r.get("user.id") === this.get("user.id")) &&
          r.get("date").isSame(this.model, "day") &&
          !r.get("isDeleted")
        );
      });

      if (!reportsToday.filterBy("isNew", true).get("length")) {
        this.store.createRecord("report", {
          date: this.model,
          user: this.user
        });
      }

      return reportsToday.sort(a => (a.get("isNew") ? 1 : 0));
    }
  )
});
