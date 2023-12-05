import Route from "@ember/routing/route";
import { inject as service } from "@ember/service";

export default class EditUserRoute extends Route {
  @service store;
  model({ user_id: id }) {
    return this.store.findRecord("user", id, { include: "supervisors" });
  }

  setupController(controller, model, ...args) {
    super.setupController(controller, model, ...args);
    controller.data.perform(model.id);
  }
}
