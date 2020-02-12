import Route from "@ember/routing/route";

const EDIT_PATH = "users.edit.credits.absence-credits.edit";

export default Route.extend({
  controllerName: EDIT_PATH,

  templateName: EDIT_PATH,

  model: () => null,

  setupController(controller, ...args) {
    this._super(controller, ...args);

    controller.set("user", this.modelFor("users.edit"));
    controller.get("absenceTypes").perform();
    controller.get("credit").perform();
  }
});
