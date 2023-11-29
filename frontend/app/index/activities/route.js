import Route from "@ember/routing/route";

export default class IndexActivitiesRoute extends Route {
  model() {
    return this.modelFor("index");
  }

  setupController(controller, ...args) {
    super.setupController(controller, ...args);

    controller.set("user", this.modelFor("protected"));
  }
}
