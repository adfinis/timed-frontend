import { tracked } from "@glimmer/tracking";
/**
 * @module timed
 * @submodule timed-services
 * @public
 */

import { observes } from "@ember-decorators/object";
import { getOwner } from "@ember/application";
import { computed, get } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import Service, { inject as service } from "@ember/service";
import { camelize, capitalize } from "@ember/string";
import Ember from "ember";
import classic from "ember-classic-decorator";
import { task, timeout } from "ember-concurrency";
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
@classic
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
   * Init hook, get the current activity
   *
   * @method init
   * @public
   */
  async init() {
    super.init();

    const actives = await this.store.query("activity", {
      include: "task,task.project,task.project.customer",
      active: true,
    });

    this.set("activity", actives.firstObject ?? null);

    this._computeTitle.perform();
  }

  /**
   * The application
   *
   * @property {Ember.Application} application
   * @public
   */
  @computed
  get application() {
    return getOwner(this).lookup("application:main");
  }

  /**
   * The default application title
   *
   * @property {String} title
   * @public
   */
  @computed("application.name")
  get title() {
    return capitalize(camelize(this.application.name || "Timed"));
  }

  /**
   * Trigger a reload of the title because the activity has changed
   *
   * @method _triggerTitle
   * @private
   */
  // eslint-disable-next-line ember/no-observers
  @observes("activity.active")
  _triggerTitle() {
    if (this.activity.active) {
      this._computeTitle.perform();
    } else {
      this.setTitle(this.title);
    }
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
  @task(function* () {
    while (this.activity.active) {
      const duration = moment.duration(moment().diff(this.activity.from));

      let task = "Unknown Task";

      if (get(this, "activity.task.content")) {
        const c = get(this, "activity.task.project.customer.name");
        const p = get(this, "activity.task.project.name");
        const t = get(this, "activity.task.name");

        task = `${c} > ${p} > ${t}`;
      }

      this.setTitle(`${formatDuration(duration)} (${task})`);

      /* istanbul ignore else */
      if (Ember.testing) {
        return;
      }

      /* istanbul ignore next */
      yield timeout(1000);
    }
  })
  _computeTitle;

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

    this.set("_activity", newActivity);
  }

  /**
   * Start the activity
   *
   * @method startActivity
   * @public
   */
  @(task(function* () {
    try {
      const activity = yield this.activity.start();
      this.set("activity", activity);

      this.notify.success("Activity was started");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while starting the activity");
    }
  }).drop())
  startActivity;

  /**
   * Stop the activity
   *
   * @method stopActivity
   * @public
   */
  @(task(function* () {
    try {
      if (!this.activity?.isNew) {
        yield this.activity.stop();

        this.notify.success("Activity was stopped");
      }

      this.set("activity", null);
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while stopping the activity");
    }
  }).drop())
  stopActivity;

  /**
   * The 10 last used tasks
   *
   * @property {EmberConcurrency.Task} recentTasks
   * @public
   */
  @(task(function* () {
    return yield this.store.query("task", {
      my_most_frequent: 10, // eslint-disable-line camelcase
      include: "project,project.customer",
    });
  }).drop())
  recentTasks;

  /**
   * All users
   *
   * @property {EmberConcurrency.Task} users
   * @public
   */
  @task(function* () {
    return yield this.store.query("user", {});
  })
  users;

  /**
   * All customers
   *
   * @property {EmberConcurrency.Task} customers
   * @public
   */
  @(task(function* () {
    return yield this.store.query("customer", {});
  }).drop())
  customers;

  /**
   * Projects filtered by customer
   *
   * @property {EmberConcurrency.Task} projects
   * @param {Number} customer The customer id to filter by
   * @public
   */
  @task(function* (customer) {
    /* istanbul ignore next */
    if (!customer) {
      // We can't test this because the UI prevents it
      throw new Error("No customer selected");
    }

    return yield this.store.query("project", { customer });
  })
  projects;

  /**
   * Tasks filtered by project
   *
   * @property {EmberConcurrency.Task} tasks
   * @param {Number} project The project id to filter by
   * @public
   */
  @task(function* (project) {
    /* istanbul ignore next */
    if (!project) {
      // We can't test this because the UI prevents it
      throw new Error("No project selected");
    }

    return yield this.store.query("task", { project });
  })
  tasks;
}
