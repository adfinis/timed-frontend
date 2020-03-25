import { computed } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import moment from "moment";

const INTERVAL_DELAY = 10 * 60000; // 10 Minutes

/**
 * Unverified reports service
 *
 * This service polls reports of last month that need to be verified
 * by the current user.
 *
 * @class UnverifiedReportsService
 * @extends Ember.Service
 * @public
 */
export default Service.extend({
  store: service(),
  session: service(),
  notify: service(),
  amountReports: 0,

  hasReports: computed("amountReports", function() {
    return this.get("amountReports") > 0;
  }),

  reportsToDate: computed(function() {
    return moment()
      .subtract(1, "month")
      .endOf("month");
  }),

  init() {
    this._super();
    this.pollReports();

    this.set(
      "intervalId",
      setInterval(this.pollReports.bind(this), INTERVAL_DELAY)
    );
  },

  async pollReports() {
    try {
      const reports = await this.get("store").query("report", {
        to_date: this.get("reportsToDate").format("YYYY-MM-DD"),
        reviewer: this.get("session.data.user.id"),
        editable: 1,
        verified: 0
      });

      this.set("amountReports", reports.length);
    } catch (e) {
      this.notify.error("Error while polling reports");
    }
  },

  willDestroy() {
    clearInterval(this.intervalId);
  }
});
