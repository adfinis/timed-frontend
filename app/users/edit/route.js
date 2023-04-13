import Route from "@ember/routing/route";

export default class EditUserRoute extends Route {
  model({ user_id: id }) {
    return this.store.findRecord("user", id, { include: "supervisors" });
  }
}
