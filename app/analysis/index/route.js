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
    const skipReset = controller.skipResetOnSetup;
    next(() => {
      if (!skipReset) {
        controller._reset();
      }
    });
  }

  setupController(controller) {
    controller.prefetchData.perform();
  }
}
