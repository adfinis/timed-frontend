import Controller from "@ember/controller";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";

export default Controller.extend({
  session: service(),
  user: reads("session.data.user"),
  projects: reads("fetchProjectsOfUser.lastSuccessful.value"),
  tasks: reads("fetchTasksOfProject.lastSuccessful.value"),
  ordering: 1,

  fetchProjectsOfUser: task(function*() {
    return yield this.store.query("project", {
      reviewer: this.user.id
    });
  }),

  fetchTasksOfProject: task(function*(project) {
    return yield this.store.query("task", {
      project: project.id
    });
  }).drop(),

  saveTask: task(function*(changeset) {
    yield changeset.save();

    this.fetchTasksOfProject.perform(this.get("selectedProject"));
  }).drop(),

  createTask: task(function*() {
    this.set(
      "selectedTask",
      yield this.store.createRecord("task", {
        project: this.get("selectedProject")
      })
    );
  }).drop()
});
