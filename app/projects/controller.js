import Controller from "@ember/controller";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";

export default Controller.extend({
  session: service(),
  user: reads("session.data.user"),
  projects: reads("fetchProjectsOfUser.lastSuccessful.value"),

  fetchProjectsOfUser: task(function*() {
    return yield this.store.query("project", {
      reviewer: this.user.id
    });
  })
});
