import { inject as service } from "@ember/service";
import Model, { attr, belongsTo } from "@ember-data/model";
import moment from "moment";
import { all } from "rsvp";

export default class Activity extends Model {
  @attr("django-time") fromTime;
  @attr("django-time") toTime;
  @attr("string", { defaultValue: "" }) comment;
  @attr("django-date") date;
  @attr("boolean", { defaultValue: false }) transferred;
  @attr("boolean", { defaultValue: false }) review;
  @attr("boolean", { defaultValue: false }) notBillable;
  @belongsTo("task") task;
  @belongsTo("user") user;

  @service notify;

  get active() {
    return !this.toTime && !!this.id;
  }

  get duration() {
    return moment.duration((this.to ?? moment()).diff(this.from));
  }

  get from() {
    const time = this.fromTime;
    return (
      time &&
      moment(this.date).set({
        h: time.hours(),
        m: time.minutes(),
        s: time.seconds(),
        ms: time.milliseconds(),
      })
    );
  }

  set from(value) {
    this.fromTime = value;
  }

  get to() {
    const time = this.toTime;
    return (
      time &&
      moment(this.date).set({
        h: time.hours(),
        m: time.minutes(),
        s: time.seconds(),
        ms: time.milliseconds(),
      })
    );
  }

  set to(value) {
    this.toTime = value;
  }

  async start() {
    const activity = this.store.createRecord("activity", {
      date: moment(),
      fromTime: moment(),
      task: this.task,
      comment: this.comment,
      review: this.review,
      notBillable: this.notBillable,
    });

    await activity.save();

    return activity;
  }

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
          fromTime: moment({ h: 0, m: 0, s: 0 }),
        })
      );
    }

    await all(
      activities.map(async (activity) => {
        if (activity.get("isNew")) {
          await activity.save();
        }

        activity.toTime = moment(
          Math.min(
            moment(activity.get("date")).set({
              h: 23,
              m: 59,
              s: 59,
            }),
            moment()
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
}
