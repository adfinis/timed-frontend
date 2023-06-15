import Controller, { inject as controller } from "@ember/controller";
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import { ability } from "ember-can/computed";
import { task } from "ember-concurrency";
import QueryParams from "ember-parachute";
import moment from "moment";

const UsersEditCreditsQueryParams = new QueryParams({
  year: {
    defaultValue: `${moment().year()}`,
    replace: true,
    refresh: true,
  },
});

export default Controller.extend(UsersEditCreditsQueryParams.Mixin, {
  notify: service("notify"),

  fetch: service("fetch"),

  can: service("can"),

  router: service("router"),

  store: service("store"),

  userController: controller("users.edit"),

  years: task(function* () {
    const employments = yield this.store.query("employment", {
      user: this.get("model.id"),
      ordering: "start_date",
    });

    const from = (employments.get("firstObject.start") || moment()).year();
    const to = moment().add(1, "year").year();

    return [...new Array(to + 1 - from).keys()].map((i) => `${from + i}`);
  }),

  overtimeCreditAbility: ability("overtime-credit"),
  absenceCreditAbility: ability("absence-credit"),

  allowTransfer: computed(
    "year",
    "overtimeCreditAbility.canCreate",
    "absenceCreditAbility.canCreate",
    function () {
      return (
        parseInt(this.year) === moment().year() - 1 &&
        this.get("overtimeCreditAbility.canCreate") &&
        this.get("absenceCreditAbility.canCreate")
      );
    }
  ),

  setup() {
    this.years.perform();
    this.absenceCredits.perform();
    this.overtimeCredits.perform();
  },

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.absenceCredits.perform();
      this.overtimeCredits.perform();
    }
  },

  absenceCredits: task(function* () {
    const year = this.year;

    return yield this.store.query("absence-credit", {
      user: this.get("model.id"),
      include: "absence_type",
      ordering: "-date",
      ...(year ? { year } : {}),
    });
  }),

  overtimeCredits: task(function* () {
    const year = this.year;

    return yield this.store.query("overtime-credit", {
      user: this.get("model.id"),
      ordering: "-date",
      ...(year ? { year } : {}),
    });
  }),

  transfer: task(function* () {
    /* istanbul ignore next */
    if (!this.allowTransfer) {
      return;
    }

    try {
      yield this.fetch.fetch(`/api/v1/users/${this.get("model.id")}/transfer`, {
        method: "POST",
      });

      this.notify.success("Transfer was successful");

      this.userController.data.perform(this.get("model.id"));

      this.resetQueryParams("year");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while transfering");
    }
  }).drop(),

  editAbsenceCredit: task(function* (id) {
    if (this.can.can("edit absence-credit")) {
      yield this.router.transitionTo(
        "users.edit.credits.absence-credits.edit",
        id
      );
    }
  }).drop(),

  editOvertimeCredit: task(function* (id) {
    if (this.can.can("edit overtime-credit")) {
      yield this.router.transitionTo(
        "users.edit.credits.overtime-credits.edit",
        id
      );
    }
  }).drop(),
});
