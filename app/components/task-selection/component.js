/**
 * @module timed
 * @submodule timed-components
 * @public
 */
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { action, computed, set } from "@ember/object";
import { later } from "@ember/runloop";
import { inject as service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { dropTask, lastValue } from "ember-concurrency";
import hbs from "htmlbars-inline-precompile";
import { resolve } from "rsvp";
import customerOptionTemplate from "timed/templates/customer-option";
import projectOptionTemplate from "timed/templates/project-option";
import taskOptionTemplate from "timed/templates/task-option";

const SELECTED_TEMPLATE = hbs`{{selected.name}}`;

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

    this.prefetchData.perform();
    this._setInitial();
  }

  /**
   * Init hook, initially load customers and recent tasks
   *
   * @method init
   * @public
   */
  @dropTask
  *prefetchData() {
    try {
      yield this.tracking.customers.perform();
      yield this.tracking.recentTasks.perform();
    } catch (e) {
      /* istanbul ignore next */
      if (e.taskInstance && e.taskInstance.isCanceling) {
        return;
      }

      /* istanbul ignore next */
      throw e;
    }
  }

  _setInitial() {
    const { customer, project, task } = this.args.initial ?? {
      customer: null,
      project: null,
      task: null,
    };

    if (task && !this.task) {
      set(this, "task", task);
    } else if (project && !this.project) {
      set(this, "project", project);
    } else if (customer && !this.customer) {
      set(this, "customer", customer);
    }
  }

  /**
   * Whether to show archived customers, projects or tasks
   *
   * @property {Boolean} archived
   * @public
   */
  archived = false;

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
  selectedTemplate = SELECTED_TEMPLATE;

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
   * Whether to show history entries in the customer selection or not
   *
   * @property {Boolean} history
   * @public
   */
  history = true;

  @lastValue("getProjectsByCustomer")
  projects = [];

  @lastValue("getTasksByProjects")
  tasks = [];

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
    return this._customer;
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
    return this._project;
  }

  /**
   * The currently selected task
   *
   * @property {Task} task
   * @public
   */
  get task() {
    return this._task;
  }

  /**
   * All customers and recent tasks which are selectable in the dropdown
   *
   * @property {Array} customersAndRecentTasks
   * @public
   */
  @computed(
    "archived",
    "history",
    "tracking.customers.last",
    "tracking.recentTasks.last.value"
  )
  get customersAndRecentTasks() {
    let ids = [];

    (async () => {
      await this.tracking.customers.last;
    })();

    if (this.history) {
      (async () => {
        await this.tracking.recentTasks.last;
      })();

      const last = this.tracking.recentTasks.last?.value;

      ids = last ? last.mapBy("id") : [];
    }

    const customers = this.store
      .peekAll("customer")
      .filter((customer) => {
        return this.archived ? true : !customer.get("archived");
      })
      .sortBy("name");

    const tasks = this.store.peekAll("task").filter((task) => {
      return (
        ids.includes(task.get("id")) &&
        (this.archived ? true : !task.get("archived"))
      );
    });

    return [...tasks.toArray(), ...customers.toArray()];
  }

  /**
   * All projects which are selectable in the dropdown
   *
   * Those depend on the selected customer
   *
   * @property {Project[]} projects
   * @public
   */
  @dropTask
  *getProjectsByCustomer() {
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

  /**
   * All tasks which are selectable in the dropdown
   *
   * Those depend on the selected project
   *
   * @property {Task[]} tasks
   * @public
   */
  @dropTask
  *getTasksByProjects() {
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

  /**
   * Clear all comboboxes
   *
   * @method clear
   * @public
   */
  @action
  clear() {
    set(this, "customer", null);
    set(this, "project", null);
    set(this, "task", null);
  }

  @action
  reset() {
    this.clear();
    this._setInitial();
  }

  @action
  async onCustomerChange(value) {
    if (value && value.get("constructor.modelName") === "task") {
      this._customer = value.get("project.customer");
      this.onTaskChange(value);
      return;
    }

    this._customer = value;

    if (
      this.project &&
      (!value || value.get("id") !== this.project.get("customer.id"))
    ) {
      this.onProjectChange(null);
      return;
    }

    this.getProjectsByCustomer.perform();

    later(this, () => {
      (this["on-set-customer"] === undefined
        ? () => {}
        : this["on-set-customer"])(value);
    });
  }

  @action
  onProjectChange(value) {
    this._project = value;

    if (
      this.task &&
      (value === null || value.get("id") !== this.task.get("project.id"))
    ) {
      this.onTaskChange(null);
      return;
    }

    this.getTasksByProjects.perform();

    later(this, () => {
      (this["on-set-project"] === undefined
        ? () => {}
        : this["on-set-project"])(value);
    });
  }

  @action
  onTaskChange(value) {
    this._task = value;

    if (value && value.get("project.id")) {
      resolve(value.get("project")).then((p) => {
        this.onProjectChange(p);
      });
    }

    later(this, async () => {
      (this["on-set-task"] === undefined ? () => {} : this["on-set-task"])(
        value
      );
    });
  }
}
