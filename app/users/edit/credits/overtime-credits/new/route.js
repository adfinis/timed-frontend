import Route from "@ember/routing/route";

const EDIT_PATH = "users.edit.credits.overtime-credits.edit";

export default class UsersEditCreditsOvertimeCreditsNewRoute extends Route {
  controllerName = EDIT_PATH;

  templateName = EDIT_PATH;

  model = () => null;

  setupController(controller, ...args) {
    super.setupController(controller, ...args);

    controller.set("user", this.modelFor("users.edit"));
    controller.credit.perform();
  }
}
