import Controller from "@ember/controller";
import { task, all, hash } from "ember-concurrency";
import QueryParams from "ember-parachute";
import moment from "moment";

const UsersEditQueryParams = new QueryParams({});

export default Controller.extend(UsersEditQueryParams.Mixin, {
  setup() {
    this.data.perform(this.get("model.id"));
  },

  data: task(function* (uid) {
    return yield hash({
      worktimeBalanceLastValidTimesheet:
        this.worktimeBalanceLastValidTimesheet.perform(uid),
      worktimeBalanceToday: this.worktimeBalanceToday.perform(uid),
      worktimeBalances: this.worktimeBalances.perform(uid),
      absenceBalances: this.absenceBalances.perform(uid),
    });
  }),

  worktimeBalanceLastValidTimesheet: task(function* (user) {
    const worktimeBalance = yield this.store.query("worktime-balance", {
      user,
      last_reported_date: 1, // eslint-disable-line camelcase
    });

    return worktimeBalance.get("firstObject");
  }),

  worktimeBalanceToday: task(function* (user) {
    const worktimeBalance = yield this.store.query("worktime-balance", {
      user,
      date: moment().format("YYYY-MM-DD"),
    });

    return worktimeBalance.get("firstObject");
  }),

  absenceBalances: task(function* (user) {
    return yield this.store.query("absence-balance", {
      user,
      date: moment().format("YYYY-MM-DD"),
      include: "absence_type",
    });
  }),

  worktimeBalances: task(function* (user) {
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
  }),
});
