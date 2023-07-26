import Route from "@ember/routing/route";

export default class AnalysisEditRoute extends Route {
  setupController(controller) {
    if (controller.id) {
      controller.id = controller.id.split(",");
    }
    controller.intersection.perform();
  }
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== "error") {
      controller.resetQueryParams();
    }
  }
}
