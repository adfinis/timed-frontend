import Controller, { inject as controller } from "@ember/controller";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import OvertimeCreditValidations from "timed/validations/overtime-credit";

export default class UsersEditOvertimeCreditsController extends Controller {
  @service notify;
  @service router;
  @service store;
  @controller("users.edit") userController;
  @controller("users.edit.credits.index") userCreditsController;

  OvertimeCreditValidations = OvertimeCreditValidations;

  @task
  *credit() {
    const id = this.model;

    return id
      ? yield this.store.findRecord("overtime-credit", id)
      : yield this.store.createRecord("overtime-credit", {
          user: this.user,
        });
  }

  @task({ drop: true })
  *save(changeset) {
    try {
      yield changeset.save();

      this.notify.success("Overtime credit was saved");

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
      this.notify.error("Error while saving the overtime credit");
    }
  }

  @task({ drop: true })
  *delete(credit) {
    try {
      yield credit.destroyRecord();

      this.notify.success("Overtime credit was deleted");

      this.userController.data.perform(this.user.id);

      this.router.transitionTo("users.edit.credits");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while deleting the overtime credit");
    }
  }
}
