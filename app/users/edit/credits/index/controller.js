import Controller, { inject as controller } from "@ember/controller";
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { ability } from "ember-can/computed";
import { dropTask } from "ember-concurrency";
import { task } from "ember-concurrency";
import { trackedTask } from "ember-resources/util/ember-concurrency";
import moment from "moment";

export default class UsersEditCreditsController extends Controller {
  @service notify;
  @service fetch;
  @service can;
  @service router;

  @controller("users.edit") userController;

  queryParams = {
    year: {
      refreshModel: true,
      replace: true,
    },
  };

  year = moment().year();
  years = trackedTask(this, this._years, () => [this.model?.id]);

  @task
  *_years() {
    yield Promise.resolve();

    const employments = yield this.store.query("employment", {
      user: this.get("model.id"),
      ordering: "start_date",
    });

    const from = (employments.get("firstObject.start") || moment()).year();
    const to = moment().add(1, "year").year();

    return [...new Array(to + 1 - from).keys()].map((i) => `${from + i}`);
  }

  @ability("overtime-credit") overtimeCreditAbility;
  @ability("absence-credit") absenceCreditAbility;

  get allowTransfer() {
    return (
      parseInt(this.year) === moment().year() - 1 &&
      this.get("overtimeCreditAbility.canCreate") &&
      this.get("absenceCreditAbility.canCreate")
    );
  }

  absenceCredits = trackedTask(this, this._absenceCredits, () => [this.year]);

  @task
  *_absenceCredits() {
    yield Promise.resolve();

    const year = this.year;

    return yield this.store.query("absence-credit", {
      user: this.get("model.id"),
      include: "absence_type",
      ordering: "-date",
      ...(year ? { year } : {}),
    });
  }

  overtimeCredits = trackedTask(this, this._overtimeCredits, () => [this.year]);

  @task
  *_overtimeCredits() {
    yield Promise.resolve();

    const year = this.year;

    return yield this.store.query("overtime-credit", {
      user: this.get("model.id"),
      ordering: "-date",
      ...(year ? { year } : {}),
    });
  }

  @dropTask
  *transfer() {
    /* istanbul ignore next */
    if (!this.allowTransfer) {
      return;
    }

    try {
      yield this.fetch.fetch(`/api/v1/users/${this.get("model.id")}/transfer`, {
        method: "POST",
      });

      this.notify.success("Transfer was successful");

      this.get("userController.data").perform(this.get("model.id"));

      this.year = `${moment().year()}`;
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while transfering");
    }
  }

  @dropTask
  *editAbsenceCredit(id) {
    if (this.can.can("edit absence-credit")) {
      yield this.router.transitionTo(
        "users.edit.credits.absence-credits.edit",
        id
      );
    }
  }

  @task
  *editOvertimeCredit(id) {
    if (this.can.can("edit overtime-credit")) {
      yield this.router.transitionTo(
        "users.edit.credits.overtime-credits.edit",
        id
      );
    }
  }

  @action
  transitionTo(route) {
    this.router.transitionTo(route);
  }
}
