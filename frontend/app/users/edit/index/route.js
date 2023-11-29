import Route from "@ember/routing/route";

export default class UsersEditsIndexRoute extends Route {
  model() {
    return this.modelFor("users/edit");
  }

  setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);

    controller.set("user", model);
    controller.absences.perform();
    controller.employments.perform();
  }
}
