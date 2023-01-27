import { action } from "@ember/object";
import { later } from "@ember/runloop";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { dropTask, restartableTask } from "ember-concurrency";
import { trackedTask } from "ember-resources/util/ember-concurrency";
import { resolve } from "rsvp";
import customerOptionTemplate from "timed/components/optimized-power-select/custom-options/customer-option";
import projectOptionTemplate from "timed/components/optimized-power-select/custom-options/project-option";
import taskOptionTemplate from "timed/components/optimized-power-select/custom-options/task-option";
import customSelectedTemplate from "timed/components/optimized-power-select/custom-select/task-selection";

/**
 * Component for selecting a task, which consists of selecting a customer and
 * project first.
 *
 * @class TaskSelectionComponent
 * @extends Ember.Component
 * @public
 */
export default class TaskSelectionComponent extends Component {
  @service store;
  @service tracking;

  constructor(...args) {
    super(...args);

    // preselect initial task
    this._setInitial();

    if (this.args.task) {
      this.onTaskChange(this.args.task, { preventAction: true });
    }
  }

  async _setInitial() {
    await this.tracking.fetchActiveActivity?.last;

    const { customer, project, task } = this.args.initial ?? {
      customer: null,
      project: null,
      task: null,
    };

    if (task && !this.task) {
      this.onTaskChange(task);
    } else if (project && !this.project) {
      this.onProjectChange(project);
    } else if (customer && !this.customer) {
      this.onCustomerChange(customer);
    }
  }

  /**
   * Template for displaying the customer options
   *
   * @property {*} customerOptionTemplate
   * @public
   */
  customerOptionTemplate = customerOptionTemplate;

  /**
   * Template for displaying the project options
   *
   * @property {*} projectOptionTemplate
   * @public
   */
  projectOptionTemplate = projectOptionTemplate;

  /**
   * Template for displaying the task options
   *
   * @property {*} taskOptionTemplate
   * @public
   */
  taskOptionTemplate = taskOptionTemplate;

  /**
   * Template for displaying the selected option
   *
   * @property {*} selectedTemplate
   * @public
   */
  selectedTemplate = customSelectedTemplate;

  /**
   * The manually selected customer
   *
   * @property {Customer} _customer
   * @private
   */
  @tracked
  _customer = null;

  /**
   * The manually selected project
   *
   * @property {Project} _project
   * @private
   */
  @tracked
  _project = null;

  /**
   * The manually selected task
   *
   * @property {Task} _task
   * @private
   */
  @tracked
  _task = null;

  /**
   * Whether to show archived customers, projects or tasks
   *
   * @property {Boolean} archived
   * @public
   */
  get archived() {
    return this.args.archived ?? false;
  }

  /**
   * Whether to show history entries in the customer selection or not
   *
   * @property {Boolean} history
   * @public
   */
  get history() {
    return this.args.history ?? true;
  }

  /**
   * The selected customer
   *
   * This can be selected manually or automatically, because a task is already
   * set.
   *
   * @property {Customer} customer
   * @public
   */
  get customer() {
    // Without unwrapping of the proxy ember-power-select will stick to wrong reference after clearing
    return this.args.liveTracking
      ? this.tracking.activeCustomer?.content ?? this._customer
      : this._customer;
  }

  /**
   * The selected project
   *
   * This can be selected manually or automatically, because a task is already
   * set.
   *
   * @property {Project} project
   * @public
   */
  get project() {
    // Without unwrapping of the proxy ember-power-select will stick to wrong reference after clearing
    return this.args.liveTracking
      ? this.tracking.activeProject?.content ?? this._project
      : this._project;
  }

  /**
   * The currently selected task
   *
   * @property {Task} task
   * @public
   */
  get task() {
    return this.args.liveTracking
      ? this.tracking.activeTask?.content ?? this._task
      : this._task;
  }

  /**
   * All customers and recent tasks which are selectable in the dropdown
   *
   * @property {Array} customersAndRecentTasks
   * @public
   */
  @dropTask
  *customersAndRecentTasksTask() {
    yield Promise.resolve();

    if (!this.tracking.customers || !this.tracking.recentTasks) {
      yield this.tracking.fetchRecentTasks.last;
      yield this.tracking.fetchCustomers.last;
    }

    let ids = [];

    if (this.history) {
      const last = this.tracking.recentTasks;

      ids = last ? last.mapBy("id") : [];
    }

    const customers = this.store
      .peekAll("customer")
      .filter((customer) => {
        return this.archived ? true : !customer.archived;
      })
      .sortBy("name");

    const tasks = this.store.peekAll("task").filter((task) => {
      return ids.includes(task.id) && (this.archived ? true : !task.archived);
    });

    return [...tasks.toArray(), ...customers.toArray()];
  }

  _customersAndRecentTasks = trackedTask(
    this,
    this.customersAndRecentTasksTask,
    () => [this.history, this.tracking.recentTasks, this.archived]
  );

  get customersAndRecentTasks() {
    return this._customersAndRecentTasks.value ?? [];
  }

  /**
   * All projects which are selectable in the dropdown
   *
   * Those depend on the selected customer
   *
   * @property {Project[]} projects
   * @public
   */
  @restartableTask
  *getProjectsByCustomer() {
    yield Promise.resolve();

    if (this.customer?.id) {
      yield this.tracking.projects.perform(this.customer.id);
    }

    return yield this.store
      .peekAll("project")
      .filter((project) => {
        return (
          project.get("customer.id") === this.customer?.id &&
          (this.archived ? true : !project.get("archived"))
        );
      })
      .sortBy("name");
  }

  _getProjectsByCustomer = trackedTask(this, this.getProjectsByCustomer, () => [
    this.customer,
  ]);

  get projects() {
    return this._getProjectsByCustomer.value ?? [];
  }

  /**
   * All tasks which are selectable in the dropdown
   *
   * Those depend on the selected project
   *
   * @property {Task[]} tasks
   * @public
   */
  @restartableTask
  *getTasksByProjects() {
    yield Promise.resolve();

    if (this.project?.id) {
      yield this.tracking.tasks.perform(this.project.id);
    }

    return yield this.store
      .peekAll("task")
      .filter((t) => {
        return (
          t.get("project.id") === this.project?.id &&
          (this.archived ? true : !t.get("archived"))
        );
      })
      .sortBy("name");
  }

  _getTasksByProjects = trackedTask(this, this.getTasksByProjects, () => [
    this.customer,
    this.project,
  ]);

  get tasks() {
    return this._getTasksByProjects.value ?? [];
  }

  /**
   * Clear all comboboxes
   *
   * @method clear
   * @public
   */
  @action
  clear() {
    const options = {
      preventFetchingData: true,
      preventAction: true,
    };
    this.onCustomerChange(null, options);
  }

  @action
  reset() {
    this.clear();
    this._setInitial();
  }

  @action
  async onCustomerChange(value, options = {}) {
    if (value && value.get("constructor.modelName") === "task") {
      this._customer = await value.get("project.customer");
      this.onTaskChange(value);
      return;
    }

    this._customer = value;

    if (
      this.project &&
      (!value || value.get("id") !== this.project.get("customer.id"))
    ) {
      this.onProjectChange(null, options);
    }

    if (!options.preventAction) {
      later(this, () => {
        (this.args["on-set-customer"] === undefined
          ? () => {}
          : this.args["on-set-customer"])(value);
      });
    }
  }

  @action
  onProjectChange(value, options = {}) {
    this._project = value;

    if (
      this.task &&
      (value === null || value.get("id") !== this.task.get("project.id"))
    ) {
      this.onTaskChange(null, options);
    }

    if (!this.customer && value?.get("customer.id")) {
      resolve(value.get("customer")).then((c) => {
        this.onCustomerChange(c, {
          preventAction: true,
        });
      });
    }

    if (!options.preventAction) {
      later(this, () => {
        (this.args["on-set-project"] === undefined
          ? () => {}
          : this.args["on-set-project"])(value);
      });
    }
  }

  @action
  onTaskChange(value, options = {}) {
    this._task = value;

    if (!this.project && value?.get("project.id")) {
      resolve(value.get("project")).then((p) => {
        this.onProjectChange(p, {
          preventAction: true,
        });
      });
    }

    if (!options.preventAction) {
      later(this, async () => {
        (this.args["on-set-task"] === undefined
          ? () => {}
          : this.args["on-set-task"])(value);
      });
    }
  }
}
