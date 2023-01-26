import Controller, { inject as controller } from "@ember/controller";
import { inject as service } from "@ember/service";
import { dropTask, task } from "ember-concurrency";
import AbsenceCreditValidations from "timed/validations/absence-credit";

export default class UsersEditCreditsAbsenceCreditsEditController extends Controller {
  AbsenceCreditValidations = AbsenceCreditValidations;

  @controller("users.edit") userController;

  @controller("users.edit.credits.index") userCreditsController;

  @service notify;
  @service router;

  @task
  *absenceTypes() {
    return yield this.store.query("absence-type", {
      fill_worktime: 0, // eslint-disable-line camelcase
    });
  }

  @task
  *credit() {
    const id = this.model;

    return id
      ? yield this.store.findRecord("absence-credit", id, {
          include: "absence_type",
        })
      : yield this.store.createRecord("absence-credit", {
          user: this.user,
        });
  }

  @dropTask
  *save(changeset) {
    try {
      yield changeset.save();

      this.notify.success("Absence credit was saved");

      this.get("userController.data").perform(this.get("user.id"));

      let allYears = this.get("userCreditsController.years.value");

      if (!allYears) {
        allYears = yield this.get("userCreditsController._years").perform();
      }

      const year =
        allYears.find((y) => y === String(changeset.get("date").year())) || "";

      yield this.router.transitionTo(
        "users.edit.credits",
        this.get("user.id"),
        {
          queryParams: { year },
        }
      );
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while saving the absence credit");
    }
  }

  @dropTask
  *delete(credit) {
    try {
      yield credit.destroyRecord();

      this.notify.success("Absence credit was deleted");

      this.get("userController.data").perform(this.get("user.id"));

      this.router.transitionTo("users.edit.credits");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while deleting the absence credit");
    }
  }
}
