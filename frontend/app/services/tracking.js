import { getOwner } from "@ember/application";
import { scheduleOnce } from "@ember/runloop";
import Service, { inject as service } from "@ember/service";
import { camelize, capitalize } from "@ember/string";
import { isTesting, macroCondition } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import { dropTask, task, timeout } from "ember-concurrency";
import { trackedTask } from "ember-resources/util/ember-concurrency";
import moment from "moment";
import formatDuration from "timed/utils/format-duration";

/**
 * Tracking service
 *
 * This contains some methods, the application needs on multiple routes
 *
 * @class TrackingService
 * @extends Ember.Service
 * @public
 */
export default class TrackingService extends Service {
  /**
   * The store service
   *
   * @property {Ember.Store} store
   * @public
   */
  @service store;

  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  @service notify;

  /**
   * Flag indicating if the tracking reports is currently generated.
   * This is used to prevent doubled time accumulation in task sum displays.
   */
  @tracked generatingReports = false;
  @tracked _date;

  // collected request arguments for fetching tasks
  projectQueue = new Set();
  // collected request arguments for fetching projects
  customerQueue = new Set();

  constructor(...args) {
    super(...args);

    this.fetchActiveActivity.perform();
  }

  get date() {
    return this._date ?? moment();
  }

  set date(date) {
    this._date = date;
  }

  /**
   * Init hook, get the current activity
   *
   * @method init
   * @public
   */
  @task
  *fetchActiveActivity() {
    yield Promise.resolve();

    const actives = yield this.store.query("activity", {
      include: "task,task.project,task.project.customer",
      active: true,
    });

    this.activity = actives.firstObject ?? null;

    this._computeTitle.perform();
  }

  /**
   * The application
   *
   * @property {Ember.Application} application
   * @public
   */
  get application() {
    return getOwner(this).lookup("application:main");
  }

  /**
   * The default application title
   *
   * @property {String} title
   * @public
   */
  get title() {
    return capitalize(camelize(this.application.name || "Timed"));
  }

  /**
   * Set the doctitle
   *
   * @method setTitle
   * @param {String} title The title to set
   * @public
   */
  setTitle(title) {
    scheduleOnce(
      "afterRender",
      this,
      this.scheduleDocumentTitle.bind(this, title)
    );
  }

  scheduleDocumentTitle(t) {
    document.title = t;
  }

  /**
   * Set the title of the application to show the current tracking time and
   * task
   *
   * @method _computeTitle
   * @private
   */
  @task
  *_computeTitle() {
    while (this.activity.active) {
      const duration = moment.duration(moment().diff(this.activity.from));

      let task = "Unknown Task";

      if (this.activity.task.content) {
        const c = this.activity.task.get("project.customer.name");
        const p = this.activity.get("task.project.name");
        const t = this.activity.get("task.name");

        task = `${c} > ${p} > ${t}`;
      }

      this.setTitle(`${formatDuration(duration)} (${task})`);

      if (macroCondition(isTesting())) {
        return;
      }

      yield timeout(1000);
    }
  }

  /**
   * The current activity
   *
   * @property {Activity} currentActivity
   * @public
   */
  @tracked _activity = null;

  /**
   * The currenty activity or create a new one if none is set
   *
   * @property {Activity} activity
   * @public
   */
  get activity() {
    return this._activity;
  }

  set activity(value) {
    const newActivity = value || this.store.createRecord("activity");

    this._activity = newActivity;
  }

  /**
   * Start the activity
   *
   * @method startActivity
   * @public
   */
  @dropTask
  *startActivity() {
    try {
      const activity = yield this.activity.start();
      this.activity = activity;

      this.notify.success("Activity was started");
    } catch (e) {
      this.notify.error("Error while starting the activity");
    } finally {
      this._computeTitle.perform();
    }
  }

  /**
   * Stop the activity
   *
   * @method stopActivity
   * @public
   */
  @dropTask
  *stopActivity() {
    try {
      if (!this.activity?.isNew) {
        yield this.activity.stop();

        this.notify.success("Activity was stopped");
      }

      this.activity = null;
    } catch (e) {
      this.notify.error("Error while stopping the activity");
    } finally {
      this.setTitle(this.title);
    }
  }

  get hasActiveActivity() {
    return this.activity?.active;
  }

  get activeCustomer() {
    return (
      this.hasActiveActivity && this.activity?.task?.get("project.customer")
    );
  }

  get activeProject() {
    return this.hasActiveActivity && this.activity?.task?.get("project");
  }

  get activeTask() {
    return this.hasActiveActivity && this.activity?.get("task");
  }

  /**
   * The 10 last used tasks
   *
   * @property {EmberConcurrency.Task} recentTasks
   * @public
   */
  @dropTask
  *fetchRecentTasks() {
    yield Promise.resolve();
    return yield this.store.query("task", {
      my_most_frequent: 10, // eslint-disable-line camelcase
      include: "project,project.customer",
    });
  }

  recentTasksData = trackedTask(this, this.fetchRecentTasks, () => []);

  get recentTasks() {
    return this.recentTasksData.value ?? [];
  }

  /**
   * All users
   *
   * @property {EmberConcurrency.Task} users
   * @public
   */
  @dropTask
  *users() {
    return yield this.store.query("user", {});
  }

  /**
   * All customers
   *
   * @property {EmberConcurrency.Task} customers
   * @public
   */
  @dropTask
  *fetchCustomers() {
    yield Promise.resolve();
    return yield this.store.query("customer", {});
  }

  customersData = trackedTask(this, this.fetchCustomers, () => {});

  get customers() {
    return this.customersData.value ?? [];
  }

  /**
   * Projects filtered by customer
   *
   * @property {EmberConcurrency.Task} projects
   * @param {Number} customer The customer id to filter by
   * @public
   */
  @task
  *projects(customer) {
    if (!customer) {
      // We can't test this because the UI prevents it
      throw new Error("No customer selected");
    }

    if (this.customerQueue.has(customer)) {
      /* istanbul ignore next */
      return;
    }

    this.customerQueue.add(customer);

    if (this.customerQueue.size > 1) {
      return;
    }

    // Give it 100ms to "collect" similar requests and
    // increases the efficiency even more.
    yield timeout(100);

    yield this.store.query("project", {
      customer: [...this.customerQueue].join(","),
    });

    this.customerQueue.clear();

    return;
  }

  /**
   * Tasks filtered by project
   *
   * @property {EmberConcurrency.Task} tasks
   * @param {Number} project The project id to filter by
   * @public
   */
  @task
  *tasks(project) {
    if (!project) {
      // We can't test this because the UI prevents it
      throw new Error("No project selected");
    }

    if (this.projectQueue.has(project)) {
      /* istanbul ignore next */
      return;
    }

    this.projectQueue.add(project);

    if (this.projectQueue.size > 1) {
      return;
    }

    // Give it 100ms to "collect" similar requests and
    // increases the efficiency even more.
    yield timeout(100);

    yield this.store.query("task", {
      project: [...this.projectQueue].join(","),
    });

    this.projectQueue.clear();

    return;
  }
}
