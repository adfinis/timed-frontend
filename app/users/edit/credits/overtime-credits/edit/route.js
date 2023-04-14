import Route from "@ember/routing/route";

export default class NewUserOvertimeCreditRoute extends Route {
  model = ({ overtime_credit_id: id }) => id;

  setupController(controller, ...args) {
    super.setupController(controller, ...args);

    controller.set("user", this.modelFor("users.edit"));
    controller.credit.perform();
  }
}
