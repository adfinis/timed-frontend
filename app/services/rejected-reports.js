import Service, { inject as service } from "@ember/service";
import { macroCondition, isTesting } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import moment from "moment";

const INTERVAL_DELAY = 10 * 60000; // 10 Minutes

export default class RejectedReportsService extends Service {
  @service
  store;

  @service
  session;

  @service
  notify;

  @tracked amountReports = 0;
  @tracked intervalId;

  get hasReports() {
    return this.amountReports > 0;
  }

  get reportsToDate() {
    return moment().subtract(1, "month").endOf("month");
  }

  constructor(...args) {
    super(...args);

    this.pollReports();

    /* istanbul ignore next */
    if (macroCondition(isTesting())) {
      this.intervalId = null;
    } else {
      this.intervalId = setInterval(
        this.pollReports.bind(this),
        INTERVAL_DELAY
      );
    }
  }

  async pollReports() {
    try {
      const reports = await this.store.query("report", {
        to_date: this.reportsToDate.format("YYYY-MM-DD"),
        reviewer: this.session.data.user.id,
        editable: 1,
        rejected: 1,
        page: { number: 1, size: 1 },
      });

      this.amountReports = reports.meta.pagination.count;
    } catch (e) {
      this.notify.error("Error while polling reports");
    }
  }

  willDestroy() {
    clearInterval(this.intervalId);
  }
}
