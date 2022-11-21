/**
 * @module timed
 * @submodule timed-components
 * @public
 */
import Component from "@ember/component";
import { computed } from "@ember/object";
import { later } from "@ember/runloop";
import { inject as service } from "@ember/service";
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
export default Component.extend({
  store: service(),
  tracking: service(),

  /**
   * HTML tag name for the component
   *
   * This is an empty string, so we don't have an element of this component in
   * the DOM
   *
   * @property {String} tagName
   * @public
   */
  tagName: "",

  /**
   * Init hook, initially load customers and recent tasks
   *
   * @method init
   * @public
   */
  async init(...args) {
    this._super(...args);

    try {
      await this.tracking.customers.perform();
      await this.tracking.recentTasks.perform();
    } catch (e) {
      /* istanbul ignore next */
      if (e.taskInstance && e.taskInstance.isCanceling) {
        return;
      }

      /* istanbul ignore next */
      throw e;
    }
  },

  /**
   * Set the initial values when receiving the attributes
   *
   * @method didReceiveAttrs
   * @return {Task|Project|Customer} The setted task, project or customer
   * @public
   */
  didReceiveAttrs() {
    this._super();

    this._setInitial();
  },

  _setInitial() {
    const { customer, project, task } = this.getWithDefault("initial", {
      customer: null,
      project: null,
      task: null
    });

    if (task && !this.task) {
      this.set("task", task);
    } else if (project && !this.project) {
      this.set("project", project);
    } else if (customer && !this.customer) {
      this.set("customer", customer);
    }
  },

  /**
   * Whether to show archived customers, projects or tasks
   *
   * @property {Boolean} archived
   * @public
   */
  archived: false,

  /**
   * Template for displaying the customer options
   *
   * @property {*} customerOptionTemplate
   * @public
   */
  customerOptionTemplate,

  /**
   * Template for displaying the project options
   *
   * @property {*} projectOptionTemplate
   * @public
   */
  projectOptionTemplate,

  /**
   * Template for displaying the task options
   *
   * @property {*} taskOptionTemplate
   * @public
   */
  taskOptionTemplate,

  /**
   * Template for displaying the selected option
   *
   * @property {*} selectedTemplate
   * @public
   */
  selectedTemplate: SELECTED_TEMPLATE,

  /**
   * The manually selected customer
   *
   * @property {Customer} _customer
   * @private
   */
  _customer: null,

  /**
   * The manually selected project
   *
   * @property {Project} _project
   * @private
   */
  _project: null,

  /**
   * The manually selected task
   *
   * @property {Task} _task
   * @private
   */
  _task: null,

  /**
   * Whether to show history entries in the customer selection or not
   *
   * @property {Boolean} history
   * @public
   */
  history: true,

  /**
   * The selected customer
   *
   * This can be selected manually or automatically, because a task is already
   * set.
   *
   * @property {Customer} customer
   * @public
   */
  customer: computed("_customer", {
    get() {
      return this._customer;
    },
    set(key, value) {
      // It is also possible a task was selected from the history.
      if (value && value.get("constructor.modelName") === "task") {
        this.set("task", value);

        return value.get("project.customer");
      }

      this.set("_customer", value);

      /* istanbul ignore else */
      if (
        this.project &&
        (!value || value.get("id") !== this.get("project.customer.id"))
      ) {
        this.set("project", null);
      }

      later(this, () => {
        this.getWithDefault("on-set-customer", () => {})(value);
      });

      return value;
    }
  }),

  /**
   * The selected project
   *
   * This can be selected manually or automatically, because a task is already
   * set.
   *
   * @property {Project} project
   * @public
   */
  project: computed("_project", {
    get() {
      return this._project;
    },
    set(key, value) {
      this.set("_project", value);

      if (value && value.get("customer.id")) {
        resolve(value.get("customer")).then(c => {
          this.set("customer", c);
        });
      }

      /* istanbul ignore else */
      if (
        this.task &&
        (value === null || value.get("id") !== this.get("task.project.id"))
      ) {
        this.set("task", null);
      }

      later(this, () => {
        this.getWithDefault("on-set-project", () => {})(value);
      });

      return value;
    }
  }),

  /**
   * The currently selected task
   *
   * @property {Task} task
   * @public
   */
  task: computed("_task", {
    get() {
      return this._task;
    },
    set(key, value) {
      this.set("_task", value);

      if (value && value.get("project.id")) {
        resolve(value.get("project")).then(p => {
          this.set("project", p);
        });
      }

      later(this, async () => {
        this.getWithDefault("on-set-task", () => {})(value);
      });

      return value;
    }
  }),

  /**
   * All customers and recent tasks which are selectable in the dropdown
   *
   * @property {Array} customersAndRecentTasks
   * @public
   */
  customersAndRecentTasks: computed("history", "archived", async function() {
    let ids = [];

    await this.get("tracking.customers.last");

    if (this.history) {
      await this.get("tracking.recentTasks.last");

      const last = this.get("tracking.recentTasks.last.value");

      ids = last ? last.mapBy("id") : [];
    }

    const customers = this.store
      .peekAll("customer")
      .filter(customer => {
        return this.archived ? true : !customer.get("archived");
      })
      .sortBy("name");

    const tasks = this.store.peekAll("task").filter(task => {
      return (
        ids.includes(task.get("id")) &&
        (this.archived ? true : !task.get("archived"))
      );
    });

    return [...tasks.toArray(), ...customers.toArray()];
  }),

  /**
   * All projects which are selectable in the dropdown
   *
   * Those depend on the selected customer
   *
   * @property {Project[]} projects
   * @public
   */
  projects: computed("customer.id", "archived", async function() {
    if (this.get("customer.id")) {
      await this.tracking.projects.perform(this.customer.id);
    }

    return this.store
      .peekAll("project")
      .filter(project => {
        return (
          project.get("customer.id") === this.get("customer.id") &&
          (this.archived ? true : !project.get("archived"))
        );
      })
      .sortBy("name");
  }),

  /**
   * All tasks which are selectable in the dropdown
   *
   * Those depend on the selected project
   *
   * @property {Task[]} tasks
   * @public
   */
  tasks: computed("project.id", "archived", async function() {
    if (this.get("project.id")) {
      await this.tracking.tasks.perform(this.project.id);
    }

    return this.store
      .peekAll("task")
      .filter(t => {
        return (
          t.get("project.id") === this.get("project.id") &&
          (this.archived ? true : !t.get("archived"))
        );
      })
      .sortBy("name");
  }),

  actions: {
    /**
     * Clear all comboboxes
     *
     * @method clear
     * @public
     */
    clear() {
      this.setProperties({
        customer: null,
        project: null,
        task: null
      });
    },

    reset() {
      this.send("clear");

      this._setInitial();
    }
  }
});
