import Controller from "@ember/controller";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";

export default Controller.extend({
  session: service(),
  user: reads("session.data.user"),
  projects: reads("fetchProjectsOfUser.lastSuccessful.value"),
  ordering: 1,

  fetchProjectsOfUser: task(function*() {
    return yield this.store.query("project", {
      reviewer: this.user.id
    });
  }),

  fetchTasksOfProject: task(function*(project) {
    return yield this.store
      .query("task", {
        project: project.id
      })
      .toArray();
  }).drop(),

  saveTask: task(function*() {}),

  actions: {
    onSelectTask(task) {
      this.set("selectedTask", task);
    }
  }
});
