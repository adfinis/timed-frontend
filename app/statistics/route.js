import Route from "@ember/routing/route";

export default class StatisticsRoute extends Route {
  setupController(controller) {
    controller.data.perform();
    controller.prefetchData.perform();
  }
}
