import Controller from "@ember/controller";
import { or, reads, uniqBy } from "@ember/object/computed";
import { inject as service } from "@ember/service";
import { task } from "ember-concurrency";
import { all } from "rsvp";
import TaskValidations from "timed/validations/task";

export default Controller.extend({
  TaskValidations,

  session: service(),
  notify: service(),
  user: reads("session.data.user"),
  projects: reads("fetchProjectsOfUser.lastSuccessful.value"),
  filteredProjects: reads("filterProjects.lastSuccessful.value"),
  tasks: reads("fetchTasksOfProject.lastSuccessful.value"),
  customers: uniqBy("fetchCustomersOfProject.lastSuccessful.value", "id"),
  loading: or(
    "fetchTasksOfProject.isRunning",
    "fetchCustomersOfProject.isRunning"
  ),

  fetchProjectsOfUser: task(function*() {
    try {
      let projects;
      if (this.get("user.isSuperuser")) {
        projects = yield this.store.findAll("project");
      } else {
        projects = yield this.store.query("project", {
          has_reviewer: this.get("user.id")
        });
      }

      this.fetchCustomersOfProject.perform(projects);
      return projects;
    } catch (error) {
      this.notify.error("Error while fetching projects");
    }
  }),

  fetchCustomersOfProject: task(function*(projects) {
    return yield all(
      projects.map(async project => {
        return await project.get("customer");
      })
    );
  }),

  filterProjects: task(function*() {
    return yield this.get("projects").filter(
      project => project.get("customer.id") === this.get("selectedCustomer.id")
    );
  }),

  fetchTasksOfProject: task(function*() {
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

    this.fetchTasksOfProject.perform(this.get("selectedProject"));
  }).drop(),

  createTask: task(function*() {
    this.set(
      "selectedTask",
      yield this.store.createRecord("task", {
        project: this.get("selectedProject")
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

      if (this.get("selectedProject") !== null) {
        this.fetchTasksOfProject.perform();
      }
    }
  }
});
