import Controller, { inject as controller } from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { ability } from "ember-can/computed";
import { dropTask, restartableTask } from "ember-concurrency";
import moment from "moment";

export default class UsersEditCredits extends Controller {
  queryParams = ["year"];
  @service notify;
  @service fetch;
  @service can;
  @service router;
  @service store;
  @controller("users.edit") userController;
  @tracked year = moment().year().toString();

  @action
  fetchData(year) {
    this.year = year;
    this.years.perform();
    this.absenceCredits.perform();
    this.overtimeCredits.perform();
  }

  @restartableTask
  *years(userId = 0) {
    const employments = yield this.store.query("employment", {
      user: userId === 0 ? this.model.id : userId,
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
      this.overtimeCreditAbility.canCreate &&
      this.absenceCreditAbility.canCreate
    );
  }

  @restartableTask
  *absenceCredits() {
    const year = this.year;

    return yield this.store.query("absence-credit", {
      user: this.model.id,
      include: "absence_type",
      ordering: "-date",
      ...(year ? { year } : {}),
    });
  }

  @restartableTask
  *overtimeCredits() {
    const year = this.year;

    return yield this.store.query("overtime-credit", {
      user: this.model.id,
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
      yield this.fetch.fetch(`/api/v1/users/${this.model.id}/transfer`, {
        method: "POST",
      });

      this.notify.success("Transfer was successful");

      this.userController.data.perform(this.model.id);

      this.fetchData(moment().year().toString());
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

  @dropTask
  *editOvertimeCredit(id) {
    if (this.can.can("edit overtime-credit")) {
      yield this.router.transitionTo(
        "users.edit.credits.overtime-credits.edit",
        id
      );
    }
  }
}
