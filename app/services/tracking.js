/**
 * @module timed
 * @submodule timed-services
 * @public
 */
import { getOwner } from "@ember/application";
import { computed, observer } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import Service, { inject as service } from "@ember/service";
import { camelize, capitalize } from "@ember/string";
import Ember from "ember";
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
export default Service.extend({
  /**
   * The store service
   *
   * @property {Ember.Store} store
   * @public
   */
  store: service("store"),

  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service("notify"),

  /**
   * Init hook, get the current activity
   *
   * @method init
   * @public
   */
  async init() {
    this._super();

    const actives = await this.get("store").query("activity", {
      include: "task,task.project,task.project.customer",
      active: true
    });

    this.set("activity", actives.getWithDefault("firstObject", null));

    this.get("_computeTitle").perform();
  },

  /**
   * The application
   *
   * @property {Ember.Application} application
   * @public
   */
  application: computed(function() {
    return getOwner(this).lookup("application:main");
  }),

  /**
   * The default application title
   *
   * @property {String} title
   * @public
   */
  title: computed("application.name", function() {
    return capitalize(camelize(this.get("application.name") || "Timed"));
  }),

  /**
   * Trigger a reload of the title because the activity has changed
   *
   * @method _triggerTitle
   * @private
   */
  // eslint-disable-next-line ember/no-observers
  _triggerTitle: observer("activity.active", function() {
    if (this.get("activity.active")) {
      this.get("_computeTitle").perform();
    } else {
      this.setTitle(this.get("title"));
    }
  }),

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
      t => {
        document.title = t;
      },
      title
    );
  },

  /**
   * Set the title of the application to show the current tracking time and
   * task
   *
   * @method _computeTitle
   * @private
   */
  _computeTitle: task(function*() {
    while (this.get("activity.active")) {
      const duration = moment.duration(
        moment().diff(this.get("activity.from"))
      );

      let task = "Unknown Task";

      if (this.get("activity.task.content")) {
        const c = this.get("activity.task.project.customer.name");
        const p = this.get("activity.task.project.name");
        const t = this.get("activity.task.name");

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
  }),

  /**
   * The current activity
   *
   * @property {Activity} currentActivity
   * @public
   */
  _activity: null,

  /**
   * The currenty activity or create a new one if none is set
   *
   * @property {Activity} activity
   * @public
   */
  activity: computed("_activity", {
    get() {
      return this.get("_activity");
    },
    set(key, value) {
      const newActivity = value || this.get("store").createRecord("activity");

      this.set("_activity", newActivity);

      return newActivity;
    }
  }),

  /**
   * Start the activity
   *
   * @method startActivity
   * @public
   */
  startActivity: task(function*() {
    try {
      const activity = yield this.get("activity").start();
      this.set("activity", activity);

      this.get("notify").success("Activity was started");
    } catch (e) {
      /* istanbul ignore next */
      this.get("notify").error("Error while starting the activity");
    }
  }).drop(),

  /**
   * Stop the activity
   *
   * @method stopActivity
   * @public
   */
  stopActivity: task(function*() {
    try {
      if (!this.get("activity.isNew")) {
        yield this.get("activity").stop();

        this.get("notify").success("Activity was stopped");
      }

      this.set("activity", null);
    } catch (e) {
      /* istanbul ignore next */
      this.get("notify").error("Error while stopping the activity");
    }
  }).drop(),

  /**
   * The 10 last used tasks
   *
   * @property {EmberConcurrency.Task} recentTasks
   * @public
   */
  recentTasks: task(function*() {
    return yield this.get("store").query("task", {
      my_most_frequent: 10, // eslint-disable-line camelcase
      include: "project,project.customer"
    });
  }).drop(),

  /**
   * All users
   *
   * @property {EmberConcurrency.Task} users
   * @public
   */
  users: task(function*() {
    return yield this.get("store").query("user", {});
  }),

  /**
   * All customers
   *
   * @property {EmberConcurrency.Task} customers
   * @public
   */
  customers: task(function*() {
    return yield this.get("store").query("customer", {});
  }).drop(),

  /**
   * Projects filtered by customer
   *
   * @property {EmberConcurrency.Task} projects
   * @param {Number} customer The customer id to filter by
   * @public
   */
  projects: task(function*(customer) {
    /* istanbul ignore next */
    if (!customer) {
      // We can't test this because the UI prevents it
      throw new Error("No customer selected");
    }

    return yield this.get("store").query("project", { customer });
  }),

  /**
   * Tasks filtered by project
   *
   * @property {EmberConcurrency.Task} tasks
   * @param {Number} project The project id to filter by
   * @public
   */
  tasks: task(function*(project) {
    /* istanbul ignore next */
    if (!project) {
      // We can't test this because the UI prevents it
      throw new Error("No project selected");
    }

    return yield this.get("store").query("task", { project });
  })
});
