import Route from "@ember/routing/route";

export default class IndexActivitiesRoute extends Route {
  model() {
    return this.modelFor("index");
  }
}
