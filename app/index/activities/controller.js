/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from "@ember/controller";
import { action } from "@ember/object";
import { inject as service } from "@ember/service";
import { tracked } from "@glimmer/tracking";
import moment from "moment";
import { resolve } from "rsvp";

/**
 * The index activities controller
 *
 * @class IndexActivitiesController
 * @extends Ember.Controller
 * @public
 */
export default class ActivitiesIndexController extends Controller {
  @service router;
  @service store;
  @service notify;
  @service tracking;

  @tracked showUnknownWarning = false;
  @tracked showOverlappingWarning = false;

  /**
   * All activities currently in the store
   *
   * @property {Activity[]} _allActivities
   * @private
   */
  get _allActivities() {
    return this.store.peekAll("activity");
  }

  /**
   * The ID of the currently selected activity.
   * This is used to add a CSS class for styling.
   *
   * @property {String} editId
   * @public
   */
  get editId() {
    return this.router.currentRoute.params.id;
  }

  /**
   * The activities filtered by the selected day
   *
   * @property {Activity[]} activities
   * @public
   */
  get activities() {
    return this._allActivities.filter((activity) => {
      return (
        activity.get("date") &&
        activity.get("date").isSame(this.model, "day") &&
        activity.get("user.id") === this.user.id &&
        !activity.get("isNew") &&
        !activity.get("isDeleted")
      );
    });
  }

  get sortedActivities() {
    return this.activities.sort((a, b) => {
      return b.get("from").toDate() - a.get("from").toDate();
    });
  }

  /**
   * Edit the clicked activity or exit the edit mask if the activity is
   * already being edited.
   *
   * @method editActivity
   * @param {Activity} activity The activity to edit
   * @public
   */
  @action
  editActivity(activity) {
    if (!activity.get("transferred")) {
      const { id } = this.router.currentRoute.params;

      if (id === activity.get("id")) {
        this.router.transitionTo("index.activities");
      } else {
        this.router.transitionTo("index.activities.edit", activity.get("id"));
      }
    }
  }

  /**
   * Start an activity
   *
   * @method startActivity
   * @param {Activity} activity The activity to start
   * @public
   */
  @action
  async startActivity(activity, event) {
    event.stopPropagation();

    if (!activity.get("date").isSame(moment(), "day")) {
      activity = this.store.createRecord("activity", {
        ...activity.getProperties("task", "comment"),
      });
    }

    await this.tracking.stopActivity.perform();

    this.tracking.activity = activity;

    await this.tracking.startActivity.perform();

    this.router.transitionTo("index.activities", {
      queryParams: { day: moment().format("YYYY-MM-DD") },
    });
  }

  /**
   * Stop an activity
   *
   * @method stopActivity
   * @param {Activity} activity The activity to stop
   * @public
   */
  @action
  stopActivity(activity, event) {
    event.stopPropagation();

    this.tracking.activity = activity;

    this.tracking.stopActivity.perform();
  }

  /**
   * Checks if warning concerning unknown tasks should be displayed
   *
   * @method generateReportsCheck
   * @public
   */
  @action
  generateReportsCheck() {
    const hasUnknown = !!this.activities.findBy("task.id", undefined);
    const hasOverlapping = !!this.sortedActivities.find((a) => {
      return a.get("active") && !a.get("from").isSame(moment(), "day");
    });

    this.showUnknownWarning = hasUnknown;
    this.showOverlappingWarning = hasOverlapping;

    if (!hasUnknown && !hasOverlapping) {
      this.send("generateReports");
    }
  }

  /**
   * Generates reports from the current list of activities
   *
   * @method generateReports
   * @public
   */
  @action
  async generateReports() {
    this.showUnknownWarning = false;
    this.showOverlappingWarning = false;
    this.tracking.generatingReports = true;

    try {
      await this.activities
        .filter(
          (a) =>
            a.get("task.id") &&
            !(a.get("active") && !a.get("from").isSame(moment(), "day")) &&
            !a.get("transferred")
        )
        .reduce(async (reducer, activity) => {
          const duration = activity.get("duration");

          if (activity.get("active")) {
            duration.add(moment().diff(activity.get("from")));

            await this.tracking.stopActivity.perform();
            this.tracking.activity = activity;
            await this.tracking.startActivity.perform();
          }

          const data = {
            duration,
            date: activity.get("date"),
            task: activity.get("task"),
            review: activity.get("review"),
            notBillable: activity.get("notBillable"),
            comment: activity.get("comment").trim(),
          };

          let report = this.store.peekAll("report").find((r) => {
            return (
              (!r.get("user.id") ||
                r.get("user.id") === activity.get("user.id")) &&
              r.get("date").isSame(data.date, "day") &&
              r.get("comment").trim() === data.comment &&
              r.get("task.id") === data.task.get("id") &&
              r.get("review") === data.review &&
              r.get("notBillable") === data.notBillable &&
              !r.get("verfiedBy") &&
              !r.get("isDeleted")
            );
          });

          if (report) {
            data.duration.add(report.get("duration"));
            report.set("duration", data.duration);
          } else {
            report = this.store.createRecord("report", data);
          }

          activity.set("transferred", true);

          return reducer
            .then(activity.save.bind(activity))
            .then(report.save.bind(report));
        }, resolve());

      this.router.transitionTo("index.reports");
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while generating reports");
    } finally {
      this.tracking.generatingReports = false;
    }
  }
}
