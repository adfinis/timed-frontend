import Controller, { inject as controller } from "@ember/controller";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import AbsenceCreditValidations from "timed/validations/absence-credit";

export default Controller.extend({
  AbsenceCreditValidations,

  userController: controller("users.edit"),

  userCreditsController: controller("users.edit.credits.index"),

  notify: service("notify"),

  absenceTypes: task(function*() {
    return yield this.store.query("absence-type", {
      fill_worktime: 0 // eslint-disable-line camelcase
    });
  }),

  credit: task(function*() {
    const id = this.get("model");

    return id
      ? yield this.store.findRecord("absence-credit", id, {
          include: "absence_type"
        })
      : yield this.store.createRecord("absence-credit", {
          user: this.get("user")
        });
  }),

  save: task(function*(changeset) {
    try {
      yield changeset.save();

      this.get("notify").success("Absence credit was saved");

      this.get("userController.data").perform(this.get("user.id"));

      let allYears = this.get(
        "userCreditsController.years.lastSuccessful.value"
      );

      if (!allYears) {
        allYears = yield this.get("userCreditsController.years").perform();
      }

      const year =
        allYears.find(y => y === String(changeset.get("date").year())) || "";

      yield this.transitionToRoute("users.edit.credits", this.get("user.id"), {
        queryParams: { year }
      });
    } catch (e) {
      /* istanbul ignore next */
      this.get("notify").error("Error while saving the absence credit");
    }
  }).drop(),

  delete: task(function*(credit) {
    try {
      yield credit.destroyRecord();

      this.get("notify").success("Absence credit was deleted");

      this.get("userController.data").perform(this.get("user.id"));

      this.transitionToRoute("users.edit.credits");
    } catch (e) {
      /* istanbul ignore next */
      this.get("notify").error("Error while deleting the absence credit");
    }
  }).drop()
});
