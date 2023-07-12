import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class IndexReportsRoute extends Route {
  @service store;

  /**
   * Before model hook, fetch all absence types
   *
   * @method beforeModel
   * @return {AbsenceType[]} All absence types
   * @public
   */
  beforeModel(...args) {
    super.beforeModel(...args);

    return this.store.findAll("absence-type");
  }

  setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);

    controller.set("user", this.modelFor("protected"));
    controller.set("rescheduleDate", model);
  }
}
