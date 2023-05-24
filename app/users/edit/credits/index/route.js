import Route from "@ember/routing/route";

export default class UsersEditCreditsIndexRoute extends Route {
  model() {
    return this.modelFor("users/edit");
  }
  setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);
    controller.years.perform();
    controller.absenceCredits.perform();
    controller.overtimeCredits.perform();
  }
}
