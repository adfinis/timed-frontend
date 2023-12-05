import Controller from "@ember/controller";
import { inject as service } from "@ember/service";
import { task, all, hash } from "ember-concurrency";
import moment from "moment";

export default class UsersEditController extends Controller {
  @service store;

  @task
  *data(uid) {
    return yield hash({
      worktimeBalanceLastValidTimesheet:
        this.worktimeBalanceLastValidTimesheet.perform(uid),
      worktimeBalanceToday: this.worktimeBalanceToday.perform(uid),
      worktimeBalances: this.worktimeBalances.perform(uid),
      absenceBalances: this.absenceBalances.perform(uid),
    });
  }

  @task
  *worktimeBalanceLastValidTimesheet(user) {
    const worktimeBalance = yield this.store.query("worktime-balance", {
      user,
      last_reported_date: 1, // eslint-disable-line camelcase
    });

    return worktimeBalance.get("firstObject");
  }

  @task
  *worktimeBalanceToday(user) {
    const worktimeBalance = yield this.store.query("worktime-balance", {
      user,
      date: moment().format("YYYY-MM-DD"),
    });

    return worktimeBalance.get("firstObject");
  }

  @task
  *absenceBalances(user) {
    return yield this.store.query("absence-balance", {
      user,
      date: moment().format("YYYY-MM-DD"),
      include: "absence_type",
    });
  }

  @task
  *worktimeBalances(user) {
    const dates = [...Array(10).keys()]
      .map((i) => moment().subtract(i, "days"))
      .reverse();

    return yield all(
      dates.map(async (date) => {
        const balance = await this.store.query("worktime-balance", {
          user,
          date: date.format("YYYY-MM-DD"),
        });

        return balance.get("firstObject");
      })
    );
  }
}
