/**
 * @module timed
 * @submodule timed-models
 * @public
 */
import { computed } from "@ember/object";
import { inject as service } from "@ember/service";
import attr from "ember-data/attr";
import Model from "ember-data/model";
import { belongsTo } from "ember-data/relationships";
import moment from "moment";
import { all } from "rsvp";

/**
 * The activity model
 *
 * @class Activity
 * @extends DS.Model
 * @public
 */
export default Model.extend({
  /**
   * The start time
   *
   * @property {moment} fromTime
   * @public
   */
  fromTime: attr("django-time"),

  /**
   * The end time
   *
   * @property {moment} toTime
   * @public
   */
  toTime: attr("django-time"),

  /**
   * The comment
   *
   * @property comment
   * @type {String}
   * @public
   */
  comment: attr("string", { defaultValue: "" }),

  /**
   * The date
   *
   * @property {moment} date
   * @public
   */
  date: attr("django-date"),

  transferred: attr("boolean", { defaultValue: false }),

  review: attr("boolean", { defaultValue: false }),

  notBillable: attr("boolean", { defaultValue: false }),

  /**
   * The task
   *
   * @property task
   * @type {Task}
   * @public
   */
  task: belongsTo("task"),

  /**
   * The user
   *
   * @property user
   * @type {User}
   * @public
   */
  user: belongsTo("user"),

  /**
   * The notify service
   *
   * @property {EmberNotify.NotifyService} notify
   * @public
   */
  notify: service("notify"),

  /**
   * Whether the activity is active
   *
   * @property active
   * @type {Boolean}
   * @public
   */
  active: computed("toTime", function() {
    return !this.toTime && !!this.id;
  }),

  duration: computed("fromTime", "toTime", function() {
    return moment.duration((this.to ? this.to : moment()).diff(this.from));
  }),

  from: computed("date", "fromTime", {
    get() {
      const time = this.fromTime;
      return (
        time &&
        moment(this.date).set({
          h: time.hours(),
          m: time.minutes(),
          s: time.seconds(),
          ms: time.milliseconds()
        })
      );
    },
    set(key, val) {
      this.set("fromTime", val);
      return val;
    }
  }),

  to: computed("date", "toTime", {
    get() {
      const time = this.toTime;
      return (
        time &&
        moment(this.date).set({
          h: time.hours(),
          m: time.minutes(),
          s: time.seconds(),
          ms: time.milliseconds()
        })
      );
    },
    set(key, val) {
      this.set("toTime", val);
      return val;
    }
  }),

  /**
   * Start the activity
   *
   * @method start
   * @public
   */
  async start() {
    const activity = this.store.createRecord("activity", {
      date: moment(),
      fromTime: moment(),
      task: this.task,
      comment: this.comment,
      review: this.review,
      notBillable: this.notBillable
    });

    await activity.save();

    return activity;
  },

  /**
   * Stop the activity
   *
   * If the activity was started yesterday, we create a new identical
   * activity today so we handle working over midnight
   *
   * If the activity was started even before, we ignore it since it must be
   * a mistake, so we end the activity a second before midnight that day
   *
   * @method stop
   * @public
   */
  async stop() {
    /* istanbul ignore next */
    if (!this.active) {
      return;
    }

    const activities = [this];

    if (moment().diff(this.date, "days") === 1) {
      activities.push(
        this.store.createRecord("activity", {
          task: this.task,
          comment: this.comment,
          user: this.user,
          date: moment(this.date).add(1, "days"),
          review: this.review,
          notBillable: this.notBillable,
          fromTime: moment({ h: 0, m: 0, s: 0 })
        })
      );
    }

    await all(
      activities.map(async activity => {
        if (activity.get("isNew")) {
          await activity.save();
        }

        activity.set(
          "toTime",
          moment(
            Math.min(
              moment(activity.get("date")).set({
                h: 23,
                m: 59,
                s: 59
              }),
              moment()
            )
          )
        );

        await activity.save();
      })
    );

    if (moment().diff(this.date, "days") > 1) {
      this.notify.info(
        "The activity overlapped multiple days, which is not possible. The activity was stopped at midnight of the day it was started.",
        { closeAfter: 5000 }
      );
    }
  }
});
