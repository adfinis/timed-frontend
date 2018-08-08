/**
 * @module timed
 * @submodule timed-controllers
 * @public
 */
import Controller from '@ember/controller'
import moment from 'moment'
import { computed } from '@ember/object'
import { oneWay } from '@ember/object/computed'
import Ember from 'ember'
import { inject as service } from '@ember/service'
import { task, timeout } from 'ember-concurrency'
import AbsenceValidations from 'timed/validations/absence'
import MultipleAbsenceValidations from 'timed/validations/multiple-absence'
import { scheduleOnce } from '@ember/runloop'
import { camelize } from '@ember/string'

const { testing } = Ember

/**
 * The index controller
 *
 * @class IndexController
 * @extends Ember.Controller
 * @public
 */
export default Controller.extend({
  init() {
    this._super(...arguments)

    this.set('_activeActivityDuration', moment.duration())
    this.set('disabledDates', [])
  },

  /**
   * Validations for the edit absence form
   *
   * @property {Object} AbsenceValidations
   * @public
   */
  AbsenceValidations,

  /**
   * Validations for the muliple absence form
   *
   * @property {Object} MultipleAbsenceValidations
   * @public
   */
  MultipleAbsenceValidations,

  /**
   * The query params
   *
   * @property {String[]} queryParams
   * @public
   */
  queryParams: ['day'],

  /**
   * The currently selected day. Initializing as today, in case
   * no query param is specified.
   *
   * @property {String} _day
   * @public
   */
  day: moment().format('YYYY-MM-DD'),

  /**
   * The session service
   *
   * @property {EmberSimpleAuth.SessionService} session
   * @public
   */
  session: service('session'),

  /**
   * All activities
   *
   * @property {Activity[]} _allActivities
   * @private
   */
  _allActivities: computed(function() {
    return this.store.peekAll('activity')
  }),

  /**
   * All activities filtered by the selected day and the current user
   *
   * @property {Activity[]} _activities
   * @private
   */
  _activities: computed(
    'date',
    '_allActivities.@each.{date,user,isDeleted}',
    'user',
    function() {
      let activitiesThen = this.get('_allActivities').filter(a => {
        return (
          a.get('date') &&
          a.get('date').isSame(this.get('date'), 'day') &&
          a.get('user.id') === this.get('user.id') &&
          !a.get('isDeleted')
        )
      })

      if (activitiesThen.get('length')) {
        scheduleOnce('afterRender', this, () => {
          this.get('_activitySum').perform()
        })
      }

      return activitiesThen
    }
  ),

  /**
   * The duration sum of all activities of the selected day
   *
   * @property {moment.duration} activitySum
   * @public
   */
  activitySum: computed(
    '_activities.@each.{fromTime,toTime,duration}',
    '_activeActivityDuration',
    function() {
      return this.get('_activities').reduce((dur, cur) => {
        return dur.add(cur.get('duration'))
      }, this.get('_activeActivityDuration'))
    }
  ),

  /**
   * Compute the current activity sum
   *
   * @method _activitySum
   * @private
   */
  _activitySum: task(function*() {
    for (;;) {
      let duration = this.get('_activities')
        .filterBy('active')
        .reduce((dur, cur) => {
          return dur.add(moment().diff(cur.get('fromTime')))
        }, moment.duration())

      this.set('_activeActivityDuration', duration)

      /* istanbul ignore else */
      if (testing) {
        return
      }

      /* istanbul ignore next */
      yield timeout(1000)
    }
  }).drop(),

  /**
   * All attendances
   *
   * @property {Attendance[]} _allAttendances
   * @private
   */
  _allAttendances: computed(function() {
    return this.store.peekAll('attendance')
  }),

  /**
   * All attendances filtered by the selected day and the current user
   *
   * @property {Attendance[]} _attendances
   * @private
   */
  _attendances: computed(
    'date',
    '_allAttendances.@each.{date,user,isDeleted}',
    'user',
    function() {
      return this.get('_allAttendances').filter(a => {
        return (
          a.get('date') &&
          a.get('date').isSame(this.get('date'), 'day') &&
          a.get('user.id') === this.get('user.id') &&
          !a.get('isDeleted')
        )
      })
    }
  ),

  /**
   * The duration sum of all attendances of the selected day
   *
   * @property {moment.duration} attendanceSum
   * @public
   */
  attendanceSum: computed('_attendances.@each.{from,to}', function() {
    return this.get('_attendances').reduce((dur, cur) => {
      return dur.add(cur.get('duration'))
    }, moment.duration())
  }),

  /**
   * All reports
   *
   * @property {Report[]} _allReports
   * @private
   */
  _allReports: computed(function() {
    return this.store.peekAll('report')
  }),

  /**
   * All absences
   *
   * @property {Absence[]} _allAbsences
   * @private
   */
  _allAbsences: computed(function() {
    return this.store.peekAll('absence')
  }),

  /**
   * All reports filtered by the selected day and the current user
   *
   * @property {Report[]} _reports
   * @private
   */
  _reports: computed(
    'date',
    '_allReports.@each.{date,user,isNew,isDeleted}',
    'user',
    function() {
      return this.get('_allReports').filter(r => {
        return (
          r.get('date').isSame(this.get('date'), 'day') &&
          r.get('user.id') === this.get('user.id') &&
          !r.get('isNew') &&
          !r.get('isDeleted')
        )
      })
    }
  ),

  /**
   * All absences filtered by the selected day and the current user
   *
   * @property {Absence[]} _absences
   * @private
   */
  _absences: computed(
    'date',
    '_allAbsences.@each.{date,user,isNew,isDeleted}',
    'user',
    function() {
      return this.get('_allAbsences').filter(a => {
        return (
          a.get('date').isSame(this.get('date'), 'day') &&
          a.get('user.id') === this.get('user.id') &&
          !a.get('isNew') &&
          !a.get('isDeleted')
        )
      })
    }
  ),

  /**
   * The duration sum of all reports of the selected day
   *
   * @property {moment.duration} reportSum
   * @public
   */
  reportSum: computed(
    '_reports.@each.duration',
    '_absences.@each.duration',
    function() {
      let reportDurations = this.get('_reports').mapBy('duration')
      let absenceDurations = this.get('_absences').mapBy('duration')

      return [...reportDurations, ...absenceDurations].reduce(
        (val, dur) => val.add(dur),
        moment.duration()
      )
    }
  ),

  /**
   * The absence of the current day if available
   *
   * This should always be the first of all absences of the day because in
   * theory, we can only have one absence per day.
   *
   * @property {Absence} absence
   * @public
   */
  absence: computed('_absences.[]', function() {
    return this.get('_absences').getWithDefault('firstObject', null)
  }),

  /**
   * All absence types
   *
   * @property {AbsenceType[]} absenceTypes
   * @public
   */
  absenceTypes: computed(function() {
    return this.store.peekAll('absence-type')
  }),

  /**
   * The currently selected day as a moment object
   *
   * @property {moment} date
   * @public
   */
  date: computed('day', {
    get() {
      return moment(this.get('day'), 'YYYY-MM-DD')
    },
    set(key, value) {
      this.set('day', value.format('YYYY-MM-DD'))

      return value
    }
  }),

  /**
   * The expected worktime of the user
   *
   * @property {moment.duration} expectedWorktime
   * @public
   */
  expectedWorktime: oneWay('user.activeEmployment.worktimePerDay'),

  /**
   * The workdays for the location related to the users active employment
   *
   * @property {Number[]} workdays
   * @public
   */
  workdays: oneWay('user.activeEmployment.location.workdays'),

  /**
   * The data for the weekly overview
   *
   * @property {Object[]} weeklyOverviewData
   * @public
   */
  weeklyOverviewData: computed(
    '_allReports.@each.{duration,date,user}',
    '_allAbsences.@each.{duration,date,user}',
    'date',
    'user',
    function() {
      let task = this.get('_weeklyOverviewData')

      task.perform(
        this.get('_allReports'),
        this.get('_allAbsences'),
        this.get('date'),
        this.get('user')
      )

      return task
    }
  ),

  /**
   * The task to compute the data for the weekly overview
   *
   * @property {EmberConcurrency.Task} _weeklyOverviewData
   * @private
   */
  _weeklyOverviewData: task(function*(allReports, allAbsences, date, user) {
    yield timeout(200)

    allReports = allReports.filter(
      r =>
        r.get('user.id') === user.get('id') &&
        !r.get('isDeleted') &&
        !r.get('isNew')
    )

    allAbsences = allAbsences.filter(
      a =>
        a.get('user.id') === user.get('id') &&
        !a.get('isDeleted') &&
        !a.get('isNew')
    )

    let allHolidays = this.store.peekAll('public-holiday')

    // Build an object containing reports, absences and holidays
    // {
    //  '2017-03-21': {
    //    reports: [report1, report2, ...],
    //    absences: [absence1, ...],
    //    publicHolidays: [publicHoliday1, ...]
    //  }
    //  ...
    // }
    let container = [
      ...allReports.toArray(),
      ...allAbsences.toArray(),
      ...allHolidays.toArray()
    ].reduce((obj, model) => {
      let d = model.get('date').format('YYYY-MM-DD')

      obj[d] = obj[d] || { reports: [], absences: [], publicHolidays: [] }

      obj[d][`${camelize(model.constructor.modelName)}s`].push(model)

      return obj
    }, {})

    return Array.from({ length: 31 }, (v, k) =>
      moment(date).add(k - 20, 'days')
    ).map(d => {
      let { reports = [], absences = [], publicHolidays = [] } =
        container[d.format('YYYY-MM-DD')] || {}

      let prefix = ''

      if (publicHolidays.length) {
        prefix = publicHolidays.get('firstObject.name')
      } else if (absences.length) {
        prefix = absences.get('firstObject.type.name')
      }

      return {
        day: d,
        active: d.isSame(date, 'day'),
        absence: !!absences.length,
        workday: this.get('workdays').includes(d.isoWeekday()),
        worktime: [
          ...reports.mapBy('duration'),
          ...absences.mapBy('duration')
        ].reduce((val, dur) => val.add(dur), moment.duration()),
        holiday: !!publicHolidays.length,
        prefix
      }
    })
  }).restartable(),

  /**
   * Set a new center for the calendar and load all disabled dates
   *
   * @method setCenter
   * @param {Object} value The value to set center to
   * @param {moment} value.moment The moment version of the value
   * @param {Date} value.date The date version of the value
   * @public
   */
  setCenter: task(function*({ moment: center }) {
    let from = moment(center)
      .startOf('month')
      .startOf('week')
      .startOf('day')
      .add(1, 'days')
    let to = moment(center)
      .endOf('month')
      .endOf('week')
      .endOf('day')
      .add(1, 'days')

    /* eslint-disable camelcase */
    let params = {
      from_date: from.format('YYYY-MM-DD'),
      to_date: to.format('YYYY-MM-DD'),
      user: this.get('user.id')
    }
    /* eslint-enable camelcase */

    let absences = yield this.store.query('absence', params)

    let publicHolidays = yield this.store.query('public-holiday', {
      ...params,
      location: this.get('user.activeEmployment.location.id')
    })

    let disabled = [...absences.mapBy('date'), ...publicHolidays.mapBy('date')]
    let date = moment(from)
    let workdays = this.get('workdays')

    while (date < to) {
      if (!workdays.includes(date.isoWeekday())) {
        disabled.push(moment(date))
      }
      date.add(1, 'days')
    }

    this.set('disabledDates', disabled)
    this.set('center', center)
  }).drop(),

  /**
   * The disabled dates without the current date
   *
   * @property {moment[]} disabledDatesForEdit
   * @public
   */
  disabledDatesForEdit: computed(
    'absence.date',
    'disabledDates.[]',
    function() {
      return this.get('absence.date').filter(
        d => !d.isSame(this.get('disabledDates'), 'day')
      )
    }
  ),

  actions: {
    /**
     * Rollback the changes made in the absence dialogs
     *
     * @method rollback
     * @param {EmberChangeset.Changeset} changeset The changeset to rollback
     * @public
     */
    rollback(changeset) {
      this.get('setCenter').perform({ moment: this.get('date') })

      changeset.rollback()
    }
  }
})
