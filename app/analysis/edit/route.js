import Route from "@ember/routing/route";

export default class AnalysisEditRoute extends Route {
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== "error") {
      controller.send("resetController");
    }
  }
}
