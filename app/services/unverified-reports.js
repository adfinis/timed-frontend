import { computed } from "@ember/object";
import Service, { inject as service } from "@ember/service";
import Ember from "ember";
import classic from "ember-classic-decorator";
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
@classic
export default class UnverifiedReportsService extends Service {
  @service
  store;

  @service
  session;

  @service
  notify;

  amountReports = 0;

  @computed("amountReports")
  get hasReports() {
    return this.amountReports > 0;
  }

  @computed
  get reportsToDate() {
    return moment().subtract(1, "month").endOf("month");
  }

  init() {
    super.init();
    this.pollReports();

    this.set(
      "intervalId",
      Ember.testing
        ? null
        : setInterval(this.pollReports.bind(this), INTERVAL_DELAY)
    );
  }

  async pollReports() {
    try {
      const reports = await this.store.query("report", {
        to_date: this.reportsToDate.format("YYYY-MM-DD"),
        reviewer: this.session.data.user.id,
        editable: 1,
        verified: 0,
        page: { number: 1, size: 1 },
      });

      this.set("amountReports", reports.meta.pagination.count);
    } catch (e) {
      this.notify.error("Error while polling reports");
    }
  }

  willDestroy() {
    clearInterval(this.intervalId);
  }
}
