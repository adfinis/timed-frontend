import Route from "@ember/routing/route";

export default class ProjectsRoute extends Route {
  setupController(controller, ...args) {
    super.setupController(controller, ...args);

    controller.fetchProjectsByUser.perform();
  }
}
