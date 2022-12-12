import Controller, { inject as controller } from "@ember/controller";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import OvertimeCreditValidations from "timed/validations/overtime-credit";

export default Controller.extend({
  OvertimeCreditValidations,

  userController: controller("users.edit"),

  userCreditsController: controller("users.edit.credits.index"),

  notify: service("notify"),

  credit: task(function* () {
    const id = this.model;

    return id
      ? yield this.store.findRecord("overtime-credit", id)
      : yield this.store.createRecord("overtime-credit", {
          user: this.user,
        });
  }),

  save: task(function* (changeset) {
    try {
      yield changeset.save();

      this.notify.success("Overtime credit was saved");

      this.get("userController.data").perform(this.get("user.id"));

      let allYears = this.get(
        "userCreditsController.years.lastSuccessful.value"
      );

      if (!allYears) {
        allYears = yield this.get("userCreditsController.years").perform();
      }

      const year =
        allYears.find((y) => y === String(changeset.get("date").year())) || "";

      yield this.transitionToRoute("users.edit.credits", this.get("user.id"), {
        queryParams: { year },
      });
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while saving the overtime credit");
    }
  }).drop(),

  delete: task(function* (credit) {
    try {
      yield credit.destroyRecord();

      this.notify.success("Overtime credit was deleted");

      this.get("userController.data").perform(this.get("user.id"));

      this.transitionToRoute("users.edit.credits");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while deleting the overtime credit");
    }
  }).drop(),
});
