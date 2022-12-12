import Route from "@ember/routing/route";

export default Route.extend({
  model: ({ absence_credit_id: id }) => id,

  setupController(controller, ...args) {
    this._super(controller, ...args);

    controller.set("user", this.modelFor("users.edit"));
    controller.absenceTypes.perform();
    controller.credit.perform();
  },
});
