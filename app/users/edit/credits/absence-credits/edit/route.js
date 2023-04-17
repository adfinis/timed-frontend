import Route from "@ember/routing/route";

export default class UsersEditCreditsAbsenceCreditsEditRoute extends Route {
  model = ({ absence_credit_id: id }) => id;

  setupController(controller, ...args) {
    super.setupController(controller, ...args);

    controller.set("user", this.modelFor("users.edit"));
    controller.absenceTypes.perform();
    controller.credit.perform();
  }
}
