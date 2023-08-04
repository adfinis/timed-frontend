import Route from "@ember/routing/route";

export default class AnalysisIndexRoute extends Route {
  setupController(controller) {
    controller.prefetchData.perform();
    controller.data.perform();
  }
}
