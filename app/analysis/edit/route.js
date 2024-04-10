import Route from "@ember/routing/route";
import { resetQueryParams } from "timed/utils/query-params";

export default class AnalysisEditRoute extends Route {
  setupController(controller) {
    if (controller.id) {
      controller.id = controller.id.split(",");
    }
    controller.intersection.perform();
  }
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== "error") {
      resetQueryParams(controller, controller.queryParams);
    }
  }
}
