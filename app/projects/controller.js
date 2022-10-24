import Controller from "@ember/controller";
import { computed } from "@ember/object";
import { reads } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import TaskValidations from "timed/validations/task";

export default Controller.extend({
  TaskValidations,

  session: service(),
  notify: service(),
  user: reads("session.data.user"),
  projects: reads("fetchProjectsByUser.lastSuccessful.value"),
  filteredProjects: reads("filterProjects.lastSuccessful.value"),
  tasks: reads("fetchTasksByProject.lastSuccessful.value"),
  loading: reads("fetchTasksByProject.isRunning"),

  customers: computed("projects", function() {
    return (
      this.projects
        ?.map(project => project.get("customer"))
        .uniqBy("id")
        .sortBy("name") ?? []
    );
  }),

  fetchProjectsByUser: task(function*() {
    try {
      let projects;
      if (this.get("user.isSuperuser")) {
        projects = yield this.store.findAll("project");
      } else {
        projects = yield this.store.query("project", {
          has_manager: this.get("user.id"),
          include: "customer"
        });
      }

      return projects.sortBy("name");
    } catch (error) {
      this.notify.error("Error while fetching projects");
    }
  }),

  filterProjects: task(function*() {
    return yield this.projects.filter(
      project => project.get("customer.id") === this.get("selectedCustomer.id")
    );
  }),

  fetchTasksByProject: task(function*() {
    try {
      return yield this.store.query("task", {
        project: this.get("selectedProject.id")
      });
    } catch (error) {
      this.notify.error("Error while fetching tasks");
    }
  }).drop(),

  saveTask: task(function*(changeset) {
    try {
      yield changeset.save();

      this.notify.success("Task was saved");
    } catch (error) {
      /* istanbul ignore next */
      this.notify.error("Error while saving task");
    }

    this.fetchTasksByProject.perform(this.selectedProject);
  }).drop(),

  createTask: task(function*() {
    this.set(
      "selectedTask",
      yield this.store.createRecord("task", {
        project: this.selectedProject
      })
    );
  }).drop(),

  actions: {
    handleCustomerChange(customer) {
      this.set("selectedCustomer", customer);
      this.set("selectedProject", null);
      this.set("selectedTask", null);

      this.filterProjects.perform();
    },

    handleProjectChange(project) {
      this.set("selectedProject", project);
      this.set("selectedTask", null);

      if (this.selectedProject !== null) {
        this.fetchTasksByProject.perform();
      }
    }
  }
});
