import Controller from "@ember/controller";
import { action, get } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import { dropTask, lastValue, task } from "ember-concurrency";
import ProjectValidations from "timed/validations/project";
import TaskValidations from "timed/validations/task";

export default class ProjectsController extends Controller {
  taskValidations = TaskValidations;
  projectValidations = ProjectValidations;

  @service session;
  @service notify;

  @tracked selectedCustomer;
  @tracked selectedProject;
  @tracked selectedTask;

  @lastValue("fetchProjectsByUser") projects;

  @lastValue("filterProjects") filteredProjects;

  @lastValue("fetchTasksByProject") tasks;

  get loading() {
    return this.fetchTasksByProject.isRunning;
  }

  get user() {
    return this.session.data.user;
  }

  get customers() {
    return (
      this.projects
        ?.map((project) => project.get("customer"))
        .uniqBy("id")
        .sortBy("name") ?? []
    );
  }

  @task
  *fetchProjectsByUser() {
    try {
      let projects;
      if (get(this, "user.isSuperuser")) {
        projects = yield this.store.findAll("project", {
          include: "customer",
        });
      } else {
        projects = yield this.store.query("project", {
          has_manager: get(this, "user.id"),
          include: "customer",
        });
      }

      return projects.sortBy("name");
    } catch (error) {
      /* istanbul ignore next */
      this.notify.error("Error while fetching projects");
    }
  }

  @task
  *filterProjects() {
    return yield this.projects.filter(
      (project) =>
        project.get("customer.id") === get(this, "selectedCustomer.id")
    );
  }

  @dropTask
  *fetchTasksByProject() {
    try {
      const id = get(this, "selectedProject.id");
      return yield this.store.query("task", {
        project: id,
      });
    } catch (error) {
      /* istanbul ignore next */
      this.notify.error("Error while fetching tasks");
    }
  }

  @dropTask
  *saveTask(changeset) {
    try {
      yield changeset.save();

      this.notify.success("Task was saved");
    } catch (error) {
      /* istanbul ignore next */
      this.notify.error("Error while saving task");
    }

    this.fetchTasksByProject.perform(this.selectedProject);
  }

  @dropTask
  *saveProject(changeset) {
    try {
      yield changeset.save();
      this.notify.success("Project was saved");
    } catch (error) {
      /* istanbul ignore next */
      this.notify.error("Error while saving project");
    }
    this.fetchTasksByProject.perform(this.selectedProject);
  }

  @dropTask
  *createTask() {
    this.selectedTask = yield this.store.createRecord("task", {
      project: this.selectedProject,
    });
  }

  @action
  handleCustomerChange(customer) {
    // If customer is null, we return a Promise. EPS has a bug, where promise
    // based selections can not get reset with a non-promise value.
    // See: https://github.com/cibernox/ember-power-select/issues/1467
    this.selectedCustomer = customer ?? Promise.resolve();
    this.selectedProject = null;
    this.selectedTask = null;

    if (this.selectedCustomer !== null) {
      this.filterProjects.perform();
    }
  }

  @action
  handleProjectChange(project) {
    this.selectedProject = project;
    this.selectedTask = null;

    if (this.selectedProject !== null) {
      this.fetchTasksByProject.perform();
    }
  }

  @action
  updateRemainingEffort(changeset) {
    if (!changeset.get("mostRecentRemainingEffort")) {
      changeset.set(
        "mostRecentRemainingEffort",
        changeset.get("estimatedTime")
      );
    }
  }
}
