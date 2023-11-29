import Controller from "@ember/controller";
import { action, get } from "@ember/object";
import { scheduleOnce } from "@ember/runloop";
import { inject as service } from "@ember/service";
import { camelize } from "@ember/string";
import { isTesting, macroCondition } from "@embroider/macros";
import { tracked } from "@glimmer/tracking";
import { dropTask, timeout } from "ember-concurrency";
import { trackedFunction } from "ember-resources/util/function";
import moment from "moment";
import AbsenceValidations from "timed/validations/absence";
import MultipleAbsenceValidations from "timed/validations/multiple-absence";
import { tracked as trackedWrapper } from "tracked-built-ins";
import { cached } from "tracked-toolbox";

/**
 * The index controller
 *
 * @class IndexController
 * @extends Controller
 * @public
 */
export default class IndexController extends Controller {
  queryParams = ["day"];

  @tracked showAddModal = false;
  @tracked showEditModal = false;
  @tracked day = moment().format("YYYY-MM-DD");
  @tracked _activeActivityDuration = moment.duration();

  /* istanbul ignore next */
  @trackedWrapper center = moment();
  /* istanbul ignore next */
  @trackedWrapper disabledDates = [];

  @service store;
  @service notify;
  @service tracking;

  AbsenceValidations = AbsenceValidations;
  MultipleAbsenceValidations = MultipleAbsenceValidations;

  constructor(...args) {
    super(...args);
    // this kicks off the activity sum loop
    scheduleOnce("afterRender", this, this._activitySumTask.perform);
  }

  get _allActivities() {
    return this.store.peekAll("activity");
  }

  get _activities() {
    return this._allActivities.filter((a) => {
      return (
        a.get("date") &&
        a.get("date").isSame(this.date, "day") &&
        a.get("user.id") === this.user?.id &&
        !a.get("isDeleted")
      );
    });
  }

  get activitySum() {
    // Prevents wrong activity sum, while saving reports.
    // It would otherwise double the currently not transferred durations
    // while store is updating.
    if (this.tracking.generatingReports) {
      return this._lastActivitySum;
    }

    if (!this.tracking.hasActiveActivity) {
      return this.storedActivitiesDuration;
    }

    return moment
      .duration()
      .add(this.storedActivitiesDuration)
      .add(this._activeActivityDuration);
  }

  /**
   * The duration sum of all stored activities of the selected day
   *
   * @property {moment.duration} activitySum
   * @public
   */
  get storedActivitiesDuration() {
    return this._activities.rejectBy("active").reduce((total, current) => {
      return total.add(current.get("duration"));
    }, moment.duration());
  }

  /**
   * Compute the current activity sum
   *
   * @method _activitySum
   * @private
   */
  _activitySum() {
    // Do not trigger updates when there is no active activity, but let it run once to
    // null the duration.
    if (
      !this.tracking.hasActiveActivity &&
      this._activeActivityDuration.get("seconds") === 0
    ) {
      return;
    }
    const duration = this._activities
      .filterBy("active")
      .reduce((total, current) => {
        return total.add(moment().diff(current.get("from")));
      }, moment.duration());

    this._activeActivityDuration = duration;

    // Save latest activitySum for display while reports are generated.
    // See activitySum getter.
    scheduleOnce("afterRender", this, "_storeLastActivitySum");

    return duration;
  }

  _storeLastActivitySum() {
    this._lastActivitySum = this.activitySum;
  }

  /**
   * Run _activitySum every second.
   *
   * @method _activitySumTask
   * @private
   */
  @dropTask
  *_activitySumTask() {
    while (true) {
      this._activitySum();

      if (macroCondition(isTesting())) {
        break;
      }

      /* istanbul ignore next */
      yield timeout(1000);
    }
  }

  /**
   * All attendances
   *
   * @property {Attendance[]} _allAttendances
   * @private
   */
  get _allAttendances() {
    return this.store.peekAll("attendance");
  }

  /**
   * All attendances filtered by the selected day and the current user
   *
   * @property {Attendance[]} _attendances
   * @private
   */
  get _attendances() {
    return this._allAttendances.filter((attendance) => {
      return (
        attendance.get("date") &&
        attendance.get("date").isSame(this.date, "day") &&
        attendance.get("user.id") === this.user?.id &&
        !attendance.get("isDeleted")
      );
    });
  }

  /**
   * The duration sum of all attendances of the selected day
   *
   * @property {moment.duration} attendanceSum
   * @public
   */
  get attendanceSum() {
    return this._attendances.reduce((total, current) => {
      return total.add(current.duration);
    }, moment.duration());
  }

  /**
   * All reports
   *
   * @property {Report[]} allReports
   * @private
   */
  get allReports() {
    return this.store.peekAll("report");
  }

  /**
   * All absences
   *
   * @property {Absence[]} _allAbsences
   * @private
   */
  get allAbsences() {
    return this.store.peekAll("absence");
  }

  /**
   * All reports filtered by the selected day and the current user
   *
   * @property {Report[]} _reports
   * @private
   */
  get _reports() {
    return this.allReports.filter((report) => {
      return (
        report.date.isSame(this.date, "day") &&
        report.get("user.id") === this.user?.id &&
        !report.isNew &&
        !report.isDeleted
      );
    });
  }

  /**
   * All absences filtered by the selected day and the current user
   *
   * @property {Absence[]} _absences
   * @private
   */
  get _absences() {
    return this.allAbsences.filter((absence) => {
      return (
        absence.date.isSame(this.date, "day") &&
        absence.get("user.id") === this.user?.id &&
        !absence.isNew &&
        !absence.isDeleted
      );
    });
  }

  /**
   * The duration sum of all reports of the selected day
   *
   * @property {moment.duration} reportSum
   * @public
   */
  get reportSum() {
    const reportDurations = this._reports.mapBy("duration");
    const absenceDurations = this._absences.mapBy("duration");

    return [...reportDurations, ...absenceDurations].reduce(
      (val, dur) => val.add(dur),
      moment.duration()
    );
  }

  /**
   * The absence of the current day if available
   *
   * This should always be the first of all absences of the day because in
   * theory, we can only have one absence per day.
   *
   * @property {Absence} absence
   * @public
   */
  get absence() {
    return this._absences?.firstObject ?? null;
  }

  /**
   * All absence types
   *
   * @property {AbsenceType[]} absenceTypes
   * @public
   */
  get absenceTypes() {
    return this.store.peekAll("absence-type");
  }

  /**
   * The currently selected day as a moment object
   *
   * @property {moment} date
   * @public
   */
  @cached
  get date() {
    return moment(this.day, "YYYY-MM-DD");
  }

  set date(value) {
    this.day = value.format("YYYY-MM-DD");
    // share the newly selected date
    this.tracking.date = value;
  }

  /**
   * The expected worktime of the user
   *
   * @property {moment.duration} expectedWorktime
   * @public
   */
  get expectedWorktime() {
    return this.user.activeEmployment.worktimePerDay;
  }

  /**
   * The workdays for the location related to the users active employment
   *
   * @property {Number[]} workdays
   * @public
   */
  get workdays() {
    // eslint-disable-next-line ember/no-get
    return get(this, "user.activeEmployment.location.workdays");
  }

  /**
   * The task to compute the data for the weekly overview
   *
   * @property {EmberConcurrency.Task} _weeklyOverviewData
   * @private
   */
  weeklyOverviewData = trackedFunction(this, {}, async () => {
    const allReports = this.allReports.filter(
      (report) =>
        report.get("user.id") === this.user.get("id") &&
        !report.get("isDeleted") &&
        !report.get("isNew")
    );

    const allAbsences = this.allAbsences.filter(
      (absence) =>
        absence.get("user.id") === this.user.get("id") &&
        !absence.get("isDeleted") &&
        !absence.get("isNew")
    );

    const allHolidays = this.store.peekAll("public-holiday");

    // Build an object containing reports, absences and holidays
    // {
    //  '2017-03-21': {
    //    reports: [report1, report2, ...],
    //    absences: [absence1, ...],
    //    publicHolidays: [publicHoliday1, ...]
    //  }
    //  ...
    // }
    const container = [
      ...allReports.toArray(),
      ...allAbsences.toArray(),
      ...allHolidays.toArray(),
    ].reduce((obj, model) => {
      const d = model.get("date").format("YYYY-MM-DD");

      obj[d] = obj[d] || { reports: [], absences: [], publicHolidays: [] };

      obj[d][`${camelize(model.constructor.modelName)}s`].push(model);

      return obj;
    }, {});

    return Array.from({ length: 31 }, (value, index) =>
      moment(this.date).add(index - 20, "days")
    ).map((d) => {
      const {
        reports = [],
        absences = [],
        publicHolidays = [],
      } = container[d.format("YYYY-MM-DD")] || {};

      let prefix = "";

      if (publicHolidays.length) {
        prefix = publicHolidays.get("firstObject.name");
      } else if (absences.length) {
        prefix = absences.get("firstObject.absenceType.name");
      }

      return {
        day: d,
        active: d.isSame(this.date, "day"),
        absence: !!absences.length,
        workday: this.workdays.includes(d.isoWeekday()),
        worktime: [
          ...reports.mapBy("duration"),
          ...absences.mapBy("duration"),
        ].reduce((val, dur) => val.add(dur), moment.duration()),
        holiday: !!publicHolidays.length,
        prefix,
      };
    });
  });

  /**
   * Set a new center for the calendar and load all disabled dates
   *
   * @method setCenter
   * @param {Object} value The value to set center to
   * @param {moment} value.moment The moment version of the value
   * @param {Date} value.date The date version of the value
   * @public
   */
  @dropTask
  *setCenter({ moment: center }) {
    yield Promise.resolve();

    const from = moment(center)
      .startOf("month")
      .startOf("week")
      .startOf("day")
      .add(1, "days");
    const to = moment(center)
      .endOf("month")
      .endOf("week")
      .endOf("day")
      .add(1, "days");

    const params = {
      from_date: from.format("YYYY-MM-DD"),
      to_date: to.format("YYYY-MM-DD"),
      user: this.user?.id,
    };

    const absences = yield this.store.query("absence", params);

    const publicHolidays = yield this.store.query("public-holiday", {
      ...params,
      // eslint-disable-next-line ember/no-get
      location: get(this, "user.activeEmployment.location.id"),
    });

    const disabled = [
      ...absences.mapBy("date"),
      ...publicHolidays.mapBy("date"),
    ];
    const date = moment(from);
    const workdays = this.workdays;

    while (date < to) {
      if (!workdays.includes(date.isoWeekday())) {
        disabled.push(moment(date));
      }
      date.add(1, "days");
    }

    this.disabledDates = disabled;
    this.center = center;
  }

  /**
   * The disabled dates without the current date
   *
   * @property {moment[]} disabledDatesForEdit
   * @public
   */
  get disabledDatesForEdit() {
    return this.disabledDates.filter(
      (date) => !date.isSame(this.absence.date, "day")
    );
  }

  /**
   * Rollback the changes made in the absence dialogs
   *
   * @method rollback
   * @param {EmberChangeset.Changeset} changeset The changeset to rollback
   * @public
   */
  @action
  rollback(changeset) {
    this.setCenter.perform({ moment: this.date });

    changeset.rollback();
  }

  @action
  updateSelection(changeset, key, value, ...args) {
    changeset.set(key, value.moment);
    // prevent pointer event from bubbling
    args.lastObject?.preventDefault();
  }

  /**
   * Edit an existing absence
   *
   * @method editAbsence
   * @param {EmberChangeset.Changeset} changeset The changeset containing the absence data
   * @public
   */
  @action
  async saveAbsence(changeset) {
    try {
      this.send("loading");

      await changeset.save();

      this.showEditModal = false;
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while saving the absence");
    } finally {
      this.send("finished");
    }
  }

  /**
   * Delete an absence
   *
   * @method deleteAbsence
   * @param {Absence} absence The absence to delete
   * @public
   */
  @action
  async deleteAbsence(absence) {
    try {
      this.send("loading");

      await absence.destroyRecord();

      this.showEditModal = false;
    } catch (e) {
      /* istanbul ignore next */
      this.notify.error("Error while deleting the absence");
    } finally {
      this.send("finished");
    }
  }

  /**
   * Add one or more absences
   *
   * @method addAbsence
   * @param {EmberChangeset.Changeset} changeset The changeset containing the absence data
   * @public
   */
  @action
  async addAbsence(changeset) {
    try {
      const absenceType = changeset.get("absenceType");
      const comment = changeset.get("comment");
      const dates = changeset.get("dates");
      const results = [];
      for (const date of dates) {
        const absence = this.store.createRecord("absence", {
          absenceType,
          date,
          comment,
        });

        results.push(absence.save());
      }

      await Promise.all(results);

      changeset.rollback();

      this.showAddModal = false;
    } catch (e) {
      this.notify.error("Error while adding the absence");
    } finally {
      this.send("finished");
    }
  }
}
