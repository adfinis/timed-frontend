import Route from "@ember/routing/route";
import { next } from "@ember/runloop";

export default class AnalysisIndexRoute extends Route {
  queryParams = {
    rejected: {
      refreshModel: true,
    },
    verified: {
      refreshModel: true,
    },
  };

  model() {
    /* eslint-disable-next-line ember/no-controller-access-in-routes */
    const controller = this.controllerFor("analysis.index");
    next(() => {
      controller._reset();
    });
  }

  setupController(controller) {
    controller.prefetchData.perform();
  }
}
