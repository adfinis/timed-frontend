import Controller, { inject as controller } from "@ember/controller";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import AbsenceCreditValidations from "timed/validations/absence-credit";

export default class UsersEditAbsenceCreditsController extends Controller {
  AbsenceCreditValidations = AbsenceCreditValidations;
  @service notify;
  @service router;

  @controller("users.edit") userController;
  @controller("users.edit.credits.index") userCreditsController;

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

  @task({ drop: true })
  *save(changeset) {
    try {
      yield changeset.save();

      this.notify.success("Absence credit was saved");

      this.userController.data.perform(this.user.id);

      let allYears = this.userCreditsController.years.lastSuccessful?.value;

      if (!allYears) {
        allYears = yield this.userCreditsController.years.perform(this.user.id);
      }

      const year =
        allYears.find((y) => y === String(changeset.get("date").year())) || "";

      yield this.router.transitionTo("users.edit.credits", this.user.id, {
        queryParams: { year },
      });
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while saving the absence credit");
    }
  }

  @task({ drop: true })
  *delete(credit) {
    try {
      yield credit.destroyRecord();

      this.notify.success("Absence credit was deleted");

      this.userController.data.perform(this.user.id);

      this.router.transitionTo("users.edit.credits");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while deleting the absence credit");
    }
  }
}
