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

  ajax: service("ajax"),

  can: service("can"),

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
        parseInt(this.get("year")) === moment().year() - 1 &&
        this.get("overtimeCreditAbility.canCreate") &&
        this.get("absenceCreditAbility.canCreate")
      );
    }
  ),

  setup() {
    this.get("years").perform();
    this.get("absenceCredits").perform();
    this.get("overtimeCredits").perform();
  },

  queryParamsDidChange({ shouldRefresh }) {
    if (shouldRefresh) {
      this.get("absenceCredits").perform();
      this.get("overtimeCredits").perform();
    }
  },

  absenceCredits: task(function* () {
    const year = this.get("year");

    return yield this.store.query("absence-credit", {
      user: this.get("model.id"),
      include: "absence_type",
      ordering: "-date",
      ...(year ? { year } : {}),
    });
  }),

  overtimeCredits: task(function* () {
    const year = this.get("year");

    return yield this.store.query("overtime-credit", {
      user: this.get("model.id"),
      ordering: "-date",
      ...(year ? { year } : {}),
    });
  }),

  transfer: task(function* () {
    /* istanbul ignore next */
    if (!this.get("allowTransfer")) {
      return;
    }

    try {
      yield this.get("ajax").request(
        `/api/v1/users/${this.get("model.id")}/transfer`,
        {
          method: "POST",
        }
      );

      this.get("notify").success("Transfer was successful");

      this.get("userController.data").perform(this.get("model.id"));

      this.resetQueryParams("year");
    } catch (e) {
      /* istanbul ignore next */
      this.get("notify").error("Error while transfering");
    }
  }).drop(),

  editAbsenceCredit: task(function* (id) {
    if (this.get("can").can("edit absence-credit")) {
      yield this.transitionToRoute(
        "users.edit.credits.absence-credits.edit",
        id
      );
    }
  }).drop(),

  editOvertimeCredit: task(function* (id) {
    if (this.get("can").can("edit overtime-credit")) {
      yield this.transitionToRoute(
        "users.edit.credits.overtime-credits.edit",
        id
      );
    }
  }).drop(),
});
