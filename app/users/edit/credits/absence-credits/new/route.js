import Route from "@ember/routing/route";

const EDIT_PATH = "users.edit.credits.absence-credits.edit";

export default class NewUsersAbsenceCredit extends Route {
  controllerName = EDIT_PATH;

  templateName = EDIT_PATH;

  model = () => null;

  setupController(controller, ...args) {
    super.setupController(controller, ...args);

    controller.set("user", this.modelFor("users.edit"));
    controller.absenceTypes.perform();
    controller.credit.perform();
  }
}
