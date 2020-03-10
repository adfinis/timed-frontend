import Controller from "@ember/controller";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import TaskValidations from "timed/validations/task";

export default Controller.extend({
  TaskValidations,

  session: service(),
  notify: service(),
  user: reads("session.data.user"),
  projects: reads("fetchProjectsOfUser.lastSuccessful.value"),
  tasks: reads("fetchTasksOfProject.lastSuccessful.value"),
  ordering: 1,

  fetchProjectsOfUser: task(function*() {
    try {
      return yield this.store.query("project", {
        reviewer: this.user.id
      });
    } catch (exception) {
      this.notify.error("Could not fetch projects");
    }
  }),

  fetchTasksOfProject: task(function*() {
    try {
      return yield this.store.query("task", {
        project: this.get("selectedProject.id")
      });
    } catch (exception) {
      this.notify.error("Could not fetch tasks");
    }
  }).drop(),

  saveTask: task(function*(changeset) {
    try {
      yield changeset.save();

      this.notify.success("Task was saved");
    } catch (exception) {
      this.notify.error("Could not save task");
    }

    this.fetchTasksOfProject.perform(this.get("selectedProject"));
  }).drop(),

  createTask: task(function*() {
    try {
      this.set(
        "selectedTask",
        yield this.store.createRecord("task", {
          project: this.get("selectedProject")
        })
      );
    } catch (exception) {
      this.notify.error("Could not add task");
    }
  }).drop(),

  actions: {
    clearProjectSelection() {
      this.set("selectedProject", null);
    }
  }
});
